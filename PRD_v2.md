# Product Requirements Document (PRD)
## AI-Powered Government Service Navigator — Kerala

**Version:** 2.0  
**Date:** February 21, 2026  
**Status:** Updated Draft  
**Document Type:** Product Requirements Document

> **v2.0 Changes:** Added Judging Criteria alignment · Life-Event Mode · Anonymous Query History · In-App Map for nearby service centers · Service Application & Reminder system (future) · Updated tech stack

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Judging Criteria Alignment](#3-judging-criteria-alignment)
4. [Goals & Success Metrics](#4-goals--success-metrics)
5. [Target Users](#5-target-users)
6. [Scope](#6-scope)
7. [Functional Requirements](#7-functional-requirements)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [System Architecture](#9-system-architecture)
10. [Tech Stack](#10-tech-stack)
11. [User Stories](#11-user-stories)
12. [UI/UX Requirements](#12-uiux-requirements)
13. [Data Requirements](#13-data-requirements)
14. [Supported Services (MVP)](#14-supported-services-mvp)
15. [Future Enhancements](#15-future-enhancements)
16. [Feasibility & Constraints](#16-feasibility--constraints)
17. [Risks & Mitigations](#17-risks--mitigations)
18. [Appendix](#18-appendix)

---

## 1. Executive Summary

The **AI-Powered Government Service Navigator** is a mobile-friendly web application designed to help citizens of Kerala, India navigate government services with ease. Using natural language input in **Malayalam or English** (text or voice), citizens instantly receive step-by-step guidance — including required documents, applicable fees, processing timelines, nearest office location on an in-app map, and best visit times.

Version 2.0 significantly expands the product with four major additions:

1. **Life-Event Mode** — detects life events like "My father passed away" and auto-generates a full multi-service procedure checklist
2. **Anonymous Query History** — stores recently searched services in browser localStorage with no login required
3. **In-App Service Center Map** — embeds a Leaflet.js map showing nearby offices and Akshaya centers; falls back to a Google Maps deep-link
4. **Service Application & Reminders** *(Future v3.0)* — allows users to apply for services through the app and receive renewal/status reminders

---

## 2. Problem Statement

### 2.1 Core Problem

Accessing government services in Kerala remains confusing and inefficient for a large segment of the population. Citizens frequently:

- Do not know **which office** handles their specific request
- Are unaware of the **exact documents** required, leading to wasted trips
- Cannot find clear guidance on **procedural steps, fees, or timelines**
- Face **long queues** and are unsure of optimal visit times
- Encounter **language barriers** or struggle with digital interfaces
- Rely on **paid intermediaries** for services they should be able to access independently
- Are overwhelmed by **life-events** (death, marriage, childbirth) that simultaneously trigger multiple service needs

### 2.2 Affected Populations

- Elderly citizens with limited digital literacy
- Rural residents far from government offices
- First-time applicants unfamiliar with bureaucratic procedures
- Citizens with Malayalam as their primary language
- People with low income who cannot afford intermediaries or repeated travel
- Families navigating stressful life events with no consolidated procedural guidance

### 2.3 Impact of the Problem

| Impact Area | Description |
|---|---|
| Economic | Lost work hours, unnecessary travel costs, intermediary fees |
| Social | Exclusion from essential services, erosion of public trust |
| Governance | Inefficiency, staff overload at offices due to misdirected citizens |
| Equity | Disproportionate burden on vulnerable and low-income groups |
| Life Events | Families in grief or transition face compounded procedural confusion with no guidance |

---

## 3. Judging Criteria Alignment

This section directly maps the hackathon judging rubric to product decisions.

| Judging Criterion | How This Product Addresses It |
|---|---|
| **Social Good & Problem Clarity** | Directly solves civic accessibility for Kerala's rural, elderly, and low-literacy citizens — a documented SDG-16 (Strong Institutions) problem. Life-Event Mode addresses grief-stricken families navigating bureaucracy alone with zero guidance. |
| **AI as Core Element (Working Prototype)** | NLP intent detection is the engine of every query. Life-event detection uses AI pattern matching. The prototype handles 10 real Kerala services and 5 life events end-to-end with Malayalam and English support. |
| **Originality — Beyond Specifications** | Life-Event Mode (one prompt → multi-service checklist), anonymous query history without login, in-app Leaflet map for service centers, and Malayalam voice input go significantly beyond a basic service FAQ chatbot. |
| **Deployable with Minor Modifications** | **Cost:** Firebase free tier sufficient for 10K MAU. **Scale:** Firestore and Cloud Run auto-scale. **Performance:** Rule-based NLP < 200ms, no GPU needed. **Security:** No PII stored server-side, HTTPS enforced, DPDP Act compliant. |
| **Team Clarity & Explanation** | Each feature maps to a specific user story and persona. Architecture is simple and explainable: React → FastAPI → Firestore. Every decision is documented and justified in this PRD. |

---

## 4. Goals & Success Metrics

### 4.1 Product Goals

- **Accessibility:** Enable any citizen to understand and access a government service within minutes
- **Inclusivity:** Support Malayalam & English input via text and voice
- **Accuracy:** Deliver correct, up-to-date guidance for Kerala-specific services
- **Life-Event Support:** Reduce overwhelm during major life transitions by generating consolidated service checklists
- **Continuity:** Give users a no-login query history so they can resume without re-typing
- **Location:** Show the nearest service center on a map so citizens know exactly where to go

### 4.2 Key Performance Indicators (KPIs)

| Metric | Target (MVP / Hackathon) | Target (v1.0 Production) |
|---|---|---|
| Services supported | 10 | 50+ |
| Languages supported | 2 (Malayalam, English) | 3+ |
| Life events supported | 5 | 15+ |
| Intent detection accuracy | ≥ 85% | ≥ 95% |
| Average query response time | < 2 seconds | < 1 second |
| User task completion rate | ≥ 80% | ≥ 90% |
| Voice input support | Yes (browser-based) | Yes (enhanced) |
| Mobile usability score | ≥ 85 (Lighthouse) | ≥ 90 |
| History retention (no login) | Last 10 queries via localStorage | Last 50 queries |
| Map load time | < 3 seconds | < 1.5 seconds |

---

## 5. Target Users

### 5.1 Primary Users

**Persona 1 — Rural Citizen (Rajan, 58)**
Retired farmer in Palakkad needing an Aadhaar address update. Speaks Malayalam, has a basic Android phone, and has never used a government portal. Depends on his son or a local intermediary.

**Persona 2 — Elderly Widow (Thankamma, 67)**
Pensioner in Thrissur whose husband recently passed away. Needs to simultaneously claim survivor pension, apply for death certificate, update ration card, and notify the bank — but doesn't know where to start. Life-Event Mode and voice input are critical for her.

**Persona 3 — Young First-Time Applicant (Arjun, 24)**
College graduate in Kozhikode applying for an income certificate. Checks the app multiple times and benefits from query history so he doesn't re-search.

**Persona 4 — New Parent (Priya, 31)**
New mother in Kochi needing to register her child's birth, update the ration card, and enroll in the vaccination scheme — all triggered by a single life-event query.

### 5.2 Secondary Users

- **Akshaya Center Operators** — use the app as a quick reference to guide walk-in citizens
- **Government Officials** — benefit indirectly from reduced misdirected walk-ins

---

## 6. Scope

### 6.1 In Scope (MVP — Hackathon Build)

- Natural language query input (text and voice) in Malayalam and English
- Intent detection for 10 predefined services
- **Life-Event Mode** — detects 5 life events, generates multi-service checklists
- Step-by-step procedural guidance per service
- Required documents checklist with check-off capability
- Fee and processing timeline information
- **In-app map** (Leaflet.js + OpenStreetMap) showing nearest service centers and Akshaya centers; Google Maps deep-link fallback
- **Anonymous query history** in browser localStorage (no login, last 10 queries)
- Best time to visit guidance
- Mobile-responsive web interface

### 6.2 Out of Scope (MVP)

- User authentication / accounts
- Real-time queue data integration
- Actual document submission or e-filing
- Payment gateway integration
- Native mobile app (Android/iOS)
- Admin CMS for updating service data
- Service application via app *(v3.0)*
- Renewal reminders / push notifications *(v3.0)*

---

## 7. Functional Requirements

### 7.1 Natural Language Input

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Users can type a query in Malayalam or English | Must Have |
| FR-02 | Users can speak a query using browser-based voice recognition | Must Have |
| FR-03 | System detects and processes mixed-language (Manglish) input | Should Have |
| FR-04 | System handles spelling errors and informal phrasing gracefully | Should Have |
| FR-05 | Unrecognized queries display a helpful fallback and suggest similar services | Must Have |

**Example Queries the System Must Handle:**
- "I want to change my address in Aadhaar"
- "ആധാർ വിലാസം മാറ്റണം" (Malayalam)
- "My father passed away, what do I do?" → Life-Event Mode
- "We just had a baby" → Life-Event Mode
- "I'm starting a new shop in Thrissur" → Life-Event Mode

### 7.2 Intent Detection & Service Routing

| ID | Requirement | Priority |
|---|---|---|
| FR-06 | System maps user query to the most relevant government service | Must Have |
| FR-07 | Rule-based intent detection processes structured service categories | Must Have |
| FR-08 | System presents disambiguation options when intent is ambiguous | Should Have |
| FR-09 | Intent confidence threshold ≥ 0.75 before routing | Should Have |
| FR-10 | System detects life-event phrases and routes to Life-Event Mode | Must Have |

### 7.3 Service Guidance Output

| ID | Requirement | Priority |
|---|---|---|
| FR-11 | Display the responsible office or department | Must Have |
| FR-12 | Display a checklist of required documents (original + photocopy) | Must Have |
| FR-13 | Display step-by-step procedural instructions | Must Have |
| FR-14 | Display applicable fees | Must Have |
| FR-15 | Display expected processing time | Must Have |
| FR-16 | Display recommended best time / day to visit | Should Have |
| FR-17 | Show nearest service center with in-app map | Must Have |
| FR-18 | Allow users to copy or share the service guidance | Could Have |

### 7.4 Life-Event Mode *(New in v2.0)*

| ID | Requirement | Priority |
|---|---|---|
| FR-19 | Detect life-event phrases (death, marriage, birth, relocation, new business) | Must Have |
| FR-20 | Generate a consolidated multi-service checklist for the detected life event | Must Have |
| FR-21 | Each service in the checklist is expandable inline to show full guidance | Must Have |
| FR-22 | User can check off completed services within the life-event checklist | Should Have |
| FR-23 | Checklist completion state saved to localStorage | Should Have |
| FR-24 | Life-event checklist is shareable as a text summary | Could Have |

**Life Events & Triggered Services:**

| Life Event | Trigger Phrases (Examples) | Auto-Generated Checklist |
|---|---|---|
| Death in Family | "father passed away", "husband died", "ഭർത്താവ് മരിച്ചു" | Death certificate, Survivor pension, Bank nominee update, Ration card update, Insurance claim, Property mutation |
| Marriage | "getting married", "wedding", "വിവാഹം" | Marriage registration, Aadhaar name/address update, Ration card update, Bank account update |
| Childbirth | "baby born", "new baby", "കുഞ്ഞ് ജനിച്ചു" | Birth certificate, Ration card addition, Vaccination registration, Child Aadhaar enrollment |
| Relocation | "moved to new house", "shifted", "new address", "താമസം മാറ്റി" | Aadhaar address update, Ration card transfer, Voter ID update, Driving licence update |
| Starting a Business | "starting a shop", "new business", "ബിസിനസ്സ് തുടങ്ങുന്നു" | Udyam registration, GST registration, Local body trade license, FSSAI (if food-related) |

### 7.5 Anonymous Query History *(New in v2.0)*

| ID | Requirement | Priority |
|---|---|---|
| FR-25 | System saves each query and result to browser localStorage automatically | Must Have |
| FR-26 | History panel accessible from main navigation — no login required | Must Have |
| FR-27 | History shows last 10 queries: service name, date, type badge | Must Have |
| FR-28 | User can delete individual entries or clear all history | Must Have |
| FR-29 | History survives page refresh and browser restart on the same device | Must Have |
| FR-30 | History is device-local only — never sent to any server | Must Have |
| FR-31 | History shows relative timestamps ("Searched 2 days ago") | Should Have |

**localStorage Key Schema:**
```json
{
  "gsn_history": [
    {
      "id": "uuid-123",
      "query": "My father passed away",
      "type": "life_event",
      "eventId": "death_in_family",
      "serviceName": "Death in Family — 6 Services",
      "timestamp": "2026-02-21T10:30:00Z"
    },
    {
      "id": "uuid-456",
      "query": "income certificate",
      "type": "single_service",
      "serviceId": "income_certificate",
      "serviceName": "Income Certificate",
      "timestamp": "2026-02-20T15:00:00Z"
    }
  ],
  "gsn_checklist_state": {
    "death_in_family_2026-02-21": {
      "death_certificate": "done",
      "survivor_pension": "in_progress",
      "ration_card_update": "pending"
    }
  }
}
```

### 7.6 In-App Service Center Map *(New in v2.0)*

| ID | Requirement | Priority |
|---|---|---|
| FR-32 | Results screen shows embedded Leaflet.js map with nearest offices and Akshaya centers | Must Have |
| FR-33 | Map pins color-coded: blue for government offices, green for Akshaya centers | Must Have |
| FR-34 | Tapping a pin shows office name, address, hours, and phone | Must Have |
| FR-35 | "Get Directions" button opens Google Maps deep-link for turn-by-turn navigation | Must Have |
| FR-36 | If geolocation is permitted, map centers on user's current location | Should Have |
| FR-37 | If geolocation is denied, user selects their district from a dropdown | Must Have |
| FR-38 | Fallback button always visible: "Search [Office] Near Me on Google Maps →" | Must Have |
| FR-39 | Map renders within 3 seconds on 4G; fallback shown within 1 second if map fails | Must Have |

**Google Maps Fallback URL Format:**
```
https://www.google.com/maps/search/{service_office_name}+near+me
Example: https://www.google.com/maps/search/Akshaya+Centre+near+me
```

### 7.7 Voice Input

| ID | Requirement | Priority |
|---|---|---|
| FR-40 | Microphone button activates browser-based speech recognition | Must Have |
| FR-41 | Transcribed text displayed and editable before submission | Must Have |
| FR-42 | Voice input supports both Malayalam and English | Must Have |

### 7.8 Multilingual Support

| ID | Requirement | Priority |
|---|---|---|
| FR-43 | UI labels, instructions, and responses available in Malayalam and English | Must Have |
| FR-44 | User can toggle interface language at any time | Must Have |
| FR-45 | All service guidance stored and served in both languages | Must Have |

---

## 8. Non-Functional Requirements

### 8.1 Performance

| ID | Requirement |
|---|---|
| NFR-01 | Query response time < 2 seconds under normal load |
| NFR-02 | Full app load within 3 seconds on a 4G mobile connection |
| NFR-03 | Support ≥ 100 concurrent users (MVP) |
| NFR-04 | Map loads within 3 seconds on 4G; fallback shown within 1 second if map fails |

### 8.2 Usability

| ID | Requirement |
|---|---|
| NFR-05 | Operable by a person with basic smartphone literacy |
| NFR-06 | Font size minimum 16px; touch targets minimum 44 × 44px |
| NFR-07 | Voice button visually prominent and clearly labeled |
| NFR-08 | All core flows completable in 3 taps or fewer |
| NFR-09 | History panel accessible within 1 tap from any screen |

### 8.3 Accessibility

| ID | Requirement |
|---|---|
| NFR-10 | Meets WCAG 2.1 Level AA |
| NFR-11 | Screen reader compatible (ARIA labels on all interactive elements) |
| NFR-12 | High-contrast mode support |
| NFR-13 | Malayalam text minimum 18px (glyph complexity) |

### 8.4 Reliability & Availability

| ID | Requirement |
|---|---|
| NFR-14 | Application uptime target: 99.5% |
| NFR-15 | Graceful degradation if Firebase is temporarily unavailable |
| NFR-16 | Map falls back to Google Maps link if Leaflet embed fails |
| NFR-17 | History feature works entirely offline (localStorage) |

### 8.5 Security & Privacy

| ID | Requirement |
|---|---|
| NFR-18 | No PII stored server-side |
| NFR-19 | Voice input processed locally — no audio transmitted to servers |
| NFR-20 | HTTPS enforced across all endpoints |
| NFR-21 | Firebase security rules restrict read-only access to service data |
| NFR-22 | Query history stored only in device localStorage — never synced to server |
| NFR-23 | Geolocation permission requested only when map tab is opened |

### 8.6 Deployability *(Judging Criterion)*

| Concern | Solution | Detail |
|---|---|---|
| Cost | Firebase Spark (free) + Cloud Run free tier | ₹0 for hackathon; clear upgrade path to production pricing |
| Scale | Firestore + Cloud Run auto-scale | No manual ops; handles traffic spikes automatically |
| Performance | Rule-based NLP < 200ms; CDN-hosted frontend | No GPU or ML infrastructure required |
| Security | No user data server-side; HTTPS; Firestore rules | Minimal attack surface; DPDP Act 2023 compliant |
| Modification | Add services = add Firestore documents | No code changes needed to expand service coverage |

---

## 9. System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          USER DEVICE                                 │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │              React Frontend (Mobile-Responsive PWA)             │ │
│  │                                                                 │ │
│  │  ┌───────────┐  ┌────────────┐  ┌──────────┐  ┌────────────┐  │ │
│  │  │  Search   │  │ Life-Event │  │ History  │  │  Map View  │  │ │
│  │  │ + Voice   │  │   Mode     │  │(localStorage)│(Leaflet+OSM)│  │ │
│  │  └─────┬─────┘  └─────┬──────┘  └──────────┘  └────────────┘  │ │
│  │        │               │         (device-only)  (client-only)  │ │
│  └────────┼───────────────┼─────────────────────────────────────  ┘ │
└───────────┼───────────────┼──────────────────────────────────────────┘
            │ HTTPS REST    │
┌───────────▼───────────────▼──────────────────────────────────────────┐
│                    FASTAPI BACKEND (Python)                           │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  NLP Intent Detection Layer                                  │    │
│  │  ├── Keyword + rule-based service intent matching            │    │
│  │  ├── Life-event phrase detection (regex / pattern matching)  │    │
│  │  ├── Malayalam / English tokenization                        │    │
│  │  └── Confidence scoring & disambiguation                     │    │
│  └──────────────────────────┬───────────────────────────────────┘    │
│  ┌───────────────────────────▼──────────────────────────────────┐    │
│  │  Workflow Engine                                             │    │
│  │  ├── Single service: fetches & assembles guidance response   │    │
│  │  ├── Life-event: fetches multiple service workflows parallel │    │
│  │  └── Maps district → office + Akshaya center coordinates    │    │
│  └──────────────────────────────────────────────────────────────┘    │
└────────────────────────────┬─────────────────────────────────────────┘
                             │ Firestore SDK
┌────────────────────────────▼─────────────────────────────────────────┐
│                   FIREBASE FIRESTORE (Data Layer)                    │
│  /services         → Workflows, steps, keywords, fees                │
│  /life_events      → Event patterns, linked service IDs              │
│  /offices          → Office details, lat/lng coordinates, hours      │
│  /akshaya_centers  → Center locations, coordinates, district         │
│  /documents        → Document checklists per service                 │
└────────────────────────────┬─────────────────────────────────────────┘
                             │ Tile server / embed
┌────────────────────────────▼─────────────────────────────────────────┐
│                     MAP LAYER (Client-side only)                     │
│  Primary:  Leaflet.js + OpenStreetMap tiles (free, no API key)       │
│  Enhanced: Google Maps Embed API (optional, if key available)        │
│  Fallback: Google Maps deep-link  →  "<service office> near me"      │
└──────────────────────────────────────────────────────────────────────┘
```

### 9.1 Life-Event Data Flow

1. User types "My father passed away"
2. NLP layer detects life-event phrase → routes to `death_in_family`
3. Workflow engine fetches linked service IDs from `/life_events/death_in_family`
4. Fetches all 6 service workflows from Firestore in parallel
5. Returns consolidated multi-service response to frontend
6. Frontend renders expandable checklist; saves to localStorage history

### 9.2 Map Data Flow

1. User opens map tab on results screen
2. Frontend requests geolocation permission
3. If granted → Leaflet renders centered on user with nearest center pins
4. If denied → User selects district; pins load for that district from Firestore
5. If Leaflet fails → "Find on Google Maps" button displayed instantly
6. "Get Directions" → opens `https://maps.google.com/?daddr={lat},{lng}` in native maps app

---

## 10. Tech Stack

### 10.1 Full Stack (v2.0)

| Layer | Technology | Version | Why Chosen |
|---|---|---|---|
| **Frontend Framework** | React.js | v18+ | Component-based, fast, mobile-friendly |
| **Styling** | Tailwind CSS + CSS Variables | v3+ | Rapid UI; supports claymorphism design system |
| **Maps — Primary** | Leaflet.js + OpenStreetMap | v1.9+ | Free, no API key, works offline with tile caching |
| **Maps — Enhanced** | Google Maps Embed API | Optional | Better local data if API key available |
| **Maps — Fallback** | Google Maps Deep-link | URL template | Zero dependency; always works |
| **Voice Input** | Web Speech API | Browser-native | No external dependency; works on Android Chrome |
| **Query History** | Browser localStorage | Browser-native | No server, no login, fully private |
| **Backend** | FastAPI (Python) | v0.100+ | Lightweight, async, fast REST API |
| **NLP / Intent** | Rule-based keyword matching | Python custom | Reliable, deterministic, hackathon-feasible |
| **Life-Event Detection** | Regex / pattern matching (Python) | Custom | Fast, no ML infrastructure needed |
| **Database** | Firebase Firestore | v9 SDK | Real-time, schema-flexible, generous free tier |
| **Hosting — Frontend** | Firebase Hosting | Free tier | CDN-backed, HTTPS, deploy from GitHub |
| **Hosting — Backend** | Google Cloud Run | Free tier | Serverless, scales to zero, FastAPI Docker |
| **Internationalization** | i18next + react-i18next | v23+ | Industry standard React i18n |
| **Malayalam Font** | Noto Sans Malayalam | Google Fonts CDN | Full glyph support, free |
| **State Management** | React Context + useState | React built-in | Sufficient for MVP; no Redux overhead |
| **HTTP Client** | Axios | v1.x | Clean async API calls |
| **Unique IDs (History)** | uuid (npm) | v9+ | Collision-free localStorage entry IDs |

### 10.2 Deployability Summary

| Concern | Solution | Cost / Effort |
|---|---|---|
| Cost | Firebase Spark + Cloud Run free tier | ₹0 at MVP scale |
| Scale | Firestore + Cloud Run auto-scale | Zero ops effort |
| Performance | Rule-based NLP < 200ms; CDN frontend | No GPU or ML infra |
| Security | No PII server-side; HTTPS; DPDP compliant | Minimal risk surface |
| Map Cost | Leaflet + OSM = free | Google Maps only needed post-MVP |
| Expandability | Add service = add Firestore document | No code change needed |

---

## 11. User Stories

### Epic 1: Service Discovery
- **US-01** — As a citizen, I want to type my need in plain language so I don't need to know the official service name.
- **US-02** — As a Malayalam speaker, I want to type or speak in Malayalam so I can use the app comfortably.
- **US-03** — As an elderly user, I want to speak my query instead of typing so I don't struggle with a small keyboard.
- **US-04** — As a first-time applicant, I want to see a document checklist so I can prepare before visiting the office.

### Epic 2: Service Guidance
- **US-05** — As a citizen, I want step-by-step instructions so I know exactly what to do and in what order.
- **US-06** — As a citizen, I want to know fees and timelines upfront so I can plan my visit.
- **US-07** — As a citizen, I want to see a map of the nearest service center so I know exactly where to go.
- **US-08** — As a working citizen, I want to know the best visit times so I avoid long queues.

### Epic 3: Life-Event Mode *(New)*
- **US-09** — As Thankamma, who just lost her husband, I want to type "my husband passed away" and get a complete checklist of everything I need to do so I don't miss any procedure during a stressful time.
- **US-10** — As Priya, a new mother, I want to type "we just had a baby" and see all government steps at once so I don't have to research each one separately.
- **US-11** — As a life-event user, I want to check off completed services so I can track my progress across multiple procedures.

### Epic 4: Query History *(New)*
- **US-12** — As Arjun, I want to see my previous searches so I can quickly reopen a service without retyping.
- **US-13** — As a user, I want my history saved without creating an account so I don't have to register.
- **US-14** — As a privacy-conscious user, I want to clear my history so my searches stay on my device only.

### Epic 5: Map & Location *(New)*
- **US-15** — As a citizen, I want to see a map of nearby Akshaya centers so I can find the closest one to visit.
- **US-16** — As a user without GPS enabled, I want to enter my district so I can still see centers on the map.
- **US-17** — As a citizen, I want a "Get Directions" button that opens Google Maps so I can navigate there directly.

---

## 12. UI/UX Requirements

### 12.1 Key Screens

**Screen 1 — Home / Search**
- Prominent text input: "Type your service need or life event…"
- Microphone button adjacent to input
- Language toggle (EN / മലയാളം) in the header
- **History icon** in header — opens slide-up panel (last 10 queries)
- Quick-access tiles for 6 common services

**Screen 2 — Results / Single Service**
- Service name header with department badge
- Tabbed layout: **Steps | Documents | Map & Office | Fees & Timeline**
- Document checklist with check-off (state in localStorage)
- Map tab: embedded Leaflet map with pins; fallback Google Maps link
- "Ask Another Question" CTA at bottom

**Screen 3 — Life-Event Mode *(New)***
- Event banner: e.g., "📋 Death in Family — 6 Services to Complete"
- Progress bar: X of N services completed
- Expandable service cards with status (Pending / In Progress / Done)
- Each card expands inline to show full guidance
- Share checklist button

**Screen 4 — Query History Panel *(New)***
- Slide-up bottom sheet
- Last 10 queries: service name, relative timestamp, type badge
- Tap any entry to instantly reload guidance
- "Clear History" button with confirmation

**Screen 5 — Disambiguation**
- "Did you mean one of these?" with 2–3 service cards
- Each card: service name + one-line description

**Screen 6 — Map View *(New)***
- Full-width Leaflet map embed
- 🔵 Blue pins = Government offices, 🟢 Green pins = Akshaya centers
- Bottom info sheet on pin tap: name, address, hours, phone, "Get Directions"
- District dropdown if geolocation denied
- Always-visible fallback: "Search [Service Office] Near Me on Google Maps →"

### 12.2 Design System

- **Style:** Claymorphism — soft rounded cards, Kerala-inspired pastel palette, spring animations
- **Mobile-first:** 375px viewport; tested up to 768px
- **Typography:** Fraunces (headings) + Nunito (body); Noto Sans Malayalam for Malayalam text
- **Min text:** 16px body, 18px Malayalam
- **Contrast:** ≥ 4.5:1 (WCAG AA)
- **Touch targets:** ≥ 44 × 44px

---

## 13. Data Requirements

### 13.1 Firestore Collections

#### `/services/{serviceId}`
```json
{
  "id": "aadhaar_address_update",
  "name_en": "Aadhaar Address Update",
  "name_ml": "ആധാർ വിലാസം മാറ്റൽ",
  "department": "UIDAI / Akshaya Center",
  "keywords_en": ["aadhaar", "address", "update", "change"],
  "keywords_ml": ["ആധാർ", "വിലാസം", "മാറ്റൽ"],
  "steps_en": ["Visit Akshaya centre", "Submit proof of address", "Pay ₹50 fee"],
  "steps_ml": ["അക്ഷയ സെന്ററിൽ പോകുക", "വിലാസ തെളിവ് സമർപ്പിക്കുക"],
  "documents": ["doc_proof_of_address", "doc_aadhaar_original"],
  "fee": "₹50",
  "processing_time": "7–10 working days",
  "best_visit_time": "Weekday mornings, 9 AM – 11 AM",
  "akshaya_eligible": true,
  "office_type": "akshaya_center"
}
```

#### `/life_events/{eventId}` *(New)*
```json
{
  "id": "death_in_family",
  "name_en": "Death in Family",
  "name_ml": "കുടുംബത്തിൽ മരണം",
  "trigger_phrases_en": ["father passed away", "husband died", "mother died", "family member death"],
  "trigger_phrases_ml": ["അച്ഛൻ മരിച്ചു", "ഭർത്താവ് മരിച്ചു", "അമ്മ മരിച്ചു"],
  "linked_services": ["death_certificate", "survivor_pension", "ration_card_update", "bank_nominee_update", "insurance_claim", "property_mutation"],
  "priority_order": [1, 2, 3, 4, 5, 6],
  "intro_en": "We're sorry for your loss. Here are the 6 government procedures you'll need to complete.",
  "intro_ml": "ദുഃഖത്തിൽ ഞങ്ങൾ പങ്കുചേരുന്നു. ഈ 6 നടപടികൾ പൂർത്തിയാക്കേണ്ടതുണ്ട്."
}
```

#### `/offices/{officeId}` *(Updated with coordinates)*
```json
{
  "id": "village_office_thrissur_central",
  "district": "Thrissur",
  "name_en": "Village Office — Thrissur Central",
  "name_ml": "വില്ലേജ് ഓഫീസ് — തൃശ്ശൂർ സെൻട്രൽ",
  "address_en": "Near Town Hall, Thrissur",
  "phone": "+91-487-XXXXXXX",
  "hours": "9 AM – 5 PM, Mon–Sat",
  "lat": 10.5276,
  "lng": 76.2144,
  "type": "government_office",
  "maps_link": "https://maps.google.com/?q=10.5276,76.2144",
  "gmaps_search_fallback": "https://www.google.com/maps/search/Village+Office+Thrissur+near+me"
}
```

#### `/akshaya_centers/{centerId}` *(Updated with coordinates)*
```json
{
  "id": "akshaya_thrissur_central",
  "district": "Thrissur",
  "name": "Akshaya Centre – Thrissur Municipal",
  "address_en": "Near Town Hall, Thrissur",
  "phone": "+91-487-XXXXXXX",
  "hours": "9 AM – 5 PM, Mon–Sat",
  "lat": 10.5280,
  "lng": 76.2150,
  "type": "akshaya_center",
  "maps_link": "https://maps.google.com/?q=10.5280,76.2150",
  "gmaps_search_fallback": "https://www.google.com/maps/search/Akshaya+Centre+near+me"
}
```

---

## 14. Supported Services (MVP)

| # | Service | Department | Akshaya Eligible | Life Event Linked |
|---|---|---|---|---|
| 1 | Aadhaar Address Update | UIDAI | Yes | Death, Marriage, Relocation |
| 2 | Income Certificate | Village / Taluk Office | Yes | — |
| 3 | Caste Certificate | Village Office | Yes | — |
| 4 | Land Record (Thandaper) | Land Revenue | Partial | Death (Mutation) |
| 5 | Birth Certificate | Local Body | Yes | Childbirth |
| 6 | Death Certificate | Local Body | Yes | Death in Family |
| 7 | Old Age / Widow / Disability Pension | Social Justice Dept | Yes | Death (Survivor) |
| 8 | Ration Card Update / New Application | Civil Supplies | Yes | Death, Marriage, Childbirth, Relocation |
| 9 | Kerala Government Scholarship | Welfare Dept | Yes | — |
| 10 | Driving Licence Address Update | Motor Vehicles Dept | No | Relocation |

**Life Events Supported (MVP):**

| # | Life Event | Services Triggered |
|---|---|---|
| 1 | Death in Family | 6 services |
| 2 | Marriage | 4 services |
| 3 | Childbirth | 4 services |
| 4 | Relocation | 4 services |
| 5 | Starting a Business | 4 services |

---

## 15. Future Enhancements

### 15.1 Service Application via App *(v3.0 — Major Feature)*

Allow citizens to apply for government services directly within the app — eliminating the need to visit an office for eligible online services.

| Feature | Detail |
|---|---|
| **Online Application Flow** | Guided form within the app for services supporting online submission (e-District Kerala, UIDAI) |
| **Document Upload** | Scan and upload documents from phone camera directly |
| **Application Tracking** | Users enter a reference number to check status |
| **Government API Integration** | REST API integration with Kerala e-District portal (subject to government API access) |
| **Optional Login** | Kerala Gov SSO / Meri Pehchaan for cross-device application tracking |

### 15.2 Service Reminders & Notifications *(v3.0 — Major Feature)*

Proactively notify users about renewals, application updates, and government news.

| Feature | Detail |
|---|---|
| **Renewal Reminders** | Push/SMS reminders for expiring documents (driving licence, vehicle fitness, passport) |
| **Application Status Updates** | Notify user when status changes: submitted → under review → approved |
| **Government News Feed** | Relevant scheme news for services the user has searched (pension updates, deadline extensions) |
| **Implementation** | Firebase Cloud Messaging (FCM) for push; MSG91 / Twilio for SMS |
| **Opt-in Model** | Users opt-in per service; zero notifications without explicit permission |

### 15.3 Additional Planned Features

| Feature | Target Version |
|---|---|
| Appointment Booking Integration (e-Sewa / district systems) | v2.5 |
| WhatsApp Bot — guidance via WhatsApp for rural reach | v2.5 |
| Admin CMS — officials update service data without code | v2.0 Production |
| Native Android App — offline access for low-connectivity areas | v3.0 |
| Real-time Queue Estimates | v3.0 |
| Hindi / Tamil language support | v2.5 |
| More life events: retirement, disability, land purchase, education enrollment | v2.5 |

---

## 16. Feasibility & Constraints

### 16.1 Hackathon Feasibility (24-hour build)

| Component | Feasible in 24h? | Notes |
|---|---|---|
| React frontend + voice input | Yes | Web Speech API is plug-and-play |
| FastAPI backend + rule-based NLP | Yes | Deterministic, fast to implement |
| Firestore with 10 services | Yes | JSON seed script populates in minutes |
| Life-event detection (5 events) | Yes | Regex trigger matching; no ML needed |
| Anonymous query history (localStorage) | Yes | ~30 lines of JS; zero backend work |
| In-app map — Leaflet + OSM | Yes | No API key needed; lat/lng from Firestore |
| Google Maps fallback deep-link | Yes | One-line URL template |
| Malayalam rendering | Yes | Noto Sans Malayalam via Google Fonts CDN |
| Service application via app | No | Requires government API access — v3.0 |
| Push notifications / reminders | No | Requires FCM + permission flow — v3.0 |
| Full 50+ service coverage | No | Data entry limited in 24h; extensible model ready |

### 16.2 Constraints

- Malayalam speech recognition accuracy depends on Chrome on Android (target device)
- Service data must be manually curated; no government database auto-sync at MVP stage
- Rule-based NLP may miss highly ambiguous multi-intent queries — disambiguation screen is the fallback
- Leaflet + OSM tiles may be slow on 2G — Google Maps deep-link fallback always visible
- Life-event checklist state in localStorage is device-specific; switching devices loses progress

---

## 17. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Malayalam voice recognition fails on older devices | Medium | High | Text input primary; voice is enhancement |
| Service data becomes outdated | High | High | "Last verified" date on each service card; quarterly review |
| Intent detection misclassifies query | Medium | Medium | Disambiguation screen; user can override manually |
| Life-event phrase detection misses informal input | Medium | Medium | Broad trigger phrase list in both languages; fallback to single-service results |
| Map tiles slow on 2G | Medium | Medium | Google Maps deep-link fallback always shown alongside map |
| localStorage cleared by user/browser | Low | Low | Non-critical feature; warn user on first use |
| Low adoption due to digital literacy barriers | Medium | High | Train Akshaya center operators as secondary users; promote via local government |
| Firebase quota exceeded under load | Low | Medium | Firestore caching; budget alerts; Cloud Run auto-scaling |
| Scope creep during hackathon | High | High | Lock to 10 services + 5 life events; extensible data model ready for expansion |
| Government API unavailable for v3.0 | High | High | Engage Kerala IT Mission post-hackathon; use e-District public portal as stopgap |

---

## 18. Appendix

### 18.1 Glossary

| Term | Definition |
|---|---|
| Akshaya Center | Government-authorized e-governance centers across Kerala providing assisted digital services |
| Thandaper | Land ownership record maintained by Kerala Revenue Department |
| Village Office | Local administrative unit handling income and caste certificates |
| Taluk Office | Mid-level administrative unit above Village Office |
| UIDAI | Unique Identification Authority of India — Aadhaar governing body |
| Manglish | Malayalam written using Roman/English script |
| Intent Detection | NLP process of understanding what a user wants from a natural language query |
| Life-Event Mode | Feature detecting major life events and auto-generating multi-service checklists |
| localStorage | Browser-based client-side key-value storage; persists across reloads, cleared by user |
| OSM | OpenStreetMap — free, open-source map tile provider used by Leaflet.js |
| FCM | Firebase Cloud Messaging — push notification service |
| WCAG | Web Content Accessibility Guidelines — international accessibility standard |
| DPDP Act | Digital Personal Data Protection Act, 2023 — India's data privacy law |
| SDG-16 | UN Sustainable Development Goal 16: Peace, Justice, and Strong Institutions |

### 18.2 References

- Kerala Government e-Sewa Portal: https://edistrict.kerala.gov.in
- Akshaya Kerala: https://akshaya.kerala.gov.in
- UIDAI Aadhaar Services: https://uidai.gov.in
- Kerala Bhoomi (Land Records): https://erekha.kerala.gov.in
- Leaflet.js Documentation: https://leafletjs.com
- OpenStreetMap: https://www.openstreetmap.org
- Firebase Firestore: https://firebase.google.com/docs/firestore
- Web Speech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- i18next React: https://react.i18next.com
- Google Maps Deep-link Reference: https://developers.google.com/maps/documentation/urls/get-started

### 18.3 Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | Feb 20, 2026 | Product Team | Initial PRD from project synopsis |
| 2.0 | Feb 21, 2026 | Product Team | Added Section 3 (Judging Criteria alignment); Life-Event Mode FR-19–24; Anonymous Query History FR-25–31; In-App Map FR-32–39; updated tech stack (Leaflet, localStorage, i18next, uuid, Cloud Run, OSM); updated Firestore schemas for life_events + coordinates; new Personas (Priya); 9 new user stories; v3.0 Application & Reminder features; updated feasibility and risk tables |

---

*This PRD is a living document and should be updated as the product evolves through development sprints and user feedback.*
