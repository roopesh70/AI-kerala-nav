const URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

async function callEnhancerModel(apiKey, text, language = "en") {
    const languageInstruction = language === "ml"
        ? `CRITICAL: You MUST respond ENTIRELY in Malayalam (മലയാളം) script. Every word must be in Malayalam. Do NOT use English words except proper nouns, URLs, and amounts. Use simple everyday Malayalam.`
        : `Respond in clear, simple English.`;

    const systemPrompt = `You are an expert, friendly AI assistant for Kerala Government Services. 
Your job is to take raw, structured data about a service and rewrite it to be extremely engaging, highly attractive, very readable, and helpful. 
Use markdown formatting, appropriate emojis (but don't overdo it), clear headings, and bullet points. 
Make the tone encouraging and supportive. DO NOT change the factual information (amounts, steps, documents), just enhance the presentation.
Include a "Pro Tip" or "Helpful Hint" section if applicable. Keep it concise.
${languageInstruction}`;

    const prompt = `${systemPrompt}\n\nHere is the raw data:\n${text}`;

    const res = await fetch(`${URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
        }),
    });

    const data = await res.json();

    if (!res.ok) {
        console.log("Enhancer Gemini error:", data);
        throw new Error("Enhancer Gemini failed");
    }

    return data.candidates[0].content.parts[0].text;
}

export async function enhanceResponse(formattedText, language = "en") {
    // Use primary enhancer key
    if (process.env.GEMINI_ENHANCER_KEY) {
        try {
            console.log("Enhancing with Primary Enhancer Key...");
            return await callEnhancerModel(process.env.GEMINI_ENHANCER_KEY, formattedText, language);
        } catch (err) {
            console.log("Primary Enhancer failed.", err.message);
        }
    } else {
        console.log("Warning: GEMINI_ENHANCER_KEY not set.");
    }

    // Fallback to backup enhancer key
    if (process.env.GEMINI_ENHANCER_BACKUP_KEY) {
        try {
            console.log("Enhancing with Backup Enhancer Key...");
            return await callEnhancerModel(process.env.GEMINI_ENHANCER_BACKUP_KEY, formattedText, language);
        } catch (err) {
            console.log("Backup Enhancer failed.", err.message);
        }
    } else {
        console.log("Warning: GEMINI_ENHANCER_BACKUP_KEY not set.");
    }

    // If both fail or neither is set, return the original formatted text gracefully
    console.log("Falling back to raw formatted text for service lookup.");
    return formattedText;
}
