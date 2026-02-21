/**
 * Gemini Voice Service — Primary speech-to-text
 * Uses Gemini 2.5 Flash with inline audio for transcription
 * Falls back to Whisper if GEMINI_VOICE_KEY is not set or API fails
 */

const GEMINI_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function geminiTranscribe(audioBuffer, language = "en") {
    const apiKey = process.env.GEMINI_VOICE_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_VOICE_KEY not configured");
    }

    const base64Audio = audioBuffer.toString("base64");
    const sizeKB = (audioBuffer.length / 1024).toFixed(1);
    console.log(`🎙️ Gemini Voice: Transcribing ${sizeKB}KB audio (lang: ${language})`);

    const langInstruction = language === "ml"
        ? `You are a speech-to-text transcriber for Kerala, India.
Transcribe the audio EXACTLY as spoken. The speaker may use Malayalam, English, or a mix of both (Manglish).
- If the speech is in Malayalam, write in Malayalam script (e.g. ആധാർ കാർഡ് മാറ്റണം).
- If the speech is in English, write in English.
- If it's a mix, write each word in its original script.
- Return ONLY the transcript, nothing else. No explanations, no labels, no quotes.
- If the audio is unclear, transcribe your best guess. Do NOT return empty text.`
        : `Transcribe this audio accurately. The speaker may use English or Malayalam.
Return ONLY the transcript text, nothing else. Do not add explanations, labels, or quotes.
If the audio is unclear, transcribe your best guess. Do NOT return empty text.`;

    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{
                parts: [
                    { text: langInstruction },
                    {
                        inlineData: {
                            mimeType: "audio/webm",
                            data: base64Audio,
                        },
                    },
                ],
            }],
            generationConfig: {
                temperature: 0,
                maxOutputTokens: 500,
            },
        }),
    });

    const data = await res.json();

    if (!res.ok) {
        console.error(`❌ Gemini Voice API error ${res.status}:`, JSON.stringify(data).substring(0, 300));
        throw new Error(`Gemini Voice API returned ${res.status}`);
    }

    let transcript = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!transcript) {
        throw new Error("Gemini returned empty transcript");
    }

    // Clean up common Gemini quirks: remove surrounding quotes
    transcript = transcript.replace(/^["']|["']$/g, "").trim();

    console.log(`✅ Gemini transcript: "${transcript.substring(0, 80)}${transcript.length > 80 ? '...' : ''}"`);
    return transcript;
}
