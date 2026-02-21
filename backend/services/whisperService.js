/**
 * Whisper Speech-to-Text Service
 * Uses HuggingFace Inference API with openai/whisper-large-v3
 */

const WHISPER_URL = "https://router.huggingface.co/hf-inference/models/openai/whisper-large-v3";

export async function transcribeAudio(audioBuffer, language = "en") {
    const hfKey = process.env.HUGGINGFACE_KEY;
    if (!hfKey) {
        throw new Error("HUGGINGFACE_KEY not configured");
    }

    console.log(`🎙️ Whisper: Transcribing ${(audioBuffer.length / 1024).toFixed(1)}KB audio (lang: ${language})`);

    // Build the URL with language hint for better accuracy
    const whisperLang = language === "ml" ? "ml" : "en";
    const url = `${WHISPER_URL}`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${hfKey}`,
            "Content-Type": "audio/webm",
        },
        body: audioBuffer,
    });

    if (!res.ok) {
        const errText = await res.text().catch(() => "unknown");
        console.error(`❌ Whisper API error ${res.status}:`, errText);
        throw new Error(`Whisper API returned ${res.status}`);
    }

    const data = await res.json();

    // Whisper returns { text: "transcribed text..." }
    const transcript = data?.text?.trim();
    if (!transcript) {
        throw new Error("Whisper returned empty transcript");
    }

    console.log(`✅ Whisper transcript: "${transcript.substring(0, 80)}${transcript.length > 80 ? '...' : ''}"`);
    return transcript;
}
