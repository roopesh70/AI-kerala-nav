import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const QUALITY_HINTS = ['natural', 'neural', 'google', 'microsoft', 'siri', 'enhanced'];

function cleanForTTS(text) {
    if (!text) return '';
    return text
        .replace(/https?:\/\/\S+/g, '')
        .replace(/[#*_`>|[\]{}]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function splitForSpeech(text) {
    const cleaned = cleanForTTS(text);
    if (!cleaned) return [];

    const sentences = cleaned.split(/(?<=[.!?])\s+/);
    const chunks = [];
    let current = '';
    for (const sentence of sentences) {
        if ((current + ' ' + sentence).trim().length > 180) {
            if (current.trim()) chunks.push(current.trim());
            current = sentence;
        } else {
            current = `${current} ${sentence}`.trim();
        }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks.slice(0, 20);
}

function scoreVoice(voice, language) {
    const target = language === 'ml' ? 'ml' : 'en';
    const lang = (voice.lang || '').toLowerCase();
    const name = (voice.name || '').toLowerCase();

    let score = 0;
    if (lang.startsWith(`${target}-`)) score += 100;
    if (language === 'en' && lang.includes('-in')) score += 30;
    if (language === 'ml' && lang.includes('-in')) score += 25;
    if (!voice.localService) score += 5;
    if (voice.default) score += 5;
    for (const hint of QUALITY_HINTS) {
        if (name.includes(hint)) score += 10;
    }
    return score;
}

export default function VoiceOutput({ text, language }) {
    const [state, setState] = useState('idle'); // idle | loading | playing | error
    const [source, setSource] = useState('');
    const [voices, setVoices] = useState([]);
    const audioRef = useRef(null);
    const mountedRef = useRef(true);
    const queueRef = useRef([]);

    useEffect(() => {
        mountedRef.current = true;

        if (window.speechSynthesis) {
            const loadVoices = () => setVoices(window.speechSynthesis.getVoices() || []);
            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            mountedRef.current = false;
            if (window.speechSynthesis) {
                window.speechSynthesis.onvoiceschanged = null;
            }
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const bestVoice = useMemo(() => {
        if (!voices.length) return null;
        return [...voices].sort((a, b) => scoreVoice(b, language) - scoreVoice(a, language))[0] || null;
    }, [voices, language]);

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }

        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

        queueRef.current = [];
        if (mountedRef.current) {
            setState('idle');
            setSource('');
        }
    }, []);

    const playGoogleTTS = useCallback(async (cleanedText) => {
        try {
            const res = await fetch(`${API_URL}/tts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: cleanedText, language }),
            });

            if (!res.ok) {
                throw new Error(`TTS API ${res.status}`);
            }

            const data = await res.json();
            if (!data.audio) {
                throw new Error('No audio returned');
            }

            const audioBytes = atob(data.audio);
            const byteArray = new Uint8Array(audioBytes.length);
            for (let i = 0; i < audioBytes.length; i++) {
                byteArray[i] = audioBytes.charCodeAt(i);
            }

            const blob = new Blob([byteArray], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onended = () => {
                URL.revokeObjectURL(url);
                if (mountedRef.current) {
                    setState('idle');
                    setSource('');
                }
            };
            audio.onerror = () => {
                URL.revokeObjectURL(url);
                if (mountedRef.current) {
                    setState('error');
                    setSource('');
                }
            };

            await audio.play();
            if (mountedRef.current) {
                setState('playing');
                setSource('google');
            }
            return true;
        } catch {
            return false;
        }
    }, [language]);

    const speakNextChunk = useCallback(() => {
        if (!queueRef.current.length) {
            if (mountedRef.current) {
                setState('idle');
                setSource('');
            }
            return;
        }

        const sentence = queueRef.current.shift();
        const utter = new SpeechSynthesisUtterance(sentence);
        utter.lang = language === 'ml' ? 'ml-IN' : 'en-IN';
        utter.rate = language === 'ml' ? 0.82 : 0.9;
        utter.pitch = 1;
        utter.volume = 1;
        if (bestVoice) utter.voice = bestVoice;

        utter.onend = speakNextChunk;
        utter.onerror = () => {
            if (mountedRef.current) {
                setState('error');
                setSource('');
            }
        };

        window.speechSynthesis.speak(utter);
    }, [bestVoice, language]);

    const playBrowserTTS = useCallback((cleanedText) => {
        if (!window.speechSynthesis) return false;
        const chunks = splitForSpeech(cleanedText);
        if (!chunks.length) return false;

        window.speechSynthesis.cancel();
        queueRef.current = chunks;
        speakNextChunk();

        if (mountedRef.current) {
            setState('playing');
            setSource('browser');
        }
        return true;
    }, [speakNextChunk]);

    const toggleSpeak = useCallback(async () => {
        if (state === 'playing' || state === 'loading') {
            stop();
            return;
        }

        const cleanedText = cleanForTTS(text);
        if (!cleanedText) return;

        setState('loading');
        setSource('');

        const googleSuccess = await playGoogleTTS(cleanedText);
        if (googleSuccess) return;

        const browserSuccess = playBrowserTTS(cleanedText);
        if (browserSuccess) return;

        if (mountedRef.current) {
            setState('error');
            setSource('');
        }
    }, [state, stop, text, playGoogleTTS, playBrowserTTS]);

    const hasText = !!cleanForTTS(text);
    const missingMlVoice = language === 'ml' && source === 'browser' && bestVoice && !bestVoice.lang?.toLowerCase().startsWith('ml');

    return (
        <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <button
                    className={`clay-btn ${state === 'playing' || state === 'loading' ? 'clay-btn-primary' : 'clay-btn-ghost'}`}
                    onClick={toggleSpeak}
                    disabled={!hasText}
                    aria-label={state === 'playing' ? (language === 'ml' ? 'വായന നിർത്തുക' : 'Stop reading') : (language === 'ml' ? 'ഉത്തരം വായിക്കുക' : 'Read response aloud')}
                    style={{ minWidth: 140, fontSize: 15, padding: '10px 18px' }}
                >
                    {state === 'loading'
                        ? (language === 'ml' ? '⏳ ലോഡിംഗ്...' : '⏳ Loading...')
                        : state === 'playing'
                            ? (language === 'ml' ? '⏹️ നിർത്തുക' : '⏹️ Stop')
                            : (language === 'ml' ? '🔊 കേൾക്കുക' : '🔊 Listen')}
                </button>

                <span style={{ fontSize: 13, opacity: 0.7, color: 'var(--slate)', marginLeft: 'auto' }}>
                    {state === 'playing' && (source === 'google'
                        ? (language === 'ml' ? '🔈 വായിക്കുന്നു (Google TTS)' : '🔈 Speaking (Google TTS)')
                        : (language === 'ml' ? '🔈 വായിക്കുന്നു...' : '🔈 Speaking...'))}
                </span>
            </div>

            {missingMlVoice && (
                <div className="alert-card alert-warning" style={{ marginTop: 6, fontSize: 13 }}>
                    ℹ️ {language === 'ml'
                        ? 'Google TTS ലഭിച്ചില്ല. ബ്രൗസറിലെ ഡിഫോൾട്ട് ശബ്ദം ഉപയോഗിക്കുന്നു.'
                        : 'Google TTS unavailable. Using browser default voice.'}
                </div>
            )}

            {state === 'error' && (
                <div className="alert-card alert-warning" style={{ marginTop: 6, fontSize: 13 }}>
                    ⚠️ {language === 'ml'
                        ? 'ശബ്ദം പ്ലേ ചെയ്യാൻ കഴിഞ്ഞില്ല. API കീയും ഓഡിയോ സെറ്റിംഗ്സും പരിശോധിക്കുക.'
                        : 'Voice playback unavailable. Check API key and browser audio settings.'}
                </div>
            )}
        </div>
    );
}
