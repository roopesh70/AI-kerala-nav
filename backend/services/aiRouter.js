import { geminiPrimary, geminiSecondary } from "./geminiService.js";
import { huggingFace } from "./huggingfaceService.js";
import { localAI } from "./localRouter.js";
import { findService, formatService } from "./firestoreLookup.js";
import { detectLifeEvent } from "./lifeEvents.js";

// Auto-detect Malayalam script in the input
function detectMalayalamInput(message = "") {
    const malayalamChars = (message.match(/[\u0D00-\u0D7F]/g) || []).length;
    return malayalamChars >= 2;
}

function normalizeCitizenText(message = "") {
    return message
        .toLowerCase()
        .replace(/\baadhar\b/g, "aadhaar")
        .replace(/\bcert\b/g, "certificate")
        .replace(/\bpancard\b/g, "pan card")
        .replace(/\brationcard\b/g, "ration card")
        .replace(/\blicense\b/g, "licence")
        .replace(/\s+/g, " ")
        .trim();
}

function buildLifeEventReply(event, language) {
    const isMalayalam = language === "ml";
    const title = isMalayalam && event.name_ml ? event.name_ml : event.name;
    const intro = isMalayalam && event.description_ml ? event.description_ml : event.description;

    const sections = [];
    sections.push(`📋 ${isMalayalam ? 'ജീവിത ഇവന്റ്' : 'LIFE EVENT'}`);
    sections.push(`${title}`);
    sections.push('');
    sections.push(intro);
    sections.push('');
    sections.push(`${isMalayalam ? 'ഘട്ടങ്ങൾ' : 'STEPS'}:`);

    (event.checklist || []).forEach((item, idx) => {
        const task = isMalayalam && item.task_ml ? item.task_ml : item.task;
        const office = item.office || (isMalayalam ? 'ഓഫീസ്' : 'office');
        const fee = item.fee || (isMalayalam ? 'നിർവ്വചിത' : 'As specified');
        const time = item.processingTime || (isMalayalam ? 'നിർവ്വചിത' : 'As specified');
        sections.push(`${idx + 1}. ${task}`);
        sections.push(`   • ${isMalayalam ? 'സ്ഥലം' : 'Location'}: ${office}`);
        sections.push(`   • ${isMalayalam ? 'ഫീസ്' : 'Fee'}: ${fee}`);
        sections.push(`   • ${isMalayalam ? 'സമയം' : 'Time'}: ${time}`);
    });

    return sections.join('\n').trim();
}

function cleanModelText(text = "") {
    return String(text || "")
        .replace(/\u200B|\u200C|\u200D|\uFEFF/g, "")
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/([0-9])\.(\S)/g, "$1. $2")
        .replace(/([\u2022*-])(\S)/g, "$1 $2")
        .replace(/([•*-])(\S)/g, "$1 $2")
        .trim();
}

function isLowQualityReply(text, language = "en") {
    const value = cleanModelText(text);
    if (!value || value.length < 25) return true;
    if (/undefined|null|\[object Object\]/i.test(value)) return true;
    if (/�/.test(value)) return true;
    if (/(.)\1{8,}/.test(value)) return true;

    const spaces = (value.match(/\s/g) || []).length;
    const spaceRatio = spaces / Math.max(value.length, 1);
    if (value.length > 120 && spaceRatio < 0.04) return true;

    if (language === "ml") {
        const malayalamChars = (value.match(/[\u0D00-\u0D7F]/g) || []).length;
        if (malayalamChars < 8) return true;

        const words = value.split(/\s+/).filter(Boolean);
        const longestWord = words.reduce((max, word) => Math.max(max, word.length), 0);
        if (longestWord > 38 && words.length < 6) return true;
    }

    return false;
}

function buildSafeFallbackReply(language = "en") {
    if (language === "ml") {
        return `## സഹായിക്കാം

ക്ഷമിക്കണം, ഇപ്പോൾ വ്യക്തമായ മറുപടി തയ്യാറാക്കാൻ കഴിഞ്ഞില്ല.

ദയവായി ചോദ്യം ഇങ്ങനെ ചെറിയ രൂപത്തിൽ വീണ്ടും ചോദിക്കുക:
- സേവനത്തിന്റെ പേര്
- ഏത് ജില്ല/സ്ഥലം
- നിങ്ങൾക്ക് വേണ്ട പ്രത്യേക സഹായം

ഉദാഹരണം: "ആധാർ വിലാസം മാറ്റാൻ തിരുവനന്തപുരംയിൽ എന്ത് രേഖകൾ വേണം?"`;
    }

    return `## I can help

Sorry, I could not generate a clear answer right now.

Please ask again in this short format:
- Service name
- District/place
- Exact help needed

Example: "What documents are required for Aadhaar address update in Thiruvananthapuram?"`;
}

function finalizeGeneratedReply(text, language = "en") {
    const cleaned = cleanModelText(text);
    if (isLowQualityReply(cleaned, language)) {
        return buildSafeFallbackReply(language);
    }
    return cleaned;
}

export async function getAIResponse(message, options = {}) {
    let language = options.language === "ml" ? "ml" : "en";

    // Auto-detect: if user typed in Malayalam, force Malayalam response
    if (language === "en" && detectMalayalamInput(message)) {
        language = "ml";
        console.log("🔤 Auto-detected Malayalam input → switching response language to Malayalam");
    }

    const location = options.location || null;
    const normalizedMessage = normalizeCitizenText(message);

    const lifeEvent = detectLifeEvent(normalizedMessage);
    if (lifeEvent) {
        console.log(`Life event detected: ${lifeEvent.name}`);
        return {
            reply: buildLifeEventReply(lifeEvent, language),
            serviceId: null,
            source: "life-event",
            lifeEvent: {
                id: lifeEvent.id,
                name: lifeEvent.name,
                name_ml: lifeEvent.name_ml,
                description: lifeEvent.description,
                description_ml: lifeEvent.description_ml,
                checklist: lifeEvent.checklist,
            },
        };
    }

    const service = await findService(normalizedMessage);
    if (service) {
        console.log(`Service match found: ${service.service} (${service.id})`);
        return {
            reply: formatService(service, language),
            serviceId: service.id,
            source: "firestore",
            applyAt: language === "ml" && service.apply_at_ml ? service.apply_at_ml : (service.apply_at || null),
            steps: language === "ml" && service.steps_ml ? service.steps_ml : (service.steps || []),
            requiredDocuments: language === "ml" && service.required_documents_ml ? service.required_documents_ml : (service.required_documents || []),
            fee: service.fee || null,
            processingTime: language === "ml" && service.processing_time_ml ? service.processing_time_ml : (service.processing_time || null),
            validity: language === "ml" && service.validity_ml ? service.validity_ml : (service.validity || null),
            bestVisitTime: language === "ml" && service.best_visit_time_ml ? service.best_visit_time_ml : (service.best_visit_time || null),
            serviceName: service.service || null,
            serviceName_ml: service.service_ml || null,
            akshayaEligible: service.akshaya_eligible || false,
            department: service.department || null,
            notes: language === "ml" && service.notes_ml ? service.notes_ml : (service.notes || null),
        };
    }

    const locationLine = location?.lat && location?.lng
        ? `User location coordinates: ${location.lat}, ${location.lng}. Use this to suggest nearby offices in Kerala.`
        : "User location not provided. Suggest nearby offices in Kerala district-level terms.";

    const languageLine = language === "ml"
        ? `CRITICAL LANGUAGE INSTRUCTION: You MUST respond ENTIRELY in Malayalam (മലയാളം) script. 
Every single word, heading, and sentence MUST be in Malayalam. 
Do NOT use any English words except proper nouns like website URLs, office names like "UIDAI", or amounts like "₹50".
Use simple, everyday Malayalam that a common village citizen can understand easily.
Do NOT use complex or literary Malayalam.`
        : "Respond in clear, simple English that any citizen can understand easily.";

    const styleLine = `Format response with clear sections using this structure:
## Main heading

**Subheading**: brief clarification
- Bullet list for steps/points
- Keep language simple for common citizens

Use these sections if relevant: ${language === "ml"
            ? "സേവനം | ആവശ്യമായ രേഖകൾ | എങ്ങനെ അപേക്ഷിക്കാം | ഫീസ് | സമയം | എവിടെ പോകണം | നുറുങ്ങുകൾ"
            : "Service | What You Need | How to Apply | Fees | Timeline | Where to Go | Pro Tips"}.`;

    const lifeEventHint = `LIFE EVENT DETECTION: If the citizen describes a life event or milestone (such as getting married, having a baby, turning 18, retiring, losing a family member, buying property, starting a business, getting a job, moving to a new place, divorce, accident, disability, child school admission, etc.), respond with a STRUCTURED CHECKLIST of ALL relevant government services they need. Format it like this:

📋 ${language === "ml" ? "ജീവിത ഇവന്റ്" : "LIFE EVENT"}: [Event Name]
[Brief description]

${language === "ml" ? "ഘട്ടങ്ങൾ" : "STEPS"}:
1. [Service/Task Name]
   • ${language === "ml" ? "സ്ഥലം" : "Where"}: [Office name]
   • ${language === "ml" ? "രേഖകൾ" : "Documents"}: [Required documents]
   • ${language === "ml" ? "ഫീസ്" : "Fee"}: [Amount or Free]
   • ${language === "ml" ? "സമയം" : "Timeline"}: [Processing time]
2. [Next service]
   ...

Include ALL government registrations, applications, and updates the citizen needs. Be thorough — cover every service relevant to that life stage in Kerala/India.`;

    const contextPrompt = [
        `You are Kerala Government Service Navigator AI - helping non-technical citizens understand government services in ${language === "ml" ? "Malayalam" : "English"}.`,
        languageLine,
        lifeEventHint,
        styleLine,
        locationLine,
        `Citizen query: ${message}`,
    ].join("\n");

    try {
        const text = await geminiPrimary(contextPrompt);
        return { reply: finalizeGeneratedReply(text, language), serviceId: null, source: "gemini" };
    } catch {
        console.log("Gemini primary failed");
    }
    try {
        const text = await geminiSecondary(contextPrompt);
        return { reply: finalizeGeneratedReply(text, language), serviceId: null, source: "gemini" };
    } catch {
        console.log("Gemini secondary failed");
    }
    try {
        const text = await huggingFace(contextPrompt, { language });
        return { reply: finalizeGeneratedReply(text, language), serviceId: null, source: "huggingface" };
    } catch {
        console.log("HuggingFace failed");
    }

    const text = await localAI(contextPrompt, language);
    return { reply: finalizeGeneratedReply(text, language), serviceId: null, source: "local (offline-ready)" };
}
