function buildSystemPrompt(language = "en") {
    if (language === "ml") {
        return "You are a Kerala government services assistant. Reply only in clear, simple Malayalam script with short sections and bullet points. Keep spacing between words natural. Do not output gibberish.";
    }

    return "You are a Kerala government services assistant. Give clear, practical, step-by-step answers in simple English.";
}

export async function huggingFace(message, options = {}) {
    const language = options.language === "ml" ? "ml" : "en";
    try {
        const res = await fetch(
            "https://router.huggingface.co/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.HUGGINGFACE_KEY}`,
                },
                body: JSON.stringify({
                    model: "HuggingFaceH4/zephyr-7b-beta:featherless-ai",
                    messages: [
                        {
                            role: "system",
                            content: buildSystemPrompt(language),
                        },
                        {
                            role: "user",
                            content: message,
                        },
                    ],
                    max_tokens: 200,
                    temperature: 0.3,
                }),
            }
        );

        const text = await res.text();

        if (!res.ok) {
            console.error("HF Router Error:", text);
            return null; // allow fallback AI
        }

        const data = JSON.parse(text);

        return data?.choices?.[0]?.message?.content?.trim() || null;
    } catch (error) {
        console.error("HF Service Error:", error.message);
        return null; // fallback trigger
    }
}
