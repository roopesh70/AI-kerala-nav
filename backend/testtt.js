import fs from "fs";
import dotenv from "dotenv";
import { transcribeAudio } from "./services/whisperService.js";

dotenv.config();

// Optional: use your AI model to convert phonetic Malayalam → Malayalam script
async function convertToMalayalam(text) {
    try {
        const res = await fetch(
            "https://router.huggingface.co/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "HuggingFaceH4/zephyr-7b-beta:featherless-ai",
                    messages: [
                        {
                            role: "system",
                            content:
                                "Convert Malayalam spoken in English letters into Malayalam script. If the text is English, return it unchanged.",
                        },
                        { role: "user", content: text },
                    ],
                    temperature: 0,
                    max_tokens: 100,
                }),
            }
        );

        const data = await res.json();
        return data?.choices?.[0]?.message?.content?.trim() || text;
    } catch {
        return text;
    }
}

async function testWhisper() {
    try {
        console.log("🎤 Reading audio file...");

        const audioBuffer = fs.readFileSync("./sample.m4a");

        const transcript = await transcribeAudio(audioBuffer);

        console.log("\n📝 RAW TRANSCRIPT:");
        console.log(transcript);

        // detect possible Malayalam phonetic speech
        const malayalamVersion = await convertToMalayalam(transcript);

        console.log("\n🌍 MALAYALAM SCRIPT:");
        console.log(malayalamVersion);

        console.log("\n✅ FINAL TEXT FOR AI:");
        console.log(malayalamVersion);

    } catch (error) {
        console.error("\n❌ Test Failed:");
        console.error(error.message);
    }
}

testWhisper();