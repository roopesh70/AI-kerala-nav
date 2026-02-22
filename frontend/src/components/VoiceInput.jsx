import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LANG_CHAIN = {
    ml: ['ml-IN', 'en-IN', 'en-US'],
    en: ['en-IN', 'en-US', 'ml-IN'],
};

function getSpeechRecognition() {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

/**
 * VoiceInput — records audio from mic and transcribes via:
 *   1. HuggingFace Whisper API (server-side, best accuracy, especially Malayalam)
 *   2. Browser SpeechRecognition (fallback)
 */
export default function VoiceInput({ onTranscript, language }) {
    // idle | recording | transcribing | listening | error | unsupported | blocked
    const [state, setState] = useState('idle');
    const [attempt, setAttempt] = useState(0);
    const [errorCode, setErrorCode] = useState('');
    const [recordingTime, setRecordingTime] = useState(0);
    const recognitionRef = useRef(null);
    const manualStopRef = useRef(false);
    const stateRef = useRef('idle');
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);
    const streamRef = useRef(null);

    const supportInfo = useMemo(() => {
        const supported = typeof window !== 'undefined' && !!getSpeechRecognition();
        const hasMic = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
        const secure = typeof window !== 'undefined' ? (window.isSecureContext || window.location.hostname === 'localhost') : true;
        return { supported, hasMic, secure };
    }, []);

    const updateState = useCallback((newState) => {
        stateRef.current = newState;
        setState(newState);
    }, []);

    // ── Cleanup helpers ──
    const clearTimer = () => {
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    };

    const releaseStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
    };

    // ── WHISPER PATH: Record audio → send to /whisper ──
    const stopRecording = useCallback(async () => {
        clearTimer();
        setRecordingTime(0);

        // Do NOT set manualStopRef here — we WANT to transcribe the audio
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    }, []);

    const sendToWhisper = useCallback(async (audioBlob) => {
        updateState('transcribing');
        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');
            formData.append('language', language);

            const res = await fetch(`${API_URL}/whisper`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || `Whisper API returned ${res.status}`);
            }

            const data = await res.json();
            if (data.text && data.text.trim()) {
                console.log('🎙️ Whisper transcript:', data.text);
                if (onTranscript) onTranscript(data.text.trim());
                updateState('idle');
                return true;
            }
            throw new Error('Empty transcript');
        } catch (err) {
            console.warn('Whisper failed, falling back to browser Speech API:', err.message);
            setErrorCode('whisper-fallback');
            return false;
        }
    }, [language, onTranscript, updateState]);

    const startRecording = useCallback(async () => {
        if (!supportInfo.hasMic || !supportInfo.secure) {
            updateState('blocked');
            setErrorCode(!supportInfo.secure ? 'insecure-context' : 'no-mic');
            return;
        }

        manualStopRef.current = false;
        setErrorCode('');
        audioChunksRef.current = [];

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : MediaRecorder.isTypeSupported('audio/webm')
                    ? 'audio/webm'
                    : 'audio/ogg';

            const recorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            recorder.onstop = async () => {
                releaseStream();
                const blob = new Blob(audioChunksRef.current, { type: mimeType });
                audioChunksRef.current = [];

                if (blob.size < 100) {
                    updateState('idle');
                    return;
                }

                // Try Whisper first
                const whisperSuccess = await sendToWhisper(blob);
                if (!whisperSuccess) {
                    // Fall back to browser SpeechRecognition
                    startBrowserRecognition();
                }
            };

            recorder.start(250); // collect data every 250ms
            updateState('recording');
            setRecordingTime(0);

            // Timer for recording duration
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => {
                    if (prev >= 30) { // Auto-stop after 30 seconds
                        stopRecording();
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000);

        } catch (err) {
            releaseStream();
            console.error('Mic access error:', err);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                updateState('blocked');
                setErrorCode('permission-denied');
            } else {
                updateState('error');
                setErrorCode('mic-error');
                setTimeout(() => updateState('idle'), 3000);
            }
        }
    }, [supportInfo, updateState, sendToWhisper, stopRecording]);

    // ── BROWSER SPEECH API FALLBACK ──
    const startBrowserRecognition = useCallback(() => {
        const SpeechRecognition = getSpeechRecognition();
        if (!SpeechRecognition) {
            updateState('error');
            setErrorCode('speech-unsupported');
            setTimeout(() => updateState('idle'), 3000);
            return;
        }

        manualStopRef.current = false;

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.lang = LANG_CHAIN[language]?.[attempt] || (language === 'ml' ? 'ml-IN' : 'en-IN');

        recognition.onstart = () => updateState('listening');
        recognition.onresult = (event) => {
            const transcript = event.results?.[0]?.[0]?.transcript?.trim();
            if (transcript && onTranscript) onTranscript(transcript);
            setAttempt(0);
            setErrorCode('');
            updateState('idle');
        };
        recognition.onerror = (event) => {
            const code = event?.error || 'unknown';

            if (code === 'not-allowed' || code === 'service-not-allowed') {
                updateState('blocked');
                setErrorCode('permission-denied');
                return;
            }

            const nextAttempt = attempt + 1;
            if (!manualStopRef.current && nextAttempt < (LANG_CHAIN[language]?.length || 1)) {
                setAttempt(nextAttempt);
                updateState('idle');
                return;
            }

            setAttempt(0);
            updateState('error');
            setErrorCode(code);
            setTimeout(() => updateState('idle'), 3000);
        };
        recognition.onend = () => {
            recognitionRef.current = null;
            if (stateRef.current === 'listening') updateState('idle');
        };

        recognitionRef.current = recognition;
        recognition.start();
    }, [attempt, language, onTranscript, updateState]);

    // Auto-retry with next language on fallback
    useEffect(() => {
        if (attempt > 0 && state === 'idle') startBrowserRecognition();
    }, [attempt, state, startBrowserRecognition]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearTimer();
            releaseStream();
            if (recognitionRef.current) recognitionRef.current.abort();
            if (mediaRecorderRef.current?.state !== 'inactive') {
                try { mediaRecorderRef.current?.stop(); } catch { }
            }
        };
    }, []);

    // ── Click handlers ──
    const handleClick = () => {
        if (state === 'recording') {
            stopRecording();
        } else if (state === 'listening') {
            manualStopRef.current = true;
            if (recognitionRef.current) recognitionRef.current.stop();
            updateState('idle');
        } else if (state === 'idle' || state === 'error') {
            startRecording();
        }
    };

    const getMessage = () => {
        if (state === 'unsupported') {
            return language === 'ml'
                ? 'ഈ ബ്രൗസറിൽ ശബ്ദ തിരിച്ചറിയൽ സാധ്യമല്ല. Chrome ബ്രൗസർ ഉപയോഗിക്കുക.'
                : 'Voice is not supported in this browser. Use Chrome.';
        }
        if (state === 'blocked') {
            return language === 'ml'
                ? 'മൈക്രോഫോൺ അനുമതി വേണം. ബ്രൗസർ settings-ൽ മൈക്രോഫോൺ allow ചെയ്യുക.'
                : 'Need microphone permission. Check browser settings and allow mic access.';
        }
        if (state === 'error') {
            return language === 'ml'
                ? 'ശബ്ദം കേട്ടില്ല. ശാന്തമായ സ്ഥലത്ത് വ്യക്തമായി സംസാരിക്കുക.'
                : 'Could not hear. Retry in a quiet place. Speak clearly.';
        }
        return '';
    };

    const showError = state === 'error' || state === 'unsupported' || state === 'blocked';
    const isActive = state === 'recording' || state === 'listening' || state === 'transcribing';

    return (
        <div className="voice-row">
            <button
                className={`voice-btn ${isActive ? 'listening' : ''}`}
                onClick={handleClick}
                disabled={state === 'transcribing'}
                aria-label={language === 'ml' ? 'മലയാളത്തിലോ ഇംഗ്ലീഷിലോ സംസാരിക്കൂ' : 'Speak your query'}
                title={isActive
                    ? (language === 'ml' ? 'നിർത്താൻ ക്ലിക്ക് ചെയ്യുക' : 'Click to stop')
                    : (language === 'ml' ? 'സംസാരിക്കാൻ ക്ലിക്ക് ചെയ്യുക' : 'Click to speak')}
            >
                {state === 'recording' ? '⏹️' : state === 'transcribing' ? '⏳' : state === 'listening' ? '⏹️' : '🎙️'}
            </button>

            {state === 'idle' && (
                <button className="voice-pill" onClick={handleClick}>
                    <span className="voice-dot"></span>
                    {language === 'ml' ? 'മലയാളത്തിലോ ഇംഗ്ലീഷിലോ സംസാരിക്കാം' : 'Speak in Malayalam or English'}
                </button>
            )}

            {state === 'recording' && (
                <span style={{ fontWeight: 800, color: 'var(--coral)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    🔴 {language === 'ml' ? 'റെക്കോർഡിംഗ്...' : 'Recording...'} <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{recordingTime}s</span>
                    <span style={{ fontSize: 12, opacity: 0.7 }}>({language === 'ml' ? 'നിർത്താൻ ക്ലിക്ക്' : 'click to stop'})</span>
                </span>
            )}

            {state === 'transcribing' && (
                <span style={{ fontWeight: 800, color: 'var(--coral)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span>
                    {language === 'ml' ? 'Whisper AI ട്രാൻസ്ക്രൈബ് ചെയ്യുന്നു...' : 'Whisper AI transcribing...'}
                </span>
            )}

            {state === 'listening' && (
                <span style={{ fontWeight: 800, color: 'var(--coral)', fontSize: 14 }}>
                    🎤 {language === 'ml' ? 'ശ്രദ്ധിക്കുന്നു... സംസാരിക്കൂ' : 'Listening... Speak now'}
                    <span style={{ fontSize: 11, opacity: 0.6, marginLeft: 8 }}>(fallback)</span>
                </span>
            )}

            {showError && (
                <div className="alert-card alert-warning" style={{ flex: 1 }}>
                    ⚠️ {getMessage()}
                    {errorCode && <span style={{ marginLeft: 8, opacity: 0.7 }}>({errorCode})</span>}
                </div>
            )}
        </div>
    );
}
