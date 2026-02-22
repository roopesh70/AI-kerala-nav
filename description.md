# Kerala AI Navigator — Project Description Document

---

## 1. Project Title

**Kerala AI Navigator — AI-Powered Government Service Guide**

---

## 2. Project Overview

Kerala AI Navigator is an intelligent, bilingual (English & Malayalam) web application that simplifies access to Kerala's government services for everyday citizens. Using advanced AI models and a curated local knowledge base, it answers citizen queries in natural language — providing step-by-step procedures, required documents, fees, processing times, nearest office locations, and even voice-based interaction — all through a single, modern interface.

The application is designed to be **resilient** (4-tier AI fallback ensures answers are always provided), **inclusive** (full Malayalam support with auto-detection), **accessible** (voice input and output for users who cannot type), and **offline-capable** (local fallback data and local AI models via Ollama).

---

## 3. Problem Statement

### 3.1 The Core Challenge

Government services in Kerala (and India broadly) remain **difficult, confusing, and inaccessible** for ordinary citizens. Despite digitization efforts, critical barriers persist:

#### 🔍 Fragmented Information
Government service information is scattered across dozens of separate websites and portals — e-District Kerala, UIDAI, Parivahan, Civil Supplies, LSG Kerala, and many more. Each portal has a different interface, different navigation patterns, and often incomplete or outdated information. A citizen looking for something as simple as "How do I get an income certificate?" has to know _which_ portal to visit in the first place.

#### 📜 Unclear Procedures
Even when information is found, it is often written in bureaucratic language that is hard for common citizens to understand. The step-by-step process — which office to visit first, what documents to bring, what forms to fill, what fee to pay, and how long it takes — is rarely presented clearly. Citizens end up making multiple trips to government offices due to missing documents or visiting the wrong office.

#### 🗣️ Language Barriers
A significant portion of Kerala's population is more comfortable reading and speaking in Malayalam. However, most government websites and digital services present information primarily in English or in formal Malayalam that can be hard to understand. There is no conversational, AI-powered assistant that speaks to citizens in _their_ language.

#### 🔗 Life Event Complexity
Major life events — the death of a family member, a marriage, the birth of a child, starting a business, or turning 18 — each require completing **multiple government procedures across different offices and departments**. There is no single guide that tells a citizen: "Your father passed away — here are the 7 government procedures you must now complete, in order, with all the details." Citizens discover requirements one at a time, often missing critical deadlines (e.g., the 21-day window for death/birth registration).

#### 🚫 No Single Point of Access
There is currently no unified, intelligent platform where a citizen can ask a natural language question and get a complete, reliable answer covering _all_ the information they need — documents, fees, timelines, office locations, online portals, and tips.

### 3.2 Impact

These problems disproportionately affect:
- **Rural citizens** who have limited digital literacy and fewer nearby government offices.
- **Elderly citizens** who struggle with navigating multiple websites.
- **Malayalam-primary speakers** who cannot effectively use English-language portals.
- **Citizens in distress** (e.g., after a death in the family) who are overwhelmed and need clear guidance the most.

---

## 4. Proposed Solution

### 4.1 Solution Summary

Kerala AI Navigator addresses every identified problem through a single, AI-powered conversational interface:

| Problem | Solution |
|---|---|
| Fragmented information | Single search interface covering all services |
| Unclear procedures | Structured, step-by-step answers with required documents, fees, and timelines |
| Language barriers | Full bilingual (English/Malayalam) support with automatic language detection |
| Life event complexity | Automatic life event detection with complete multi-step checklists |
| No single access point | One application — type, speak, or tap to get instant answers |

### 4.2 How It Works

1. **Citizen asks a question** — by typing, tapping a quick-action chip, or speaking into the microphone (in English or Malayalam).

2. **The backend processes the query** through a multi-stage pipeline:
   - **Life Event Detection:** Checks if the query matches a known life event (death, marriage, childbirth, relocation, starting a business, turning 18). If matched, returns a complete checklist of all required government procedures.
   - **Service Lookup:** Searches a curated database (Firestore with local fallback) of 15+ Kerala government services using intelligent keyword matching that supports both English and Malayalam terms.
   - **AI Generation:** If no specific service match is found, routes the query through a 4-tier AI fallback chain to generate a comprehensive answer:
     - **Tier 1:** Google Gemini 2.5 Flash (primary key)
     - **Tier 2:** Google Gemini 2.5 Flash (backup key)
     - **Tier 3:** HuggingFace Zephyr-7B (cloud fallback)
     - **Tier 4:** Local Ollama models — DeepSeek → Qwen 2.5 → Phi3 (offline fallback)

3. **The frontend displays a rich, structured response** including:
   - Service name and department
   - Step-by-step procedure (visual route map)
   - Required documents (interactive checklist with localStorage persistence)
   - Fees, processing time, and validity
   - Nearest office on an embedded Google Map (using the citizen's live GPS location)
   - "Apply Online" button linking to the official government portal
   - Akshaya Centre eligibility badge
   - AI-generated detailed guidance
   - Voice output (Google Cloud TTS or browser fallback)

4. **For life events**, the response is an interactive multi-step checklist with:
   - Progress tracking (with a progress bar)
   - Expandable cards for each step showing office, documents, fees, timeline, and notes
   - "Mark as Done" buttons with localStorage persistence
   - Google Maps directions to each office

### 4.3 Key Differentiators

- **Never fails silently.** The 4-tier AI fallback and local service data ensure that the citizen _always_ gets an answer, even if all external APIs are down.
- **Speaks the citizen's language.** Auto-detects Malayalam script in the input and responds in the same language, using simple, everyday vocabulary.
- **Voice-first accessible.** Citizens who cannot type can speak their question and hear the answer read aloud.
- **Life event awareness.** No other government service tool provides comprehensive life-event checklists that connect multiple services into a single guided flow.
- **Works offline.** With Ollama installed locally and the built-in service data, the app can function without any internet connectivity.

---

## 5. Detailed Feature Description

### 5.1 Bilingual Support (English & Malayalam)

Every part of the application supports both languages:
- **UI elements** — all labels, buttons, headings, and messages switch between English and Malayalam.
- **Quick-action chips** — each chip has both English and Malayalam labels and queries.
- **AI responses** — the AI is explicitly prompted to respond in the detected language.
- **Auto-detection** — if a user types in Malayalam (even when the app is set to English), the system auto-detects Malayalam Unicode characters and switches the response language accordingly.
- **Voice I/O** — voice input uses language-specific transcription, and voice output uses language-appropriate TTS voices.

### 5.2 Curated Service Database

The application includes a locally stored database of **15+ Kerala government services** with verified information:

Each service record contains:
- Service name (English & Malayalam)
- Department
- Keywords (English & Malayalam) for matching
- Step-by-step procedure (ordered list)
- Required documents
- Fee structure
- Processing time
- Validity period
- Best time to visit
- Where to apply (with Malayalam translation)
- Akshaya Centre eligibility
- Online application URL (direct link to official portal)
- Notes and tips

**Services covered include:** Aadhaar Address Update, PAN Card, Income Certificate, Caste/Community Certificate, Land Records, Birth Certificate, Death Certificate, Social Security Pension, Ration Card, Scholarships (e-Grantz), Driving Licence, and more.

The service lookup uses an intelligent scoring algorithm:
- Exact service name matches score highest (8 points)
- Malayalam service name matches also score 8 points
- Multi-word keyword matches score 6 points
- Single keyword matches score 2 points
- Generic keywords (like "card", "certificate", "application") are filtered out to prevent false matches
- Non-Latin (Malayalam) keywords bypass word-boundary checks for accurate matching

### 5.3 Life Event Detection System

The system detects 6 major life events through natural language trigger phrases (in both English and Malayalam):

1. **Death of a Family Member** (7 procedures)
   - Triggers: "passed away", "died", "death", "മരണം", "മരിച്ചു", etc.
   - Covers: Death certificate, legal heir certificate, insurance claim, pension transfer, bank account update, ration card update, property mutation

2. **Marriage** (6 procedures)
   - Triggers: "got married", "wedding", "marriage", "വിവാഹം", "കല്യാണം", etc.
   - Covers: Marriage registration, Aadhaar update, ration card update, voter ID update, bank nominee update, insurance nominee update

3. **Birth of a Child** (5 procedures)
   - Triggers: "baby born", "newborn", "childbirth", "കുഞ്ഞ്", "പ്രസവം", etc.
   - Covers: Birth registration, child Aadhaar, ration card update, maternity benefits, vaccination registration

4. **Relocation** (5 procedures)
   - Triggers: "relocated", "new address", "shifted house", "താമസം മാറ്റി", etc.
   - Covers: Aadhaar address update, voter ID update, ration card transfer, bank address update, residence certificate

5. **Starting a Business** (6 procedures)
   - Triggers: "start business", "open shop", "startup", "ബിസിനസ്", "കട തുടങ്ങാൻ", etc.
   - Covers: MSME/Udyam registration, trade license, GST registration, current account, Shops & Establishments Act, FSSAI registration

6. **Turning 18** (6 procedures)
   - Triggers: "turned 18", "18 years old", "first time voter", "18 വയസ്സ്", "പ്രായപൂർത്തി", etc.
   - Covers: Voter ID registration, Aadhaar adult biometric update, learner's licence, bank account, PAN card, ration card update

Each procedure includes: task description (English & Malayalam), office/location, required documents, processing time, fee, notes, and Google Maps search query for directions.

### 5.4 Voice Input Pipeline

The voice input system uses a **three-tier transcription pipeline** to maximize accuracy and compatibility:

1. **Gemini Voice (Primary):** Records audio via the browser's MediaRecorder API, sends the audio buffer to the backend, which forwards it to Google Gemini 2.5 Flash with inline audio data. Language-aware prompts ensure accurate Malayalam transcription.

2. **Whisper STT (Fallback):** If Gemini Voice fails, the same audio is sent to OpenAI's Whisper Large V3 model via the HuggingFace Inference API.

3. **Browser SpeechRecognition (Last Resort):** If both server-side transcription methods fail, the frontend falls back to the browser's built-in Web Speech API with a language chain that tries multiple language codes (e.g., `ml-IN` → `en-IN` → `en-US` for Malayalam mode).

Features:
- Real-time recording timer (up to 30 seconds)
- Visual state indicators (idle, recording, transcribing, listening, error, blocked)
- Automatic microphone permission handling
- Secure context detection (HTTPS or localhost required)

### 5.5 Voice Output Pipeline

The voice output system uses a **two-tier playback pipeline**:

1. **Google Cloud TTS (Primary):** Sends text to the Google Cloud Text-to-Speech API via the backend. Tries multiple voice variants in order:
   - Wavenet voices (highest quality)
   - Standard voices
   - Default voices
   Supports both English (en-IN) and Malayalam (ml-IN) voices with adjusted speaking rates.

2. **Browser SpeechSynthesis (Fallback):** If Google Cloud TTS is unavailable (missing API key or API errors), falls back to the browser's built-in speech synthesis. Scores available voices by language match and quality, then splits long text into sentence-level chunks for smooth playback.

### 5.6 Google Maps Integration

The `MapView` component provides office location discovery:
- **Embedded Google Maps iframe** that searches for the relevant government office in Kerala
- **Live user geolocation** — if the user grants location permission, the map centers on their area and shows nearby offices
- **Fallback link** — "Open in Google Maps" link for full-screen directions
- **Automatic location management** — location is requested once on app load and shared with the backend for context-aware responses

### 5.7 AI Response Quality Control

The system includes multiple quality safeguards:

- **Input normalization:** Common misspellings are auto-corrected (e.g., "aadhar" → "aadhaar", "cert" → "certificate", "pancard" → "pan card").
- **Response cleaning:** Removes zero-width characters, normalizes line breaks, fixes spacing around bullets and numbers.
- **Quality detection:** Responses are checked for minimum length, undefined/null values, encoding errors, repetitive characters, and (for Malayalam) minimum Malayalam character count and suspiciously long words.
- **Safe fallback:** If a response fails quality checks, the system returns a well-structured template asking the citizen to rephrase their question with specific guidance.
- **Response enhancement:** A dedicated Gemini-based enhancer can rewrite structured service data into more engaging, readable text with markdown formatting, emojis, and pro tips.

### 5.8 UI/UX Design

The frontend uses a custom CSS design system featuring:
- **Glassmorphism** — translucent, frosted-glass card effects
- **Clay-card UI** — soft shadows and rounded corners for a modern, premium feel
- **Smooth animations** — float-up entrance animations with staggered delays
- **Quick-action chips** — one-tap access to common services
- **Tab navigation** — organized result view (Steps, Documents, Map, Fees)
- **Interactive checklists** — document checklists and life event progress tracking with localStorage persistence
- **Info card strips** — at-a-glance summary cards for processing time, validity, fee, office, and best visit time
- **Fully responsive** — works on desktop and mobile
- **Language toggle** — EN/മല switch in the header

---

## 6. Technical Architecture

### 6.1 System Flow

```
                    ┌──────────────────────┐
                    │   Citizen Browser     │
                    │  (React 19 + Vite 7)  │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │   Express.js Backend  │
                    │   (Node.js, Port 5000)│
                    └──────────┬───────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
   ┌──────▼──────┐    ┌───────▼──────┐    ┌───────▼──────┐
   │  /ai        │    │  /whisper    │    │  /tts        │
   │  Query      │    │  Voice STT  │    │  Voice TTS   │
   └──────┬──────┘    └───────┬──────┘    └───────┬──────┘
          │                   │                   │
    ┌─────▼─────┐       ┌────▼─────┐       ┌────▼─────┐
    │ 1. Life   │       │ Gemini   │       │ Google   │
    │   Event   │       │ Voice    │       │ Cloud    │
    │   Detect  │       │ (primary)│       │ TTS      │
    └─────┬─────┘       └────┬─────┘       └──────────┘
          │                  │
    ┌─────▼─────┐       ┌────▼─────┐
    │ 2. Service│       │ Whisper  │
    │   Lookup  │       │ (fallback│
    │(Firestore │       └──────────┘
    │ +local DB)│
    └─────┬─────┘
          │
    ┌─────▼─────────────────────┐
    │ 3. AI Generation          │
    │  Gemini → Gemini Backup   │
    │  → HuggingFace Zephyr     │
    │  → Ollama Local Models    │
    └───────────────────────────┘
```

### 6.2 Backend Services

| Service File | Responsibility |
|---|---|
| `server.js` | Express server with 5 REST endpoints, CORS, validation, Firestore chat logging |
| `aiRouter.js` | Main orchestrator — life event detection → service lookup → 4-tier AI fallback → quality control |
| `geminiService.js` | Google Gemini 2.5 Flash API wrapper (primary + backup keys) |
| `geminiVoiceService.js` | Gemini-based audio transcription (inline audio → text) |
| `whisperService.js` | HuggingFace Whisper Large V3 transcription |
| `googleTTSService.js` | Google Cloud Text-to-Speech synthesis with multi-voice fallback |
| `huggingfaceService.js` | HuggingFace Zephyr-7B chat completion (AI fallback) |
| `localRouter.js` | Ollama local model chain: DeepSeek → Qwen 2.5 → Phi3 (offline fallback) |
| `responseEnhancer.js` | Gemini-powered response polishing for structured service data |
| `firestoreLookup.js` | Service matching engine + 15+ local service records with full metadata |
| `lifeEvents.js` | 6 life event definitions with trigger phrases and procedure checklists |
| `firebase.js` | Firebase Admin SDK initialization (graceful fallback if unavailable) |

### 6.3 Frontend Components

| Component | Responsibility |
|---|---|
| `App.jsx` | Root component — routing (home/result/lifeEvent), search handler, location management, history |
| `HomeScreen.jsx` | Landing page — search bar, quick-action chips, voice input |
| `ServiceResult.jsx` | Service detail view — markdown renderer, tabs (Steps/Documents/Map/Fees), voice output, apply-online link |
| `LifeEventMode.jsx` | Life event checklist — progress bar, expandable step cards, mark-as-done with persistence |
| `VoiceInput.jsx` | Audio recording → 3-tier transcription pipeline |
| `VoiceOutput.jsx` | 2-tier TTS playback (Google Cloud → browser) |
| `MapView.jsx` | Google Maps iframe embed with geolocation |
| `RouteMap.jsx` | Visual step-by-step route display |
| `Header.jsx` | Top bar — logo, language toggle (EN/മല), location button, history button |
| `HistoryPanel.jsx` | Sliding panel showing last 10 search queries |
| `InfoCardsStrip.jsx` | Summary cards (processing time, validity, fee, office, best visit time) |
| `DocumentChecklist.jsx` | Interactive document checklist with checkboxes |
| `FeeTable.jsx` | Fee breakdown display |
| `TabBar.jsx` | Tab navigation for result view |

### 6.4 Data Flow for a Typical Query

```
User types: "How to get income certificate?"
        │
        ▼
Frontend sends POST /ai with { message, language, location }
        │
        ▼
aiRouter.js normalizes: "how to get income certificate?"
        │
        ▼
detectLifeEvent() → No match
        │
        ▼
findService() → Matches "Income Certificate" (keywords: "income", "certificate")
        │
        ▼
formatService() builds structured reply with steps, docs, fees, timeline
        │
        ▼
Response sent with: reply, serviceId, steps[], requiredDocuments[],
  fee, processingTime, validity, applyAt, onlineApplyUrl, akshayaEligible
        │
        ▼
Frontend renders ServiceResult with:
  - InfoCardsStrip (fee, time, validity at a glance)
  - "Apply Online" button → edistrict.kerala.gov.in
  - TabBar → Steps (RouteMap), Documents (Checklist), Map, Fees
  - VoiceOutput button
  - AI Detailed Guidance section
```

---

## 7. Innovation & Uniqueness

| Aspect | What Makes It Unique |
|---|---|
| **Life Event Intelligence** | No existing government portal provides automatic life-event detection with comprehensive multi-step checklists |
| **4-Tier AI Resilience** | Guarantees an answer even when all cloud services fail, using local AI models |
| **True Bilingual AI** | Auto-detects Malayalam input and generates natively fluent Malayalam responses — not just translations |
| **Voice-First Accessibility** | Full voice input (record → AI transcription) and voice output (Google TTS) — critical for elderly and semi-literate users |
| **Offline Capability** | Local service database + Ollama models = fully functional without internet |
| **Quality Assurance** | Multi-point response validation prevents gibberish, encoding errors, or empty responses from reaching the citizen |
| **Apply Online Links** | Direct links to official government portals — reduces one more barrier |

---

## 8. Social Impact

### 8.1 Target Beneficiaries
- **Rural Kerala citizens** with limited digital access
- **Elderly population** who struggle with complex websites
- **Malayalam-speaking citizens** who need information in their native language
- **First-generation internet users** who benefit from voice-based interaction
- **Citizens dealing with life events** (bereavement, marriage, childbirth) who need guided support

### 8.2 Accessibility Features
- **Voice input** — no typing required
- **Voice output** — answers read aloud
- **Simple language** — AI prompted to use everyday vocabulary
- **Large, tappable UI elements** — designed for mobile-first usage
- **Quick-action chips** — one-tap access to common services
- **Offline mode** — works without internet in remote areas

### 8.3 Scalability
- New services can be added by extending the `LOCAL_SERVICES` array in `firestoreLookup.js` or adding records to Firestore
- New life events can be added by extending the `LIFE_EVENTS` array in `lifeEvents.js`
- Additional languages can be supported by adding language cases to the prompt templates
- Cloud deployment requires minimal changes (set `VITE_API_URL` and deploy frontend to any CDN)

---

## 9. Future Enhancements

- **WhatsApp / Telegram bot integration** — reach citizens on their existing platforms
- **PDF document generation** — downloadable checklists and application guides
- **Real-time service tracking** — integration with e-District API for application status
- **District-wise office directory** — structured database of all government offices with hours, contact, and geo-coordinates
- **Multi-state expansion** — extend to other Indian states' government services
- **PWA support** — installable as a native-like app on mobile devices
- **Analytics dashboard** — track most-searched services and gaps in coverage

---

## 10. Conclusion

Kerala AI Navigator transforms the way citizens interact with government services. By combining curated service data, multi-tier AI intelligence, life-event awareness, bilingual support, and voice accessibility, the application ensures that **every citizen — regardless of language, literacy, or digital expertise — can access the government services they need, when they need them, with complete clarity.**

The project demonstrates that AI can serve as a bridge between government bureaucracy and citizen needs — making governance truly accessible, inclusive, and citizen-centric.

---

<p align="center"><i>Kerala AI Navigator — Making government services accessible to every citizen.</i></p>
