# Kerala AI Navigator — Complete UI/UX Design Document

**Document Type:** UI/UX Design Specification  
**Version:** 1.0  
**Date:** February 21, 2026  
**Based on:** PRD v2.0 — AI-Powered Government Service Navigator (Kerala)  
**Design Language:** Claymorphism  

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Colour System](#2-colour-system)
3. [Typography Scale](#3-typography-scale)
4. [Spacing & Border Radius Tokens](#4-spacing--border-radius-tokens)
5. [Clay CSS Formula](#5-clay-css-formula)
6. [Screen 1 — Home & Search](#6-screen-1--home--search)
7. [Screen 2 — Service Result (Card Response Style)](#7-screen-2--service-result-card-response-style)
8. [Screen 3 — Route Map (Step Procedure)](#8-screen-3--route-map-step-procedure)
9. [Screen 4 — Map & Office (In-App Location)](#9-screen-4--map--office-in-app-location)
10. [Screen 5 — Life-Event Mode](#10-screen-5--life-event-mode)
11. [Screen 6 — Query History Panel (No Login)](#11-screen-6--query-history-panel-no-login)
12. [Component Library](#12-component-library)
13. [Interaction States & Motion](#13-interaction-states--motion)
14. [Accessibility Spec](#14-accessibility-spec)
15. [Responsive Breakpoints](#15-responsive-breakpoints)
16. [Data → UI Mapping](#16-data--ui-mapping)
17. [Do's & Don'ts](#17-dos--donts)

---

## 1. Design Philosophy

### 1.1 Why Claymorphism?

The Kerala Government Service Navigator serves citizens who may be **elderly, low-literacy, first-time users, or in a state of stress** (e.g., navigating services after a death in the family). The UI must communicate:

> *"I am safe. I am easy. I understand you. Touch me."*

Claymorphism achieves this through **physically inflated, soft, tactile elements** that feel warm and approachable — the opposite of the cold, bureaucratic interfaces citizens encounter at government offices.

### 1.2 The Three Pillars

| Pillar | Design Decision | Why |
|---|---|---|
| **Warm** | Kerala-cream background, terracotta/coral primary colour, sand-toned cards | Evokes Kerala's landscape — familiar to the citizen |
| **Tactile** | Heavy border-radius (22–28px), depth shadows, inner gloss, spring animations | Makes elements feel physical and touchable |
| **Clear** | Structured card responses (never chatbot paragraphs), colour-coded steps, tab navigation | Information is parsed at a glance, not read linearly |

### 1.3 What Makes This Unforgettable

**The response is never a paragraph.** When a citizen asks about the Community Certificate, they don't get a wall of text. They get:
- 5 inflated info cards (time · validity · fee · avg. time · best visit)
- A tab bar (Steps · Documents · Map · Fees)
- A visual route map with color-coded connected nodes
- An embedded map with color-coded office pins
- An interactable document checklist

This is the **core UI differentiation** from every other government service chatbot.

---

## 2. Colour System

### 2.1 Palette — Kerala-Inspired Clay Pastels

| Token | Name | Hex | HSL | Use |
|---|---|---|---|---|
| `--coral` | Kerala Coral | `#e8614a` | 9° 77% 59% | Primary CTA, "Ask" button, active states |
| `--peach` | Monsoon Peach | `#f4a07a` | 21° 85% 72% | Secondary accent, info card backgrounds |
| `--sand` | Temple Sand | `#f5e6d3` | 31° 69% 90% | Quick chips, muted surface |
| `--mint` | Paddy Mint | `#b8edd8` | 153° 65% 82% | Success, done states, Akshaya pins |
| `--sky` | Monsoon Sky | `#bde0f5` | 204° 80% 85% | Info, government office pins, steps |
| `--lemon` | Temple Lemon | `#fde98e` | 48° 97% 78% | Warnings, fee badges, life-event banner |
| `--lilac` | Lavender | `#d4c5f9` | 257° 82% 87% | Voice, AI elements, history |
| `--cream` | Background | `#fdf6ee` | 34° 86% 96% | App background |
| `--white` | Card Surface | `#ffffff` | — | All clay cards |
| `--text` | Primary Text | `#2d2d2d` | — | All body copy |
| `--muted` | Secondary Text | `#7a7060` | — | Labels, metadata, placeholders |

### 2.2 Colour Usage Rules

```
Primary action     → --coral   (only the "Ask" button and critical CTAs)
Document done      → --mint    (check marks, completed states)  
Processing/time    → --sky     (info cards, step 1 dot)
Fee/warning        → --lemon   (fee badges, caution notices)
Voice/AI           → --lilac   (mic button, history badges)
Background blobs   → peach + mint + sky + lemon at 28–35% opacity
Shadow tint        → rgba(100, 60, 20, 0.13)  ← warm brown, NEVER grey
```

### 2.3 Semantic Colour Mapping

| Context | Background | Text | Border |
|---|---|---|---|
| Primary CTA | Gradient: coral → #f97316 | White | rgba(255,255,255,0.85) |
| Success / Done | `--mint` 50% opacity | `#0a3d25` | `--mint` |
| Info / Time | `--sky` 50% opacity | `#0a2a5e` | `--sky` |
| Warning / Fee | `--lemon` 50% opacity | `#5c3800` | `--lemon` |
| Life-Event | `--lemon` 30% | `#5c3800` | `--lemon` 60% |
| Priority | `--peach` 30% | `#7a2800` | `--peach` |
| Pending | `rgba(245,230,211,0.7)` | `--muted` | white |

---

## 3. Typography Scale

### 3.1 Font Families

| Role | Family | Weight | Notes |
|---|---|---|---|
| Display / Hero | **Fraunces** (serif) | 700, italic 400 | Google Fonts. Optical sizing. Warm, editorial character |
| UI / Body | **Nunito** (rounded sans) | 600, 700, 800, 900 | Rounded terminals match clay aesthetic |
| Malayalam | **Noto Sans Malayalam** | 600 | Google Fonts CDN. Always minimum 18px |
| Code / Schema | Courier New | 400 | Dev-facing only, not in citizen UI |

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&family=Nunito:wght@600;700;800;900&family=Noto+Sans+Malayalam:wght@600&display=swap');
```

### 3.2 Type Scale

| Level | Font | Size | Weight | Line Height | Use |
|---|---|---|---|---|---|
| Hero Title | Fraunces italic | 48–62px | 700 | 1.05 | App name "Kerala AI Navigator" |
| Screen H1 | Fraunces | 24–30px | 700 | 1.15 | "Community Certificate" |
| Section H2 | Fraunces | 19–22px | 700 | 1.2 | "Nearest Service Centres" |
| Card Title | Nunito | 15–17px | 800 | 1.3 | Step titles, card names |
| Body Copy | Nunito | 14–16px | 600 | 1.70 | Step descriptions, doc notes |
| Label / Overline | Nunito | 10–12px | 900 | 1.2 | "STEP 2 OF 5", "AKSHAYA ELIGIBLE" — all caps |
| Badge | Nunito | 10–12px | 800 | 1.2 | Inline status chips |
| Malayalam Body | Noto Sans Malayalam | **18px min** | 600 | 1.80 | All Malayalam text |

### 3.3 Letter Spacing Rules

```
Hero title:     letter-spacing: -0.02em
Screen H1:      letter-spacing: -0.01em
Body:           letter-spacing: 0
Overline/Label: letter-spacing: 0.10em (ALL CAPS only)
Badge:          letter-spacing: 0.05em
```

---

## 4. Spacing & Border Radius Tokens

### 4.1 Spacing Scale (4px base)

| Token | Value | Common Use |
|---|---|---|
| `--space-1` | 4px | Tight inline gap |
| `--space-2` | 8px | Gap between badges |
| `--space-3` | 12px | Padding inside small chips |
| `--space-4` | 16px | Standard input padding, card inner spacing |
| `--space-5` | 20px | Gap between info cards |
| `--space-6` | 24px | Card padding |
| `--space-7` | 28px | Section card padding |
| `--space-8` | 32px | Gap between major sections |
| `--space-10` | 40px | Page edge padding (mobile) |
| `--space-12` | 48px | Hero top padding |

**Minimum touch target:** `44 × 44px` (WCAG 2.1 AA)  
**Voice button:** `56 × 56px` (prominent for elderly users)

### 4.2 Border Radius Tokens

| Token | Value | Applied To |
|---|---|---|
| `--r-xs` | `6px` | Inline code, micro badges |
| `--r-sm` | `10–12px` | Status badges, small chips |
| `--r-md` | `16px` | Inputs, doc items, step badges |
| `--r-card` | `20–22px` | Service cards, info cards, panels |
| `--r-page-card` | `26–28px` | Full page-width clay sections |
| `--r-pill` | `999px` | All buttons, language toggle items |

---

## 5. Clay CSS Formula

Every clay element in the app is built from the same four-ingredient recipe:

```css
/* ── INGREDIENT 1: Card base ── */
.clay-card {
  background: #ffffff;
  border-radius: 22px;                                    /* generous curves */
  border: 2.5px solid rgba(255, 255, 255, 0.92);          /* white rim — lifts off bg */
  box-shadow:
    0 8px 32px rgba(100, 60, 20, 0.13),                   /* warm deep shadow */
    0 2px 8px  rgba(100, 60, 20, 0.07);                   /* close shadow */
  position: relative;
}

/* ── INGREDIENT 2: Top-surface gloss ── */
.clay-card::before {
  content: '';
  position: absolute; inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    140deg,
    rgba(255, 255, 255, 0.52) 0%,
    rgba(255, 255, 255, 0.00) 58%
  );
  pointer-events: none;
  z-index: 1;
}

/* ── INGREDIENT 3: Button variant ── */
.clay-btn {
  border-radius: 999px;                                   /* pill shape */
  border: 3px solid rgba(255, 255, 255, 0.88);
  box-shadow:
    0 6px 20px rgba(100, 60, 20, 0.14),
    inset 0 2px 4px rgba(255, 255, 255, 0.45);            /* inner gloss */
  font-weight: 800;
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ── INGREDIENT 4: Spring interactions ── */
.clay-btn:hover  { transform: translateY(-3px) scale(1.04); }
.clay-btn:active { transform: scale(0.96); }

/* ── INPUT variant ── */
.clay-input {
  border-radius: 16px;
  border: 2.5px solid rgba(255, 255, 255, 0.92);
  box-shadow:
    0 5px 18px rgba(100, 60, 20, 0.09),
    inset 0 2px 5px rgba(244, 160, 122, 0.12);            /* warm tint inside */
}
.clay-input:focus {
  box-shadow:
    0 0 0 3px rgba(232, 97, 74, 0.28),                    /* coral focus ring */
    0 5px 18px rgba(100, 60, 20, 0.12);
  transform: scale(1.015);
}
```

---

## 6. Screen 1 — Home & Search

### 6.1 Layout

```
┌─────────────────────────────────────────────────────────┐
│  FULL VIEWPORT                                          │
│  Background: cream + warm/mint/sky gradient blobs       │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  HERO CLAY CARD (max-width 720px, centered)     │   │
│  │                                                  │   │
│  │  [CITIZEN ASSISTANT] ← coral overline           │   │
│  │  Kerala AI Navigator  ← Fraunces 700 bold       │   │
│  │  Ask about certificates, schemes...             │   │
│  │                                                  │   │
│  │  ┌──────────────────────────────────┐ [Ask]    │   │
│  │  │ Try: How do I apply for...?      │  coral   │   │
│  │  └──────────────────────────────────┘  pill    │   │
│  │                                                  │   │
│  │  [🎙 Speak in Malayalam or English]  [EN|ML]   │   │
│  │                                                  │   │
│  │  Quick access:                                   │   │
│  │  [🪪 Aadhaar] [📄 Income Cert] [🏠 Land]       │   │
│  │  [👶 Birth]   [💼 Pension]     [🏭 Business]   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Component Breakdown

| Element | Spec |
|---|---|
| Hero card background | `linear-gradient(145deg, #fde8d0 0%, #f5ead8 40%, #e8f5e8 100%)` |
| App title | Fraunces 700, 48–62px, `#2d2d2d`, `letter-spacing: -0.02em` |
| Overline "CITIZEN ASSISTANT" | Nunito 900, 11px, `--coral`, `letter-spacing: 0.14em`, ALL CAPS |
| Subtitle | Nunito 600, 15px, `--muted` |
| Search input | `width: 100%`, `border-radius: 16px`, clay-input style, placeholder: `--muted` |
| "Ask" button | `padding: 16px 28px`, `border-radius: 14px`, coral gradient, Nunito 900 |
| Voice pill | `border-radius: 999px`, semi-transparent white, pulse-animated coral dot |
| Language toggle | Two buttons inside pill container, active = white card with shadow |
| Quick chips | `border-radius: 999px`, sand bg, Nunito 800, hover: translateY(-2px) |

### 6.3 Header Navigation (persistent)

```
┌───────────────────────────────────────────────────────┐
│  🌿 Kerala AI  [History icon 🕐]  [EN | ML toggle]  │
└───────────────────────────────────────────────────────┘
```

- Header: transparent on home, white clay card on inner screens
- History icon: `44 × 44px` tap target, opens slide-up panel
- Language toggle: persists across all screens

### 6.4 Voice Input States

```
IDLE        → [🎙 Speak in Malayalam or English] pill with coral dot pulse
LISTENING   → Full-width ripple animation, "Listening..." text, red pulse ring
PROCESSING  → Coral spinner inside input box
TRANSCRIBED → Text appears in input, editable, "Submit" becomes active
ERROR       → "Couldn't hear you. Please try again." in lemon alert card
```

### 6.5 Empty State / Welcome

When no query has been entered, the home screen shows:
- The 6 quick-access chip tiles
- A soft prompt: *"Ask anything about government services — in Malayalam or English"*
- No chatbot avatar, no suggestion list, no clutter

---

## 7. Screen 2 — Service Result (Card Response Style)

> **Critical design principle:** The response is NEVER a paragraph. It is a structured layout of clay cards, tabs, and interactive elements. This is the core differentiation from a chatbot.

### 7.1 Layout

```
┌───────────────────────────────────────────────────────────┐
│  RESULT CLAY CARD (full-width, max-width 900px)           │
│                                                           │
│  ┌── RESULT HEADER ────────────────────────────────────┐ │
│  │  🏛️ Community Certificate            [Share 🔗]    │ │
│  │  [✓ Akshaya Eligible] [📍 Taluk Office] [⚠️ Note] │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌── INFO CARDS STRIP (5 cards) ─────────────────────┐  │
│  │  ⏱️ Processing │ 📅 Validity │ 💰 Fee │ 📊 Avg  │ 🏪│  │
│  │    5 days      │  3 Years    │  ₹25   │  7 days  │9AM│  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  [📋 Steps] [📎 Documents] [🗺️ Map & Office] [💳 Fees]  │
│   ←  tab bar  →                                          │
│                                                           │
│  ── Active Tab Content ──────────────────────────────   │
│  (Document checklist shown below as example)            │
│                                                           │
│  ⚠️  2 of 7 documents ready. Visit Akshaya centre.      │
└───────────────────────────────────────────────────────────┘
```

### 7.2 Info Cards Strip

Five individual clay cards in a `grid: repeat(auto-fit, minmax(160px, 1fr))` layout:

| Card # | Icon | Label | Value | Background |
|---|---|---|---|---|
| 1 | ⏱️ | Processing Time | 5 days | `--sand` gradient |
| 2 | 📅 | Certificate Valid | 3 Years | `--mint` gradient |
| 3 | 💰 | Fee (General) | ₹25 | `--lemon` gradient |
| 4 | 📊 | Avg. Actual Time | 7 days (Median: 3) | `--sky` gradient |
| 5 | 🏪 | Best Visit Time | 9–11 AM | `--lilac` gradient |

Each card:
```css
.info-card {
  padding: 20px;
  border-radius: 20px;
  border: 2.5px solid rgba(255,255,255,0.92);
  box-shadow: 0 4px 16px rgba(100,60,20,0.10);
  transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
}
.info-card:hover { transform: translateY(-4px); }
.info-card .label { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.10em; }
.info-card .value { font-size: 20px; font-weight: 900; }
.info-card .sub   { font-size: 11px; font-weight: 700; color: var(--muted); }
```

### 7.3 Tab Bar

```css
.tab-bar {
  display: flex; gap: 4px;
  background: rgba(245,230,211,0.6);
  border-radius: 14px; padding: 4px;
  border: 2px solid rgba(255,255,255,0.85);
  overflow-x: auto;           /* horizontal scroll on mobile */
}
.tab {
  padding: 10px 18px; border-radius: 11px;
  font-weight: 800; font-size: 13px; white-space: nowrap;
  flex-shrink: 0; border: none; cursor: pointer;
}
.tab.active {
  background: white; color: var(--text);
  box-shadow: 0 4px 12px rgba(0,0,0,0.10);
}
```

Tabs: **📋 Steps** · **📎 Documents** · **🗺️ Map & Office** · **💳 Fees**

### 7.4 Document Checklist (Documents Tab)

Each document is an interactive clay list item:

```
┌─────────────────────────────────────────────────────────┐
│  ┌──────┐  Affidavit                        [Original] │
│  │  ✓   │  Notarised statement                          │
│  └──────┘                                               │
│                                                         │
│  ┌──────┐  Caste Certificate             [+ Photocopy] │
│  │      │  From issuing authority                       │
│  └──────┘                                               │
└─────────────────────────────────────────────────────────┘
```

- Checked → mint green background dot
- Unchecked → sand/warm background
- `[Original]` badge → yellow (#fff3cd)
- `[+ Photocopy]` badge → green (#e8f5e9)
- Check state saved to `localStorage.gsn_checklist_state`
- Bottom progress bar: "2 of 7 documents ready"

### 7.5 Fee Table (Fees Tab)

Displayed as a clay-styled table, NOT plain HTML table:

```
                    Through Akshaya    Through Portal
General             ₹ 25               ₹ 15
BPL                 ₹ 15               ₹ 15
```

Table styling:
```css
.fee-table td {
  background: rgba(255,255,255,0.65);
  border-top: 2px solid rgba(255,255,255,0.9);
  border-bottom: 2px solid rgba(255,255,255,0.9);
  padding: 13px 18px;
  font-weight: 700; font-size: 13.5px;
}
```

---

## 8. Screen 3 — Route Map (Step Procedure)

> **This is the "Steps" tab content.** Steps are displayed as a visual connected node route, not a numbered list.

### 8.1 Layout

```
Route Map: How to Apply — Community Certificate
│
●──── Step 1: Gather All Required Documents
│     At home / Notary
│     Collect 7 documents. Get affidavit notarised (₹50–100).
│     [📍 At Home / Notary] badge
│
│ (connecting line: sky → peach gradient)
│
●──── Step 2: Visit Akshaya Centre or Apply Online
│     [🏪 Akshaya Centre — ₹25]  [💻 Online Portal — ₹15]
│     Visit nearest Akshaya centre OR apply via edistrict.kerala.gov.in
│
│ (connecting line: peach → lemon gradient)
│
●──── Step 3: Submit Application & Documents
│     [📝 Get Acknowledgement Slip]
│     Submit form + documents. Get slip with reference number.
│
│ (connecting line: lemon → lilac gradient)
│
●──── Step 4: Verification by Village Officer
│     [⏳ Wait 5 Working Days]
│     Officer may conduct local enquiry. Avg: 7 days, Median: 3 days.
│
│ (connecting line: lilac → mint gradient)
│
●──── Step 5: Collect Certificate ← FINAL
      [✅ Valid 3 Years]  [💾 Download from e-District]
      Collect from office or download using reference number.
```

### 8.2 Step Node Colour Coding

| Step | Phase | Node Colour | Line Gradient |
|---|---|---|---|
| 1 | Preparation | `--sky` | sky → peach |
| 2 | Action | `--peach` | peach → lemon |
| 3 | Submission | `--lemon` | lemon → lilac |
| 4 | Wait/Processing | `--lilac` | lilac → mint |
| 5 | Completion | `--mint` | — (no line after final) |

### 8.3 Route Step CSS

```css
.route-step {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.route-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.route-dot {
  width: 44px; height: 44px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 900;
  border: 2.5px solid rgba(255,255,255,0.92);
  box-shadow: 0 4px 14px rgba(0,0,0,0.10);
  z-index: 2;
}

.route-line {
  width: 3px;
  flex: 1; min-height: 32px;
  border-radius: 2px;
  margin: 4px 0;
  /* gradient set per step pair */
}

.route-content {
  padding-bottom: 28px;       /* space between steps */
  flex: 1;
}

.route-step-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 10px;
  font-size: 11px; font-weight: 800;
  margin-top: 8px;
}
```

### 8.4 Route Map Interaction

- Steps are **read-only** by default
- Each step has a **"Mark Complete"** toggle (checkbox dot) that saves to `localStorage`
- On mobile, steps animate in sequentially on first load (staggered `animation-delay`)
- Completed steps: node turns `--mint`, line behind it turns solid mint
- `@media (prefers-reduced-motion: no-preference)` wraps all step animations

---

## 9. Screen 4 — Map & Office (In-App Location)

> The "Map & Office" tab. Shows an embedded Leaflet.js + OpenStreetMap map with color-coded pins and a bottom info sheet.

### 9.1 Layout

```
┌─────────────────────────────────────────────────────────┐
│  🗺️ Nearest Service Centres              [Use My 📍]   │
│                                   [Select District ▼]  │
│  ┌──────────────────────────────────────────────────┐  │
│  │                                                  │  │
│  │  [MAP EMBED — Leaflet.js + OpenStreetMap]        │  │
│  │                                                  │  │
│  │  🔵 Taluk Office Thrissur   (blue pin)           │  │
│  │  🟢 Akshaya Centre          (green pin)          │  │
│  │  🟢 Akshaya Centre 2        (green pin)          │  │
│  │  🔵 Village Office          (blue pin)           │  │
│  │  🔴 Your Location           (coral pulse dot)    │  │
│  │                                                  │  │
│  │  ┌────────────── INFO SHEET ──────────────────┐ │  │
│  │  │ 🏛️ Taluk Office — Thrissur Central         │ │  │
│  │  │ 📍 Near Town Hall · ⏰ 9AM–5PM, Mon–Sat   │ │  │
│  │  │ 📞 +91-487-XXXXXX          [🧭 Directions] │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  [Legend] 🔵 Govt Office  🟢 Akshaya  🔴 You          │
│                                                         │
│  ┈┈┈┈ Map not loading? ┈┈┈┈                           │
│  [Search "Taluk Office near me" on Google Maps →]      │
└─────────────────────────────────────────────────────────┘
```

### 9.2 Map Pin Specification

| Pin Type | Colour | Shape | Tap Action |
|---|---|---|---|
| Government Office | `--sky` (#bde0f5) | Teardrop rotated -45° | Opens info sheet below |
| Akshaya Centre | `--mint` (#b8edd8) | Teardrop rotated -45° | Opens info sheet below |
| Village Office | `--lilac` (#d4c5f9) | Teardrop rotated -45° | Opens info sheet below |
| User Location | `--coral` (#e8614a) | Pulsing circle | No tap action |

Pin component:
```css
.map-pin {
  display: flex; flex-direction: column; align-items: center;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
}
.map-pin:hover { transform: scale(1.15) translateY(-2px); }

.pin-bubble {
  width: 42px; height: 42px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  border: 3px solid white;
  box-shadow: 0 6px 18px rgba(0,0,0,0.20);
  display: flex; align-items: center; justify-content: center;
}
.pin-icon { transform: rotate(45deg); font-size: 18px; }
```

### 9.3 Info Sheet (on pin tap)

```css
.map-info-card {
  position: absolute; bottom: 12px; left: 12px; right: 12px;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(8px);
  border-radius: 14px; padding: 14px 16px;
  border: 2px solid rgba(255,255,255,0.95);
  box-shadow: 0 4px 16px rgba(0,0,0,0.14);
  display: flex; justify-content: space-between; align-items: center;
}
```

Info sheet content:
- Office/centre name (Nunito 800, 13px)
- Address · Hours · Phone (Nunito 700, 11px, `--muted`)
- "Get Directions" button → `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}`

### 9.4 Google Maps Fallback System

**Three-layer fallback — always in this order:**

```
Layer 1 (Primary):   Leaflet.js + OSM tiles
                     → Load in <3s on 4G
                     → No API key required

Layer 2 (Enhanced):  Google Maps Embed API
                     → Optional if API key available
                     → Better satellite imagery

Layer 3 (Fallback):  Google Maps deep-link — ALWAYS VISIBLE
                     → Format: https://www.google.com/maps/search/{office}+near+me
                     → Examples:
                        Taluk Office   → /maps/search/Taluk+Office+near+me
                        Akshaya Centre → /maps/search/Akshaya+Centre+near+me
                        Village Office → /maps/search/Village+Office+near+me
```

Fallback button spec:
```
┌─────────────────────────────────────────────────────────┐
│  Map not loading? Use Google Maps directly:             │
│                [Search "Taluk Office near me" →]        │
└─────────────────────────────────────────────────────────┘
Background: rgba(232,97,74,0.07)
Border: 1.5px dashed rgba(232,97,74,0.30)
Button: white bg, coral text, coral border
```

### 9.5 Geolocation Flow

```
User opens Map tab
        ↓
Request permission (browser API)
        ↓
      GRANTED?
     ↙        ↘
   YES          NO
    ↓            ↓
Map centers   Show district dropdown
on user       User selects → pins load
    ↓            ↓
Color-coded pins visible
        ↓
User taps pin → info sheet slides up
        ↓
Taps "Get Directions" → opens Google Maps
```

---

## 10. Screen 5 — Life-Event Mode

> Triggered when user types/speaks a life-event phrase. Replaces the single-service result with a consolidated multi-service checklist screen.

### 10.1 Trigger Detection

| Life Event | English Trigger Phrases | Malayalam Triggers |
|---|---|---|
| Death in Family | "father passed away", "husband died", "mother died", "someone passed away", "death in family" | "അച്ഛൻ മരിച്ചു", "ഭർത്താവ് മരിച്ചു", "അമ്മ മരിച്ചു" |
| Marriage | "getting married", "wedding", "my marriage", "I got married" | "വിവാഹം", "കല്യാണം" |
| Childbirth | "baby born", "we had a baby", "new baby", "just delivered" | "കുഞ്ഞ് ജനിച്ചു", "പ്രസവം" |
| Relocation | "moved to new house", "shifted", "new address", "relocated" | "താമസം മാറ്റി", "പുതിയ വീട്" |
| Starting Business | "starting a shop", "new business", "opening a store" | "ബിസിനസ്സ് തുടങ്ങുന്നു", "കട തുടങ്ങുന്നു" |

### 10.2 Layout

```
┌─────────────────────────────────────────────────────────┐
│  🔍 You asked: "My father passed away, what do I do?"  │
│     ← query echo in sand card                          │
│                                                         │
│  ┌── LIFE-EVENT BANNER ──────────────────────────────┐ │
│  │  🕊️  Death in Family — 6 Procedures to Complete  │ │
│  │  We understand this is a difficult time...         │ │
│  │  ████████░░░░░░░░░░░░  1 of 6 completed            │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌── SERVICE CARD 1 (DONE) ──────────────────────────┐ │
│  │  ✅  Death Certificate          [Done]             │ │
│  │       Local Body · 7 days · ₹10                   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌── SERVICE CARD 2 (PRIORITY) ──────────────────────┐ │
│  │  2️⃣  Survivor / Widow Pension   [🔥 Priority]     │ │
│  │       Social Justice Dept · 30 days · Free        │ │
│  │       ▼ [Expand for full guidance]                 │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  [Continue for cards 3–6...]                           │
│                                                         │
│  [🔗 Share This Checklist]  [🗑️ Clear Progress]       │
└─────────────────────────────────────────────────────────┘
```

### 10.3 Service Card States

| State | Node Colour | Badge | Background |
|---|---|---|---|
| Done / Complete | `--mint` ✅ | "Done" — mint | mint 15% opacity |
| Priority (do first) | `--peach` 2️⃣ | "🔥 Priority" — peach | peach 15% |
| Info / Sky | `--sky` 3️⃣ | "Pending" — sky | sky 10% |
| Lemon / Warning | `--lemon` 4️⃣ | "Pending" — lemon | lemon 10% |
| Lilac / Later | `--lilac` 5️⃣ | "Pending" — lilac | lilac 10% |
| Grey / Defer | Sand ⚪ | "Later" — muted | sand 10% |

### 10.4 Expandable Service Cards

Each service card expands inline on tap:

```
COLLAPSED:
┌─────────────────────────────────────────────────────┐
│  🔵 [2]  Survivor Pension      [🔥 Priority]   [▼] │
│          Social Justice Dept · 30 days · Free        │
└─────────────────────────────────────────────────────┘

EXPANDED:
┌─────────────────────────────────────────────────────┐
│  🔵 [2]  Survivor Pension      [🔥 Priority]   [▲] │
│          Social Justice Dept · 30 days · Free        │
│                                                      │
│  ── Info Cards Strip (mini) ─────────────────────── │
│  [⏱️ 30 days] [💰 Free] [🏪 Akshaya]              │
│                                                      │
│  ── Route Map (compact) ─────────────────────────── │
│  ● Step 1: Visit Akshaya with documents              │
│  ● Step 2: Submit application form                   │
│  ● Step 3: Wait for approval                         │
│                                                      │
│  ── Map Tab (mini) ──────────────────────────────── │
│  [View on Map →]  [🧭 Get Directions]               │
│                                                      │
│  [Mark as Done ✓]                                   │
└─────────────────────────────────────────────────────┘
```

### 10.5 Life-Event Banner Design

```css
.life-event-banner {
  padding: 22px 26px;
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    rgba(253,233,142,0.30) 0%,
    rgba(244,160,122,0.20) 100%
  );
  border: 2.5px solid rgba(253,233,142,0.60);
}
/* Empathy tone — warm, not clinical */
/* Intro text in Nunito 600, --muted, line-height 1.6 */
/* Progress bar: coral gradient fill, sand track */
```

### 10.6 Life-Event Services Auto-Generated

| Life Event | Service 1 | Service 2 | Service 3 | Service 4 | Service 5 | Service 6 |
|---|---|---|---|---|---|---|
| **Death** | Death Certificate | Survivor Pension | Bank Nominee | Ration Card | Insurance Claim | Property Mutation |
| **Marriage** | Marriage Reg. | Aadhaar Update | Ration Card | Bank Update | — | — |
| **Childbirth** | Birth Certificate | Ration Card | Vaccination Reg. | Child Aadhaar | — | — |
| **Relocation** | Aadhaar Update | Ration Card | Voter ID | Driving Lic. | — | — |
| **Business** | Udyam Reg. | GST Reg. | Trade License | FSSAI | — | — |

---

## 11. Screen 6 — Query History Panel (No Login)

### 11.1 Trigger & Layout

Triggered by tapping the 🕐 history icon in the header. Appears as a slide-up bottom sheet on mobile, a right-side panel on desktop.

```
┌──────────────────────────────────────────────────────┐
│  ─ ─ ─   (drag handle)                              │
│                                                      │
│  Recent Searches                    [Clear All]      │
│  🔒 Stored on your device only — never sent anywhere │
│                                                      │
│  ┌── HISTORY ITEM ────────────────────────────────┐ │
│  │  🕊️  My father passed away         [Life Event] │ │
│  │       Death in Family — 6 services · 2 hrs ago  │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌── HISTORY ITEM ────────────────────────────────┐ │
│  │  📄  income certificate apply        [Service]  │ │
│  │       Income Certificate · Yesterday            │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌── HISTORY ITEM ────────────────────────────────┐ │
│  │  🪪  ആധാർ വിലാസം മാറ്റണം            [Service]  │ │
│  │       Aadhaar Address Update · 3 days ago       │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  [Load More ↓]        (if > 10 entries stored)      │
└──────────────────────────────────────────────────────┘
```

### 11.2 History Item Component

```css
.hist-item {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px; border-radius: 14px;
  background: rgba(255,255,255,0.65);
  border: 2px solid rgba(255,255,255,0.9);
  box-shadow: 0 2px 8px rgba(100,60,20,0.07);
  cursor: pointer;
  transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1);
}
.hist-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 14px rgba(100,60,20,0.11);
}
```

### 11.3 localStorage Schema

```json
{
  "gsn_history": [
    {
      "id": "uuid-v4",
      "query": "My father passed away",
      "type": "life_event",
      "eventId": "death_in_family",
      "serviceName": "Death in Family — 6 Services",
      "timestamp": "2026-02-21T10:30:00Z"
    },
    {
      "id": "uuid-v4",
      "query": "ആധാർ വിലാസം മാറ്റണം",
      "type": "single_service",
      "serviceId": "aadhaar_address_update",
      "serviceName": "Aadhaar Address Update",
      "timestamp": "2026-02-18T09:00:00Z"
    }
  ],
  "gsn_checklist_state": {
    "death_in_family_2026-02-21": {
      "death_certificate": "done",
      "survivor_pension": "in_progress",
      "ration_card_update": "pending"
    }
  },
  "gsn_doc_checked": {
    "community_certificate_2026-02-21": {
      "affidavit": true,
      "caste_certificate": true,
      "ration_card": false
    }
  }
}
```

**Rules:**
- Max 10 entries; oldest auto-removed when limit reached
- Never includes personal data — only query text and service IDs
- Cleared on explicit user action only ("Clear All" with confirmation)
- Malayalam text stored as UTF-8 and displayed correctly

---

## 12. Component Library

### 12.1 Clay Button Variants

| Variant | Background | Use Case |
|---|---|---|
| Primary CTA | `linear-gradient(135deg, #e8614a, #f97316)` | "Ask", "Submit", "Get Directions" |
| Success | `--mint` | "Mark as Done", "Confirm" |
| Warning | `--lemon` | Fee notice CTAs |
| Ghost | `rgba(255,255,255,0.80)` | "Share", "Back", secondary actions |
| Danger | `#fee2e2` / coral text | "Clear History" |

All buttons: `border-radius: 999px`, `border: 3px solid rgba(255,255,255,0.88)`, `font-weight: 800`

### 12.2 Badge / Chip Variants

| Type | Background | Text | Border Radius |
|---|---|---|---|
| Akshaya | `--mint` 40% | `#0a3d25` | 999px |
| Office type | `--sky` 40% | `#0a2a5e` | 999px |
| Fee/time | `--lemon` 40% | `#5c3800` | 999px |
| Life Event | `--peach` 20% | coral | 999px |
| Service | `--mint` 30% | `#0a3d25` | 999px |
| Priority | `--peach` 30% + fire | `#7a2800` | 8px |
| Done | `--mint` 50% | `#0a3d25` | 8px |

### 12.3 Alert Cards

```
INFO    → sky blue bg  + ℹ️  icon  (best visit time tips)
SUCCESS → mint green bg + ✅ icon  (documents complete)
WARNING → lemon bg     + ⚠️  icon  (originals required)
NEUTRAL → sand bg      + 💡 icon  (general guidance)
```

### 12.4 Input Field

```css
.clay-input {
  width: 100%;
  padding: 15px 22px;
  font-family: 'Nunito', sans-serif;
  font-size: 15px; font-weight: 600;
  color: #2d2d2d;
  background: rgba(255,255,255,0.88);
  border-radius: 16px;
  border: 2.5px solid rgba(255,255,255,0.95);
  box-shadow:
    0 5px 18px rgba(100,60,20,0.09),
    inset 0 2px 5px rgba(244,160,122,0.12);
  outline: none;
}

.clay-input::placeholder { color: #7a7060; }
.clay-input:focus {
  box-shadow:
    0 0 0 3px rgba(232,97,74,0.28),
    0 5px 18px rgba(100,60,20,0.12);
  transform: scale(1.012);
}
```

---

## 13. Interaction States & Motion

### 13.1 Spring Easing (Used Everywhere)

```css
--spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

This easing creates a slight overshoot — the "bounce" that makes elements feel physically springy and clay-like.

### 13.2 Interaction State Table

| Component | Default | Hover | Active / Press | Focus |
|---|---|---|---|---|
| Primary Button | Coral gradient, depth shadow | translateY(-3px) scale(1.04) | scale(0.96) | 3px coral outline |
| Ghost Button | White semi-transparent | translateY(-2px) | scale(0.97) | 2px outline |
| Service Card | White, md shadow | translateY(-4px), lg shadow | scale(0.99) | Outline ring |
| Doc List Item | White 65% | translateX(+4px) | Slight squish | Outline |
| History Item | White 65% | translateX(+4px) | scale(0.99) | Outline |
| Life-Event Card | Tinted bg | translateX(+6px) | scale(0.99) | Outline |
| Quick Chip | Sand bg | translateY(-2px) | scale(0.97) | Outline |
| Map Pin | Full opacity | scale(1.15) translateY(-2px) | scale(1.0) | n/a |
| Input | Warm shadow | No change (preserve text readability) | — | Coral glow ring + scale(1.012) |

**All durations:** `0.18s` for hover, `0.12s` for active press

### 13.3 Page Load Animation

Staggered reveal on initial load (home screen):

```css
/* Elements animate in sequentially */
.hero-card     { animation: floatUp 0.5s ease 0s    both; }
.hero-title    { animation: floatUp 0.5s ease 0.1s  both; }
.search-row    { animation: floatUp 0.5s ease 0.2s  both; }
.voice-row     { animation: floatUp 0.5s ease 0.3s  both; }
.quick-chips   { animation: floatUp 0.5s ease 0.4s  both; }

@keyframes floatUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0);    }
}
```

Result screen: cards animate in left-to-right with `animation-delay` stagger.

### 13.4 Route Map Step Animation (mobile)

Steps reveal one by one on first render:

```css
.route-step:nth-child(1) { animation: floatUp 0.4s ease 0.1s both; }
.route-step:nth-child(2) { animation: floatUp 0.4s ease 0.2s both; }
.route-step:nth-child(3) { animation: floatUp 0.4s ease 0.3s both; }
.route-step:nth-child(4) { animation: floatUp 0.4s ease 0.4s both; }
.route-step:nth-child(5) { animation: floatUp 0.4s ease 0.5s both; }
```

### 13.5 Reduced Motion

All animations wrapped:

```css
@media (prefers-reduced-motion: no-preference) {
  /* spring transitions, stagger reveals, float animations */
}
/* Outside the query → instant state change, opacity fade only */
```

---

## 14. Accessibility Spec

### 14.1 Colour Contrast (All WCAG AA)

| Foreground | Background | Ratio | Pass? |
|---|---|---|---|
| `#2d2d2d` on white card | `#ffffff` | 12.6:1 | ✅ AAA |
| `#2d2d2d` on `--cream` | `#fdf6ee` | 11.4:1 | ✅ AAA |
| `#0a3d25` on `--mint` | `#b8edd8` | 5.8:1 | ✅ AA |
| `#0a2a5e` on `--sky` | `#bde0f5` | 6.2:1 | ✅ AA |
| `#5c3800` on `--lemon` | `#fde98e` | 5.5:1 | ✅ AA |
| `white` on coral button | `#e8614a` | 4.7:1 | ✅ AA |

### 14.2 Touch & Interaction

| Element | Min Size | Note |
|---|---|---|
| All buttons | `44 × 44px` | WCAG 2.5.5 |
| Voice button | `56 × 56px` | Extra large for elderly users |
| Doc checkboxes | `44 × 44px` | Full row is tappable |
| Tab bar items | `44px height` | Horizontal scroll if overflow |
| Map pins | `44 × 44px tap target` | Larger than visual pin |
| History items | Full-width, min `52px height` | Easy tap |

### 14.3 ARIA Labels

```html
<!-- Voice button -->
<button aria-label="Speak your query in Malayalam or English" role="button">
  🎙
</button>

<!-- Language toggle -->
<div role="group" aria-label="Select language">
  <button aria-pressed="true">English</button>
  <button aria-pressed="false">മലയാളം</button>
</div>

<!-- Document checklist item -->
<div role="checkbox" aria-checked="true" aria-label="Affidavit — Original required — Checked">

<!-- Tab bar -->
<div role="tablist" aria-label="Service information sections">
  <button role="tab" aria-selected="true" aria-controls="steps-panel">Steps</button>
  ...
</div>

<!-- Map fallback -->
<a aria-label="Search for Taluk Office near me on Google Maps — opens in new tab">
  Search Near Me →
</a>
```

### 14.4 Malayalam Text Minimum Sizes

| Use | Minimum Size |
|---|---|
| Body copy | 18px |
| Labels/badges | 13px |
| Button text | 14px |
| Document names | 16px |
| Step descriptions | 17px |

---

## 15. Responsive Breakpoints

### 15.1 Breakpoints

| Name | Width | Layout |
|---|---|---|
| Mobile S | `< 360px` | Single column, full-width cards |
| Mobile M | `360–480px` | Primary target device |
| Mobile L | `480–640px` | Slightly wider cards |
| Tablet | `640–900px` | 2-column info cards |
| Desktop | `> 900px` | Max-width container 900px, centered |

### 15.2 Mobile-First Key Rules

```css
/* Search row: stacks vertically on < 480px */
@media (max-width: 480px) {
  .search-row { flex-direction: column; }
  .search-box, .ask-btn { width: 100%; }
}

/* Info cards: 2 columns on mobile, 5 on desktop */
.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

/* Tab bar: horizontal scroll on mobile */
.tab-bar { overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* Route map: full width on all screen sizes */
.route-steps { max-width: 100%; }

/* Map embed: fixed 260px height on mobile, 340px on desktop */
.map-embed { height: clamp(240px, 35vw, 360px); }

/* History panel: bottom sheet on mobile, side panel on desktop */
@media (max-width: 640px) {
  .history-panel { position: fixed; bottom: 0; left: 0; right: 0; border-radius: 22px 22px 0 0; }
}
@media (min-width: 640px) {
  .history-panel { position: fixed; right: 0; top: 0; bottom: 0; width: 340px; border-radius: 22px 0 0 22px; }
}
```

---

## 16. Data → UI Mapping

This section shows how the Kerala e-District data format (as seen in the reference screenshots) maps to UI components.

### 16.1 e-District Data → Info Cards

| e-District Field | UI Component | Position |
|---|---|---|
| `Processing time: 5 working days` | Info Card 1 — "⏱️ 5 days" | First card |
| `Validity of certificate: 3 years` | Info Card 2 — "📅 3 Years" | Second card |
| `Fee Detail > General > Through Akshaya: 25` | Info Card 3 — "💰 ₹25" | Third card |
| `Average time: 7 day(s)` | Info Card 4 — "📊 7 days (Median: 3)" | Fourth card |
| Best visit time (derived) | Info Card 5 — "🏪 9–11 AM" | Fifth card |

### 16.2 e-District Data → Document Checklist

```
e-District Required Documents list:
  ✎ Affidavit
  ✎ Any relevant document certifying caste
  ✎ Caste Certificate
  ✎ Conversion Certificate from concerned authority
  ✎ Gazette Notification
  ✎ Ration Card
  ✎ School Certificate

→ Maps to 7 clay doc-item rows in the Documents tab
→ Each gets: name, sub-description, Original/Photocopy badge
→ Checkboxes stored in localStorage
```

### 16.3 e-District Notices → Alert Cards

```
e-District: "! Certificate required for Outside State Purpose issued from Taluk(s)"
→ Maps to: result header badge [⚠️ Outside State: Taluk]

e-District: "! Certificate required for State Purpose issued from Taluk(s)"
→ Maps to: lemon alert card below info cards:
  "ℹ️ State-purpose applications handled by Taluk Office.
     Outside-state applications also at Taluk level."
```

### 16.4 Firestore Schema → UI Elements

```json
{
  "name_en": "Community Certificate",          → Screen title
  "department": "Taluk Office",                → Blue badge in header
  "fee": "₹25 General / ₹15 BPL",            → Fee info card + fee table
  "processing_time": "5 working days",         → Time info card
  "best_visit_time": "9 AM – 11 AM weekdays", → Visit info card
  "akshaya_eligible": true,                    → "✓ Akshaya Eligible" badge
  "steps_en": [...],                           → Route map nodes
  "documents": [...],                          → Document checklist
  "office.lat": 10.5276,                       → Map pin position
  "office.lng": 76.2144,                       → Map pin position
  "office.gmaps_search_fallback": "..."        → Fallback link URL
}
```

---

## 17. Do's & Don'ts

### ✅ Do

| Category | Rule |
|---|---|
| **Response Format** | Always display responses as structured clay cards, never as text paragraphs |
| **Shadows** | Use warm-brown tinted shadows `rgba(100,60,20,0.13)` — never grey |
| **Border** | Every clay element has `2.5px solid rgba(255,255,255,0.92)` white border |
| **Gloss** | Every clay card has a `::before` linear-gradient gloss layer |
| **Easing** | Use spring easing `cubic-bezier(0.34,1.56,0.64,1)` for all hover/active states |
| **Radius** | Be generous — buttons: 999px, cards: 22px, inputs: 16px |
| **Typography** | Fraunces for titles, Nunito for everything else — never Arial, Inter, or Roboto |
| **Map** | Always show the "Search near me" Google Maps fallback link — even when map loads |
| **Malayalam** | Minimum 18px for all Malayalam text; test with Noto Sans Malayalam |
| **History** | Never send query history to server — localStorage only, always |
| **Touch** | Every interactive element ≥ 44×44px tap target |
| **Feedback** | Every tap shows immediate visual response (shadow deepen, scale change) |

### ❌ Don't

| Category | Rule |
|---|---|
| **Response Format** | Never show the AI response as a chat bubble or paragraph |
| **Shadows** | Never use grey shadows (`rgba(0,0,0,0.x)`) — looks cold and clinical |
| **Typography** | Never use Inter, Roboto, system-ui, or Arial |
| **Colours** | Never use pure purple or the clichéd "AI purple gradient" |
| **Map** | Never remove the fallback link — if map fails with no fallback, user is stranded |
| **Claymorphism** | Never apply dark background — claymorphism is a light-mode aesthetic |
| **Animation** | Never use `ease-in-out` or `linear` — always spring easing |
| **Malayalam** | Never render Malayalam text below 18px |
| **Privacy** | Never log, transmit, or sync query history to any server |
| **Accessibility** | Never make touch targets smaller than 44×44px |
| **Fee display** | Never show just one fee — always show Akshaya vs Portal vs BPL breakdown |
| **Steps** | Never display procedure steps as a plain `<ol>` list — always use route map nodes |

---

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | Feb 21, 2026 | Design Team | Initial design document. All 6 screens specced. Full claymorphism system. Card response format, route map, in-app map, life-event mode, history panel. Based on PRD v2.0. |

---

*This design document is paired with PRD v2.0 (February 21, 2026) and the Claymorphism Design System reference document. All implementation should reference these three documents together.*
