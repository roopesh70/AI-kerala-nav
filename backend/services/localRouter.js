function buildLocalSystemPrompt(language = "en") {
    if (language === "ml") {
        return "You are a Kerala government services assistant. Reply only in simple Malayalam script. Use clear headings and bullet points. Keep spaces between words natural. Do not output random or merged text.";
    }

    return "You are a Kerala government services assistant. Reply in simple English with clear sections and bullet points.";
}

async function callLocalModel(model, message, language = "en") {
    const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model,
            system: buildLocalSystemPrompt(language),
            prompt: message,
            stream: false,
            options: {
                temperature: 0.2,
                num_predict: 350
            }
        })
    });

    if (!res.ok) throw new Error(`${model} failed`);

    const data = await res.json();
    return data.response;
}

export async function localAI(message, language = "en") {
    try {
        console.log("Trying DeepSeek cloud...");
        return await callLocalModel("deepseek-v3.2:cloud", message, language);
    } catch (e) {
        console.log("DeepSeek failed");

        try {
            console.log("Trying Qwen 7B...");
            return await callLocalModel("qwen2.5:7b", message, language);
        } catch (e) {
            console.log("Qwen failed");

            try {
                console.log("Trying Phi3 fallback...");
                return await callLocalModel("phi3", message, language);
            } catch (e) {
                console.log("All local models failed");
                if (language === "ml") {
                    return "ക്ഷമിക്കണം, ഇപ്പോൾ നിങ്ങളുടെ അഭ്യർത്ഥന പ്രോസസ് ചെയ്യാൻ കഴിയുന്നില്ല. ദയവായി കുറച്ച് സമയത്തിന് ശേഷം വീണ്ടും ശ്രമിക്കുക. വരുമാന സർട്ടിഫിക്കറ്റ്, ആധാർ അപ്ഡേറ്റ്, റേഷൻ കാർഡ് തുടങ്ങിയ കേരള സർക്കാർ സേവനങ്ങളെ കുറിച്ച് ചോദിച്ച് നോക്കൂ.";
                }
                return "I apologize, but I'm currently unable to process your request. Please try again in a moment, or try asking about a specific Kerala government service like Income Certificate, Aadhaar Update, or Ration Card.";
            }
        }
    }
}
