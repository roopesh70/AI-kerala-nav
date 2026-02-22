<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_2.5_Flash-AI-4285F4?logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Language-English%20%7C%20മലയാളം-green" />
</p>

# 🌿 Kerala AI Navigator — Government Service Guide

An **AI-powered, bilingual (English / Malayalam) web application** that helps citizens navigate Kerala's government services. Ask a question in plain language — the app returns step-by-step guidance, required documents, fees, timelines, nearest offices on a map, and even reads the answer aloud.

> Built for the **Smart India Hackathon / Kerala Government Services** track.

---

## 📌 Problem Statement

Accessing government services in Kerala is confusing and time-consuming for everyday citizens:

- **Information is scattered** across dozens of government websites, each with different layouts and languages.
- **Procedures are unclear** — citizens don't know which office to visit, what documents to bring, or how much it costs.
- **Language barriers** — many citizens are more comfortable in Malayalam, but most online resources are in English.
- **Life events** like a death in the family, marriage, or childbirth require completing _multiple_ government procedures across different offices, and there's no single guide that lists them all.

## 💡 Solution

**Kerala AI Navigator** is a conversational AI assistant that:

1. **Understands natural language** — ask in English or Malayalam, get answers in the same language.
2. **Provides verified, structured answers** — step-by-step guides, required documents, fees, processing times, and where to apply.
3. **Detects life events** — say _"My father passed away"_ or _"I just got married"_ and get a complete checklist of all government procedures you need to complete.
4. **Shows nearest offices on a map** — Google Maps integration with your live GPS location.
5. **Supports voice input/output** — speak your question and hear the answer read aloud.
6. **Works offline-ready** — local fallback data for 15+ services when the database is unavailable.
7. **Never fails silently** — a 4-tier AI fallback chain ensures the citizen always gets an answer.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🤖 **Multi-AI Fallback** | Gemini 2.5 Flash (primary) → Gemini (backup key) → HuggingFace Zephyr-7B → Local Ollama models |
| 🗣️ **Voice Input** | Record audio → Gemini Voice STT (primary) → Whisper STT via HuggingFace (fallback) → Browser Speech API (last resort) |
| 🔊 **Voice Output** | Google Cloud TTS (primary) → Browser SpeechSynthesis (fallback) |
| 🌐 **Bilingual** | Full English & Malayalam support with auto-detection of Malayalam script |
| 📋 **Life Event Checklists** | 6 life events: Death, Marriage, Childbirth, Relocation, Starting a Business, Turning 18 |
| 🏛️ **15+ Verified Services** | Aadhaar, PAN Card, Income Certificate, Caste Certificate, Land Records, Birth/Death Certificates, Pension, Ration Card, Scholarships, Driving Licence, and more |
| 🗺️ **Google Maps Integration** | Embedded map showing nearest offices with live user location |
| 📎 **Document Checklist** | Interactive checklist with localStorage persistence |
| 🔗 **Apply Online Links** | Direct links to official portals (e-District, Parivahan, etc.) |
| 🕐 **Search History** | Last 10 queries saved locally |
| 🔥 **Akshaya Eligible Badge** | Shows if a service can be done at Akshaya Centres |
| 💬 **Response Enhancement** | AI-powered polishing of structured service data into readable, engaging text |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                      │
│          Vite + React 19 SPA                    │
│                                                 │
│  HomeScreen → ServiceResult / LifeEventMode     │
│  VoiceInput (record → /whisper)                 │
│  VoiceOutput (Google TTS → Browser TTS)         │
│  MapView (Google Maps iframe embed)             │
│  Header (language toggle, location, history)    │
└──────────────────┬──────────────────────────────┘
                   │ REST API (JSON)
┌──────────────────▼──────────────────────────────┐
│                   BACKEND                       │
│            Express.js + Node.js                 │
│                                                 │
│  POST /ai      → AI Router (4-tier fallback)    │
│  POST /whisper  → Gemini Voice → Whisper STT    │
│  POST /tts      → Google Cloud TTS              │
│  GET  /chats    → Firestore chat history        │
│  GET  /todo     → Service step checklist        │
│                                                 │
│  AI Router Chain:                               │
│  ┌─────────────┐  ┌──────────┐  ┌───────────┐  │
│  │ Service     │→ │ Gemini   │→ │ HuggingFace│  │
│  │ Lookup +    │  │ (2 keys) │  │ Zephyr-7B  │  │
│  │ Life Events │  └──────────┘  └───────────┘  │
│  └─────────────┘        ↓                       │
│                  ┌─────────────┐                │
│                  │ Ollama Local│                │
│                  │ (offline)   │                │
│                  └─────────────┘                │
│                                                 │
│  Data: Firestore (primary) → Local JSON (fallback)│
└─────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
AI-kerala-nav/
├── backend/
│   ├── server.js                  # Express server (5 endpoints)
│   ├── firebase.js                # Firebase Admin SDK init (optional)
│   ├── .env.example               # Environment variable template
│   ├── package.json
│   └── services/
│       ├── aiRouter.js            # Main AI routing logic (4-tier fallback)
│       ├── geminiService.js       # Gemini 2.5 Flash API (primary + backup keys)
│       ├── geminiVoiceService.js   # Gemini-based speech-to-text
│       ├── whisperService.js      # HuggingFace Whisper STT (fallback)
│       ├── googleTTSService.js    # Google Cloud Text-to-Speech
│       ├── huggingfaceService.js  # HuggingFace Zephyr-7B (AI fallback)
│       ├── localRouter.js         # Ollama local models (offline fallback)
│       ├── responseEnhancer.js    # Gemini-based response polishing
│       ├── firestoreLookup.js     # Service lookup + local fallback data (15+ services)
│       └── lifeEvents.js          # Life event detection (6 events with checklists)
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── App.jsx                # Main app with routing, search, location
│       ├── main.jsx               # React entry point
│       ├── index.css              # Full design system (glassmorphism, animations)
│       └── components/
│           ├── HomeScreen.jsx     # Landing page with search + quick chips
│           ├── ServiceResult.jsx  # Service detail view with tabs + markdown renderer
│           ├── LifeEventMode.jsx  # Life event checklist with progress tracking
│           ├── VoiceInput.jsx     # Audio recording + transcription
│           ├── VoiceOutput.jsx    # Text-to-speech playback
│           ├── MapView.jsx        # Google Maps embed with geolocation
│           ├── RouteMap.jsx       # Step-by-step visual route
│           ├── Header.jsx         # Top bar (language toggle, location, history)
│           ├── HistoryPanel.jsx   # Sliding search history panel
│           ├── InfoCardsStrip.jsx # Summary info cards (fee, time, validity)
│           ├── DocumentChecklist.jsx # Interactive document checklist
│           ├── FeeTable.jsx       # Fee breakdown table
│           └── TabBar.jsx         # Tab navigation component
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm**
- API keys (see [Environment Variables](#-environment-variables) below)
- _(Optional)_ Firebase project with Firestore for persistent data
- _(Optional)_ [Ollama](https://ollama.ai) for offline local AI models

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/AI-kerala-nav.git
cd AI-kerala-nav
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure Environment Variables

Create `backend/.env` from the template:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and add your API keys (see section below).

### 4. Run the Application

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm start
```
The server starts at `http://localhost:5000`.

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
The frontend starts at `http://localhost:5173` (Vite dev server).

### 5. Open the App

Navigate to **http://localhost:5173** in your browser.

---

## 🔑 Environment Variables

Create a `backend/.env` file with the following keys:

| Variable | Required | Description |
|---|---|---|
| `GEMINI_KEY_1` | ✅ Yes | Google Gemini 2.5 Flash API key (primary) |
| `GEMINI_KEY_2` | Recommended | Gemini API key (backup, for failover) |
| `GEMINI_ENHANCER_KEY` | Optional | Gemini key for response polishing/enhancement |
| `GEMINI_ENHANCER_BACKUP_KEY` | Optional | Backup enhancer key |
| `GEMINI_VOICE_KEY` | Recommended | Gemini API key for voice/audio transcription |
| `HUGGINGFACE_KEY` | Recommended | HuggingFace Inference API key (Whisper STT + Zephyr-7B fallback) |
| `GOOGLE_TTS_API_KEY` | Optional | Google Cloud Text-to-Speech API key (falls back to browser TTS if missing) |

> **Note:** The app is designed to degrade gracefully. Even with only `GEMINI_KEY_1`, the core query functionality will work. Voice and TTS features require their respective keys.

### Optional: Frontend Environment

Create `frontend/.env` if deploying to a remote backend:

```env
VITE_API_URL=http://localhost:5000
```

---

## 🔧 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 + Vite 7 | SPA with fast HMR |
| **Styling** | Vanilla CSS | Custom design system with glassmorphism, animations, clay-card UI |
| **Backend** | Express.js 4 + Node.js | REST API server |
| **Primary AI** | Google Gemini 2.5 Flash | Query understanding + response generation |
| **Fallback AI** | HuggingFace Zephyr-7B | Cloud fallback when Gemini is unavailable |
| **Offline AI** | Ollama (DeepSeek / Qwen / Phi3) | Local model fallback for full offline support |
| **Voice Input** | Gemini Voice API + Whisper (HuggingFace) | Speech-to-text transcription |
| **Voice Output** | Google Cloud TTS + Browser SpeechSynthesis | Text-to-speech with Malayalam support |
| **Database** | Firebase Firestore | Service data + chat history (optional, has local fallback) |
| **Maps** | Google Maps (iframe embed) | Showing nearest government offices |
| **File Upload** | Multer | Audio file handling for voice input |
| **Geolocation** | Browser Geolocation API | User location for office proximity |

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check — returns server status |
| `POST` | `/ai` | Main query endpoint — accepts `{ message, userId, language, location }` |
| `POST` | `/whisper` | Voice transcription — accepts `multipart/form-data` with audio file |
| `POST` | `/tts` | Text-to-speech — accepts `{ text, language }`, returns base64 audio |
| `GET` | `/chats/:userId` | Fetch chat history for a user |
| `GET` | `/todo/:serviceId` | Get step checklist for a service |

---

## 🌍 Supported Services

The app includes verified, structured data for these Kerala government services:

| # | Service | Online Portal |
|---|---|---|
| 1 | Aadhaar Address Update | [myaadhaar.uidai.gov.in](https://myaadhaar.uidai.gov.in) |
| 2 | PAN Card (New / Correction / Reprint) | [inditab.com](https://www.inditab.com/pan-card-online/india/) |
| 3 | Income Certificate | [edistrict.kerala.gov.in](https://edistrict.kerala.gov.in) |
| 4 | Caste / Community Certificate | [edistrict.kerala.gov.in](https://edistrict.kerala.gov.in) |
| 5 | Land Records | [dslr.kerala.gov.in](https://dslr.kerala.gov.in/en/erekha/) |
| 6 | Birth Certificate | — |
| 7 | Death Certificate | — |
| 8 | Social Security Pension | [welfarepension.lsgkerala.gov.in](https://welfarepension.lsgkerala.gov.in) |
| 9 | Ration Card | [civilsupplieskerala.gov.in](https://civilsupplieskerala.gov.in) |
| 10 | Scholarships (e-Grantz) | [egrantz.kerala.gov.in](https://egrantz.kerala.gov.in) |
| 11 | Driving Licence | [parivahan.gov.in](https://parivahan.gov.in/parivahan) |
| + | _More services via AI-generated responses_ | — |

---

## 🕊️ Life Event Detection

Describe a life event and get a **complete, multi-step government procedure checklist**:

| Life Event | Example Trigger | Steps |
|---|---|---|
| 💀 Death of Family Member | _"My father passed away"_ | 7 procedures |
| 💒 Marriage | _"I just got married"_ | 6 procedures |
| 👶 Birth of a Child | _"I had a baby"_ | 5 procedures |
| 🏠 Relocation | _"I moved to a new address"_ | 5 procedures |
| 💼 Starting a Business | _"I want to start a new business"_ | 6 procedures |
| 🎂 Turning 18 | _"I just turned 18"_ | 6 procedures |

---

## 🛠️ Build for Production

```bash
# Build the frontend
cd frontend
npm run build
# Output will be in frontend/dist/
```

The `dist/` folder can be served by any static file server (Nginx, Vercel, Netlify, etc.). Point `VITE_API_URL` to your deployed backend.

---

## ⚠️ Known Limitations

- **Google Cloud TTS** requires a valid `GOOGLE_TTS_API_KEY` with the Text-to-Speech API enabled. Without it, the app falls back to the browser's built-in SpeechSynthesis (which may lack high-quality Malayalam voices).
- **Leaflet / react-leaflet** are listed as npm dependencies but are **not currently used** in the app — maps use a Google Maps iframe embed instead. These can be removed from `package.json` if desired.
- **Ollama local models** (offline AI fallback) require [Ollama](https://ollama.ai) running on `localhost:11434` with at least one model pulled (e.g., `ollama pull phi3`).
- **Firestore** is optional — the app works fully without it using local fallback service data.
- Voice input requires a **secure context** (HTTPS or localhost) and microphone permission.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <b>🌿 Kerala AI Navigator</b> — Making government services accessible to every citizen.
</p>
