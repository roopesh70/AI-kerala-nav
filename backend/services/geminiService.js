const URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

async function callGemini(apiKey, message) {
    const res = await fetch(`${URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: message }] }],
        }),
    });

    const data = await res.json();

    if (!res.ok) {
        console.log("Gemini error:", data);
        throw new Error("Gemini failed");
    }

    return data.candidates[0].content.parts[0].text;
}

export const geminiPrimary = (msg) =>
    callGemini(process.env.GEMINI_KEY_1, msg);

export const geminiSecondary = (msg) =>
    callGemini(process.env.GEMINI_KEY_2, msg);
