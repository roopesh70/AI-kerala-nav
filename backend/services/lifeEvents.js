/**
 * Life-Event Detection & Checklist Generator
 * Maps sentences like "My father passed away" to a structured list
 * of government procedures the citizen needs to complete.
 */

const LIFE_EVENTS = [
    {
        id: "death",
        name: "Death of a Family Member",
        name_ml: "കുടുംബത്തിൽ മരണം",
        triggers: [
            "passed away", "died", "death", "expired", "no more",
            "lost my father", "lost my mother", "lost my husband", "lost my wife",
            "lost my parent", "funeral", "മരണം", "മരിച്ചു",
            "അച്ഛൻ മരിച്ചു", "ഭർത്താവ് മരിച്ചു", "അമ്മ മരിച്ചു"
        ],
        description: "When a family member passes away, several government procedures must be completed. Here is your step-by-step guide.",
        description_ml: "ദുഃഖത്തിൽ ഞങ്ങൾ പങ്കുചേരുന്നു. ഈ നടപടികൾ പൂർത്തിയാക്കേണ്ടതുണ്ട്.",
        checklist: [
            {
                step: 1, task: "Obtain Death Certificate", task_ml: "മരണ സർട്ടിഫിക്കറ്റ് ലഭ്യമാക്കുക",
                office: "Panchayat / Municipality", documents: ["Hospital report", "ID proof of deceased"],
                note: "Must be done within 21 days of death", mapQuery: "Panchayat office near me",
                fee: "₹10", processingTime: "7 days"
            },
            {
                step: 2, task: "Apply for Legal Heir Certificate", task_ml: "അവകാശ സർട്ടിഫിക്കറ്റിന് അപേക്ഷിക്കുക",
                office: "Village Office", documents: ["Death certificate", "Ration card", "Affidavit"],
                note: "Required for property and financial claims", mapQuery: "Village office near me",
                fee: "₹25", processingTime: "15 days"
            },
            {
                step: 3, task: "Claim Life Insurance", task_ml: "ലൈഫ് ഇൻഷുറൻസ് ക്ലെയിം ചെയ്യുക",
                office: "Insurance Office (LIC / Private)", documents: ["Death certificate", "Policy document", "Claimant ID"],
                note: "Notify insurer as soon as possible", mapQuery: "LIC office near me",
                fee: "Free", processingTime: "30 days"
            },
            {
                step: 4, task: "Transfer / Stop Pension", task_ml: "പെൻഷൻ മാറ്റം / നിർത്തൽ",
                office: "Treasury / Panchayat", documents: ["Death certificate", "Pension book", "Legal heir certificate"],
                note: "Apply for family pension if eligible", mapQuery: "Treasury office near me",
                fee: "Free", processingTime: "30 days"
            },
            {
                step: 5, task: "Update Bank Accounts", task_ml: "ബാങ്ക് അക്കൗണ്ടുകൾ അപ്ഡേറ്റ് ചെയ്യുക",
                office: "Bank Branch", documents: ["Death certificate", "Legal heir certificate", "Bank passbook"],
                note: "Close or transfer accounts, claim nominee amounts", mapQuery: "Bank near me",
                fee: "Free", processingTime: "7–14 days"
            },
            {
                step: 6, task: "Update Ration Card", task_ml: "റേഷൻ കാർഡ് അപ്ഡേറ്റ് ചെയ്യുക",
                office: "Civil Supplies Office", documents: ["Death certificate", "Ration card"],
                note: "Remove deceased member from ration card", mapQuery: "Civil supplies office near me",
                fee: "Free", processingTime: "15 days"
            },
            {
                step: 7, task: "Transfer Property / Mutation", task_ml: "സ്വത്ത് കൈമാറ്റം",
                office: "Village Office / Sub-Registrar", documents: ["Death certificate", "Legal heir certificate", "Property documents"],
                note: "Apply for patta transfer if applicable", mapQuery: "Sub registrar office near me",
                fee: "Varies", processingTime: "30–60 days"
            }
        ]
    },
    {
        id: "marriage",
        name: "Marriage / Wedding",
        name_ml: "വിവാഹം",
        triggers: [
            "got married", "just married", "wedding", "marriage", "i'm married",
            "tied the knot", "getting married", "spouse", "വിവാഹം", "കല്യാണം"
        ],
        description: "After marriage, here are the government services and updates you need to complete.",
        description_ml: "വിവാഹത്തിനു ശേഷം ചെയ്യേണ്ട സർക്കാർ നടപടികൾ.",
        checklist: [
            {
                step: 1, task: "Register Marriage & Get Marriage Certificate", task_ml: "വിവാഹ രജിസ്ട്രേഷൻ",
                office: "Panchayat / Municipality", documents: ["Marriage invitation / photos", "ID proof of both", "Witness ID"],
                note: "Register within 1 year of marriage", mapQuery: "Panchayat office near me",
                fee: "₹10–₹100", processingTime: "7–15 days"
            },
            {
                step: 2, task: "Update Name in Aadhaar Card", task_ml: "ആധാർ കാർഡിൽ പേര് പരിഷ്കരിക്കുക",
                office: "Aadhaar Center", documents: ["Marriage certificate", "Current Aadhaar"],
                note: "If name change after marriage", mapQuery: "Aadhaar center near me",
                fee: "₹50", processingTime: "7–10 days"
            },
            {
                step: 3, task: "Update Ration Card (Add Spouse)", task_ml: "റേഷൻ കാർഡ് പരിഷ്കരിക്കുക",
                office: "Civil Supplies Office", documents: ["Marriage certificate", "Ration card", "Spouse Aadhaar"],
                note: "Add spouse to existing card or apply for new card", mapQuery: "Civil supplies office near me",
                fee: "Free", processingTime: "15 days"
            },
            {
                step: 4, task: "Update Voter ID", task_ml: "വോട്ടർ ഐഡി അപ്ഡേറ്റ്",
                office: "Election Office", documents: ["Marriage certificate", "Address proof"],
                note: "Update address if relocated", mapQuery: "Election office near me",
                fee: "Free", processingTime: "15–30 days"
            },
            {
                step: 5, task: "Update Bank Account & Nominee", task_ml: "ബാങ്ക് അക്കൗണ്ട് അപ്ഡേറ്റ്",
                office: "Bank Branch", documents: ["Marriage certificate", "ID proof"],
                note: "Add spouse as joint holder or nominee", mapQuery: "Bank near me",
                fee: "Free", processingTime: "3–7 days"
            },
            {
                step: 6, task: "Update Insurance Nominee", task_ml: "ഇൻഷുറൻസ് നോമിനി മാറ്റം",
                office: "Insurance Office", documents: ["Marriage certificate", "Policy document"],
                note: "Change nominee to spouse", mapQuery: "LIC office near me",
                fee: "Free", processingTime: "7–14 days"
            }
        ]
    },
    {
        id: "childbirth",
        name: "Birth of a Child",
        name_ml: "കുഞ്ഞിന്റെ ജനനം",
        triggers: [
            "baby born", "newborn", "childbirth", "had a baby", "new baby",
            "child born", "gave birth", "delivery", "just delivered",
            "കുഞ്ഞ്", "പ്രസവം", "കുഞ്ഞ് ജനിച്ചു"
        ],
        description: "Congratulations! Here are the essential government procedures after the birth of a child.",
        description_ml: "അഭിനന്ദനങ്ങൾ! കുഞ്ഞിന്റെ ജനനത്തിനു ശേഷമുള്ള ആവശ്യമായ നടപടികൾ.",
        checklist: [
            {
                step: 1, task: "Register Birth & Get Birth Certificate", task_ml: "ജനന രജിസ്ട്രേഷനും സർട്ടിഫിക്കറ്റും",
                office: "Local Panchayat / Municipality", documents: ["Hospital discharge summary", "Parent ID proof"],
                note: "Must be done within 21 days", mapQuery: "Panchayat office near me",
                fee: "₹10 (free if within 21 days)", processingTime: "7 days"
            },
            {
                step: 2, task: "Apply for Aadhaar Card for Child", task_ml: "കുഞ്ഞിന് ആധാർ കാർഡ്",
                office: "Aadhaar Enrollment Center", documents: ["Birth certificate", "Parent Aadhaar"],
                note: "Blue Aadhaar for children under 5", mapQuery: "Aadhaar center near me",
                fee: "Free", processingTime: "15–30 days"
            },
            {
                step: 3, task: "Add Child to Ration Card", task_ml: "റേഷൻ കാർഡിൽ കുഞ്ഞിനെ ചേർക്കുക",
                office: "Civil Supplies Office", documents: ["Birth certificate", "Ration card"],
                note: "Important for food subsidy benefits", mapQuery: "Civil supplies office near me",
                fee: "Free", processingTime: "15 days"
            },
            {
                step: 4, task: "Apply for Maternity Benefit / Janani Suraksha Yojana", task_ml: "ജനനി സുരക്ഷ യോജന",
                office: "Panchayat / Health Center", documents: ["Birth certificate", "Mother's bank details", "Aadhaar"],
                note: "₹6,000 benefit for institutional delivery", mapQuery: "Primary health center near me",
                fee: "Free", processingTime: "30 days"
            },
            {
                step: 5, task: "Vaccination Registration", task_ml: "വാക്സിനേഷൻ രജിസ്ട്രേഷൻ",
                office: "PHC / Government Hospital", documents: ["Birth certificate", "Parent ID"],
                note: "Get vaccination card and follow schedule", mapQuery: "Government hospital near me",
                fee: "Free", processingTime: "Same day"
            }
        ]
    },
    {
        id: "relocation",
        name: "Relocation / Moving to New Address",
        name_ml: "പുതിയ വിലാസത്തിലേക്ക് മാറ്റം",
        triggers: [
            "relocated", "moving", "new address", "shifted house",
            "changed address", "new home", "moved to", "shifted",
            "താമസം മാറ്റി", "താമസം മാറി", "പുതിയ വീട്"
        ],
        description: "After moving to a new address, update these government records.",
        description_ml: "പുതിയ വിലാസത്തിലേക്ക് മാറിയ ശേഷം അപ്ഡേറ്റ് ചെയ്യേണ്ട രേഖകൾ.",
        checklist: [
            {
                step: 1, task: "Update Aadhaar Address", task_ml: "ആധാർ വിലാസം മാറ്റുക",
                office: "Aadhaar Center", documents: ["Aadhaar card", "New address proof (electricity bill / rent agreement)"],
                note: "Can also be done online at uidai.gov.in", mapQuery: "Aadhaar center near me",
                fee: "₹50", processingTime: "7–10 days"
            },
            {
                step: 2, task: "Update Voter ID Address", task_ml: "വോട്ടർ ഐഡി വിലാസം മാറ്റുക",
                office: "Election Office", documents: ["Voter ID", "New address proof"],
                note: "Apply using Form 8A", mapQuery: "Election office near me",
                fee: "Free", processingTime: "15–30 days"
            },
            {
                step: 3, task: "Transfer Ration Card", task_ml: "റേഷൻ കാർഡ് മാറ്റം",
                office: "Civil Supplies Office", documents: ["Ration card", "New address proof"],
                note: "Transfer to new taluk if inter-district move", mapQuery: "Civil supplies office near me",
                fee: "Free", processingTime: "15 days"
            },
            {
                step: 4, task: "Update Bank Address", task_ml: "ബാങ്ക് വിലാസം മാറ്റം",
                office: "Bank Branch", documents: ["Account passbook", "New address proof"],
                note: "Update home branch if needed", mapQuery: "Bank near me",
                fee: "Free", processingTime: "3–7 days"
            },
            {
                step: 5, task: "Get New Residence Certificate", task_ml: "താമസ സർട്ടിഫിക്കറ്റ്",
                office: "Village Office", documents: ["Aadhaar", "Electricity bill"],
                note: "Needed for local benefits and school admission", mapQuery: "Village office near me",
                fee: "₹25", processingTime: "7–15 days"
            }
        ]
    },
    {
        id: "business",
        name: "Starting a Business",
        name_ml: "ബിസിനസ്സ് ആരംഭിക്കുന്നു",
        triggers: [
            "start business", "new business", "open shop", "register company",
            "trade license", "business registration", "startup", "entrepreneur",
            "starting a shop", "opening a store",
            "ബിസിനസ്", "കട തുടങ്ങാൻ", "ബിസിനസ്സ് തുടങ്ങുന്നു", "കട തുടങ്ങുന്നു"
        ],
        description: "Starting a business in Kerala? Here are the government registrations and licenses you need.",
        description_ml: "കേരളത്തിൽ ബിസിനസ്സ് ആരംഭിക്കാൻ ആവശ്യമായ രജിസ്ട്രേഷനുകൾ.",
        checklist: [
            {
                step: 1, task: "Register Business (MSME / Udyam)", task_ml: "ഉദ്യം രജിസ്ട്രേഷൻ",
                office: "Online (udyamregistration.gov.in)", documents: ["Aadhaar", "PAN card", "Business details"],
                note: "Free registration, get Udyam certificate", mapQuery: "DIC office Kerala near me",
                fee: "Free", processingTime: "Same day (online)"
            },
            {
                step: 2, task: "Get Trade License", task_ml: "ട്രേഡ് ലൈസൻസ്",
                office: "Panchayat / Municipality", documents: ["ID proof", "Property proof", "Business plan"],
                note: "Mandatory for shops and establishments", mapQuery: "Panchayat office near me",
                fee: "₹500–₹5,000", processingTime: "15–30 days"
            },
            {
                step: 3, task: "GST Registration", task_ml: "ജിഎസ്ടി രജിസ്ട്രേഷൻ",
                office: "Online (gst.gov.in)", documents: ["PAN card", "Business registration", "Bank details"],
                note: "Required if turnover exceeds ₹20 lakh", mapQuery: "GST office near me",
                fee: "Free", processingTime: "7 days (online)"
            },
            {
                step: 4, task: "Open Current Account", task_ml: "കറന്റ് അക്കൗണ്ട്",
                office: "Bank Branch", documents: ["Business registration", "PAN card", "Address proof"],
                note: "Separate business account recommended", mapQuery: "Bank near me",
                fee: "Varies", processingTime: "1–3 days"
            },
            {
                step: 5, task: "Register Under Kerala Shops & Establishments Act", task_ml: "കടകൾ, സ്ഥാപനങ്ങൾ ആക്റ്റ്",
                office: "Labour Department", documents: ["Trade license", "ID proof", "Employee details"],
                note: "Mandatory if hiring employees", mapQuery: "Labour office Kerala near me",
                fee: "₹100–₹500", processingTime: "7–15 days"
            },
            {
                step: 6, task: "FSSAI Registration (if food-related)", task_ml: "എഫ്എസ്എസ്എഐ രജിസ്ട്രേഷൻ",
                office: "Online (foscos.fssai.gov.in)", documents: ["ID proof", "Business address proof", "Trade license"],
                note: "Required for restaurants, food stalls, food processing", mapQuery: "FSSAI office near me",
                fee: "₹100 (basic)", processingTime: "7–60 days"
            }
        ]
    },
    {
        id: "turning_18",
        name: "Turning 18 — Adult Citizen Registration",
        name_ml: "18 വയസ്സ് — പ്രായപൂർത്തി രജിസ്ട്രേഷൻ",
        triggers: [
            "turned 18", "18 years", "18 years old", "turning 18", "just turned 18",
            "i am 18", "i'm 18", "became 18", "adult now", "18th birthday",
            "eligible to vote", "first time voter",
            "18 വയസ്സ്", "18 വയസ്സായി", "പ്രായപൂർത്തി", "വോട്ടർ", "പതിനെട്ട്"
        ],
        description: "Congratulations on turning 18! As a new adult citizen, here are the essential government registrations you should complete.",
        description_ml: "18 വയസ്സായ നിങ്ങൾക്ക് അഭിനന്ദനങ്ങൾ! പുതിയ പ്രായപൂർത്തി പൗരൻ എന്ന നിലയിൽ ചെയ്യേണ്ട സർക്കാർ രജിസ്ട്രേഷനുകൾ.",
        checklist: [
            {
                step: 1, task: "Register as Voter — Get Voter ID Card", task_ml: "വോട്ടർ ഐഡി കാർഡിന് രജിസ്റ്റർ ചെയ്യുക",
                office: "Election Office / Online (voters.eci.gov.in)", documents: ["Aadhaar Card", "Age proof (10th certificate / Birth certificate)", "Passport-size photo", "Address proof"],
                note: "Apply using Form 6 online or at the ERO office", mapQuery: "Election office near me",
                fee: "Free", processingTime: "15–30 days"
            },
            {
                step: 2, task: "Update Aadhaar to Adult Biometrics", task_ml: "ആധാർ പ്രായപൂർത്തി അപ്ഡേറ്റ്",
                office: "Aadhaar Enrollment Center", documents: ["Existing Aadhaar Card", "School certificate / ID proof"],
                note: "Mandatory biometric update after turning 18 — fingerprints & iris change", mapQuery: "Aadhaar center near me",
                fee: "Free (biometric update)", processingTime: "7–10 days"
            },
            {
                step: 3, task: "Apply for Driving Learner's Licence", task_ml: "ഡ്രൈവിംഗ് ലേണേഴ്സ് ലൈസൻസ്",
                office: "RTO Office / Parivahan Portal", documents: ["Aadhaar Card", "Age proof", "Address proof", "Passport-size photo", "Medical certificate (Form 1A)"],
                note: "Eligible for all vehicle categories at 18", mapQuery: "RTO office near me",
                fee: "₹200–₹500", processingTime: "7 days (after test)"
            },
            {
                step: 4, task: "Open Bank Account (if not already)", task_ml: "ബാങ്ക് അക്കൗണ്ട് തുറക്കുക",
                office: "Any Bank Branch", documents: ["Aadhaar Card", "PAN Card (if available)", "Passport-size photo"],
                note: "Full-access adult savings account; link to Aadhaar for benefits", mapQuery: "Bank near me",
                fee: "Free (Jan Dhan / zero balance)", processingTime: "Same day"
            },
            {
                step: 5, task: "Apply for PAN Card", task_ml: "പാൻ കാർഡിന് അപേക്ഷിക്കുക",
                office: "Online (nsdl.co.in / utiitsl.com)", documents: ["Aadhaar Card", "Date of birth proof"],
                note: "Needed for banking, investments, and tax filing", mapQuery: "PAN card center near me",
                fee: "₹107", processingTime: "10–15 days"
            },
            {
                step: 6, task: "Update Ration Card (mark as adult member)", task_ml: "റേഷൻ കാർഡിൽ പ്രായപൂർത്തിയായ അംഗമായി അപ്ഡേറ്റ്",
                office: "Civil Supplies Office", documents: ["Aadhaar Card", "Ration Card", "Age proof"],
                note: "Important for separate ration entitlements", mapQuery: "Civil supplies office near me",
                fee: "Free", processingTime: "15 days"
            }
        ]
    }
];

/**
 * Detect if a user message describes a life event.
 * Returns the matched life event object or null.
 */
export function detectLifeEvent(message) {
    const text = message.toLowerCase();

    for (const event of LIFE_EVENTS) {
        for (const trigger of event.triggers) {
            if (text.includes(trigger.toLowerCase())) {
                return event;
            }
        }
    }

    return null;
}
