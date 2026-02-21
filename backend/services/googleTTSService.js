const TTS_URL = "https://texttospeech.googleapis.com/v1/text:synthesize";

function cleanTextForTTS(text) {
    return String(text || "")
        .replace(/https?:\/\/\S+/g, " ")
        .replace(/[#*_`>|[\]{}]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function getApiKey() {
    return (
        process.env.GOOGLE_TTS_API_KEY ||
        process.env.GOOGLE_API_KEY ||
        process.env.GCLOUD_API_KEY ||
        ""
    );
}

function getVoiceCandidates(language = "en") {
    if (language === "ml") {
        return [
            { languageCode: "ml-IN", name: "ml-IN-Wavenet-A", ssmlGender: "FEMALE" },
            { languageCode: "ml-IN", name: "ml-IN-Standard-A", ssmlGender: "FEMALE" },
            { languageCode: "ml-IN", name: "", ssmlGender: "FEMALE" },
        ];
    }

    return [
        { languageCode: "en-IN", name: "en-IN-Wavenet-A", ssmlGender: "FEMALE" },
        { languageCode: "en-IN", name: "en-IN-Standard-A", ssmlGender: "FEMALE" },
        { languageCode: "en-IN", name: "", ssmlGender: "FEMALE" },
    ];
}

async function synthesizeWithVoice(apiKey, text, voice) {
    const voiceConfig = {
        languageCode: voice.languageCode,
        ssmlGender: voice.ssmlGender || "FEMALE",
    };

    if (voice.name) {
        voiceConfig.name = voice.name;
    }

    const res = await fetch(`${TTS_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            input: { text },
            voice: voiceConfig,
            audioConfig: {
                audioEncoding: "MP3",
                speakingRate: voice.languageCode === "ml-IN" ? 0.9 : 0.95,
                pitch: 0,
            },
        }),
    });

    const bodyText = await res.text();
    let data = null;
    try {
        data = JSON.parse(bodyText);
    } catch {
        data = null;
    }

    if (!res.ok) {
        const err = data?.error?.message || bodyText || `TTS error ${res.status}`;
        throw new Error(err);
    }

    const audio = data?.audioContent;
    if (!audio) {
        throw new Error("No audioContent in TTS response");
    }

    return audio;
}

export async function synthesizeSpeech(text, language = "en") {
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error("Google TTS API key missing (set GOOGLE_TTS_API_KEY)");
    }

    const cleanedText = cleanTextForTTS(text);
    if (!cleanedText) {
        throw new Error("No text to synthesize");
    }

    const voices = getVoiceCandidates(language === "ml" ? "ml" : "en");
    let lastError = null;

    for (const voice of voices) {
        try {
            return await synthesizeWithVoice(apiKey, cleanedText, voice);
        } catch (err) {
            lastError = err;
        }
    }

    throw lastError || new Error("All Google TTS voice attempts failed");
}
