import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { getAIResponse } from "./services/aiRouter.js";
import { geminiTranscribe } from "./services/geminiVoiceService.js";
import { transcribeAudio } from "./services/whisperService.js";
import { synthesizeSpeech } from "./services/googleTTSService.js";
import { db } from "./firebase.js";

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB max

// Enhanced CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        // Allow any localhost port
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }
        // Allow configured frontend URL
        if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "Kerala AI Navigator backend running",
        version: "2.0",
        features: ["AI responses", "location-aware", "Malayalam support"]
    });
});

// Validation middleware for location
function validateLocation(rawLocation) {
    if (!rawLocation) return null;
    if (!Number.isFinite(rawLocation.lat) || !Number.isFinite(rawLocation.lng)) return null;
    return {
        lat: Number(Number(rawLocation.lat).toFixed(6)),
        lng: Number(Number(rawLocation.lng).toFixed(6)),
    };
}

app.get("/chats/:userId", async (req, res) => {
    if (!db) return res.json({ chats: [], status: "offline" });

    try {
        const { userId } = req.params;
        if (!userId || userId.length < 1) {
            return res.status(400).json({ error: "Invalid userId" });
        }

        const snapshot = await db
            .collection("chats")
            .where("userId", "==", userId)
            .orderBy("timestamp", "desc")
            .limit(50)
            .get();

        const history = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate?.() || new Date(),
        }));

        res.json({ chats: history, status: "ok" });
    } catch (err) {
        console.error("Error fetching chats:", err.message);
        res.status(500).json({ error: "Failed to load chat history", status: "error" });
    }
});

app.get("/todo/:serviceId", async (req, res) => {
    if (!db) return res.status(503).json({ error: "Database unavailable" });

    try {
        const { serviceId } = req.params;
        if (!serviceId) return res.status(400).json({ error: "serviceId required" });

        const doc = await db.collection("services").doc(serviceId).get();
        if (!doc.exists) return res.status(404).json({ error: "Service not found" });

        const serviceData = doc.data();
        const tasks = (serviceData.steps || []).map((step) => ({
            task: typeof step === 'string' ? step : step.task || '',
            done: false
        }));

        res.json({ todo: tasks, status: "ok" });
    } catch (err) {
        console.error("Error fetching to-do list:", err.message);
        res.status(500).json({ error: "Failed to generate to-do list", status: "error" });
    }
});

app.post("/whisper", upload.single("audio"), async (req, res) => {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ error: "No audio file provided", text: "" });
        }

        const language = req.body?.language === "ml" ? "ml" : "en";
        const sizeKB = (req.file.size / 1024).toFixed(1);
        console.log(`\n🎙️ Voice transcription request: ${sizeKB}KB, lang=${language}`);

        let transcript = null;
        let source = "unknown";

        // 1️⃣ Primary: Gemini Voice
        try {
            transcript = await geminiTranscribe(req.file.buffer, language);
            source = "gemini-voice";
            console.log(`✅ Gemini Voice succeeded`);
        } catch (geminiErr) {
            console.warn(`⚠️ Gemini Voice failed: ${geminiErr.message}`);

            // 2️⃣ Fallback: Whisper (HuggingFace)
            try {
                transcript = await transcribeAudio(req.file.buffer, language);
                source = "whisper";
                console.log(`✅ Whisper fallback succeeded`);
            } catch (whisperErr) {
                console.error(`❌ Whisper also failed: ${whisperErr.message}`);
                throw new Error("All transcription services failed");
            }
        }

        return res.json({
            text: transcript,
            language,
            source,
            status: "ok",
        });
    } catch (err) {
        console.error("❌ Voice endpoint error:", err.message);
        return res.status(500).json({
            error: err.message || "Transcription failed",
            text: "",
            source: "error",
            status: "error",
        });
    }
});

app.post("/tts", async (req, res) => {
    try {
        const text = req.body?.text?.trim();
        const language = req.body?.language === "ml" ? "ml" : "en";

        if (!text) {
            return res.status(400).json({
                error: "No text provided",
                audio: "",
                source: "validation",
                status: "error",
            });
        }

        const audioBase64 = await synthesizeSpeech(text, language);
        return res.json({
            audio: audioBase64,
            language,
            source: "google-tts",
            status: "ok",
        });
    } catch (err) {
        console.error("TTS endpoint error:", err.message);
        return res.status(500).json({
            error: err.message || "TTS failed",
            audio: "",
            source: "error",
            status: "error",
        });
    }
});

app.post("/ai", async (req, res) => {
    try {
        const message = req.body?.message?.trim();
        const userId = (req.body?.userId?.trim() || "anonymous").substring(0, 100);
        const language = req.body?.language === "ml" ? "ml" : "en";
        const location = validateLocation(req.body?.location);

        if (!message || message.length < 2) {
            return res.status(400).json({
                error: "Invalid query",
                reply: language === "ml"
                    ? "ദയവായി ഒരു ചോദ്യം ഇടുക (കുറഞ്ഞത് 2 അക്ഷരങ്ങൾ)"
                    : "Please enter a valid question (at least 2 characters)",
                source: "validation"
            });
        }

        if (message.length > 500) {
            return res.status(400).json({
                error: "Query too long",
                reply: language === "ml"
                    ? "ചോദ്യം വളരെ നീളമുണ്ട്. ചെറുതായി എഴുതുക."
                    : "Your question is too long. Please make it shorter.",
                source: "validation"
            });
        }

        console.log(`🔍 Query: "${message}" | User: ${userId} | Lang: ${language} | Location: ${location ? `${location.lat},${location.lng}` : 'N/A'}`);

        const result = await getAIResponse(message, { language, location });

        console.log(`✅ Source: ${result.source}`);

        // Save to Firestore asynchronously (don't wait)
        if (db) {
            db.collection("chats").add({
                userId,
                message,
                language,
                location,
                reply: result.reply?.substring(0, 5000) || '',
                source: result.source || "unknown",
                timestamp: new Date(),
            }).catch((err) => console.warn("Firestore save skipped:", err.message));
        }

        return res.json({
            reply: result.reply || (language === "ml" ? "ഉത്തരം ലഭ്യമല്ല" : "No answer available"),
            serviceId: result.serviceId || null,
            source: result.source || "unknown",
            lifeEvent: result.lifeEvent || null,
            applyAt: result.applyAt || null,
            steps: result.steps || [],
            requiredDocuments: result.requiredDocuments || [],
            fee: result.fee || null,
            processingTime: result.processingTime || null,
            validity: result.validity || null,
            bestVisitTime: result.bestVisitTime || null,
            serviceName: result.serviceName || null,
            serviceName_ml: result.serviceName_ml || null,
            akshayaEligible: result.akshayaEligible || false,
            department: result.department || null,
            notes: result.notes || null,
            onlineApplyUrl: result.onlineApplyUrl || null,
            status: "ok"
        });
    } catch (err) {
        console.error("❌ AI request failed:", err.message);
        const language = req.body?.language === "ml" ? "ml" : "en";

        res.status(500).json({
            error: "Processing failed",
            reply: language === "ml"
                ? "ക്ഷമിക്കണം, ഇപ്പോൾ ചോദ്യം പ്രോസസ് ചെയ്യാൻ കഴിഞ്ഞില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക."
                : "Sorry, I'm having trouble processing your request. Please try again.",
            source: "error",
            status: "error"
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
        error: "Internal server error",
        status: "error"
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: "Endpoint not found",
        status: "error"
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Kerala AI Navigator Backend`);
    console.log(`📍 Running at http://localhost:${PORT}`);
    console.log(`✅ Status: Ready for requests\n`);
});
