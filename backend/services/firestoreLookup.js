import { db } from "../firebase.js";

// Local fallback service data when Firestore is unavailable
const LOCAL_SERVICES = [
    {
        id: "aadhaar_address_update",
        service: "Aadhaar Address Update",
        service_ml: "ആധാർ വിലാസം മാറ്റൽ",
        department: "UIDAI / Akshaya Center",
        keywords: ["aadhaar", "address", "update", "change", "aadhaar card", "ആധാർ", "വിലാസം", "മാറ്റൽ"],
        steps: [
            "Visit nearest Akshaya Centre with your documents",
            "Fill the Aadhaar Address Update Form",
            "Submit address proof document",
            "Pay ₹50 processing fee",
            "Collect acknowledgement slip with URN",
            "New Aadhaar delivered within 7-10 days"
        ],
        steps_ml: [
            "രേഖകളുമായി അടുത്തുള്ള അക്ഷയ കേന്ദ്രത്തിൽ പോകുക",
            "ആധാർ വിലാസ മാറ്റ ഫോം പൂരിപ്പിക്കുക",
            "വിലാസ തെളിവ് രേഖ സമർപ്പിക്കുക",
            "₹50 പ്രോസസ്സിംഗ് ഫീസ് അടയ്ക്കുക",
            "URN ഉള്ള രസീത് സ്ലിപ്പ് വാങ്ങുക",
            "7-10 ദിവസത്തിനുള്ളിൽ പുതിയ ആധാർ ലഭിക്കും"
        ],
        required_documents: ["Current Aadhaar Card", "New Address Proof (Electricity Bill / Rent Agreement / Gas Connection)", "Mobile number linked to Aadhaar"],
        required_documents_ml: ["നിലവിലെ ആധാർ കാർഡ്", "പുതിയ വിലാസ തെളിവ് (ഇലക്ട്രിസിറ്റി ബിൽ / വാടക കരാർ / ഗ്യാസ് കണക്ഷൻ)", "ആധാറുമായി ബന്ധിപ്പിച്ച മൊബൈൽ നമ്പർ"],
        fee: "₹50",
        processing_time: "7–10 working days",
        processing_time_ml: "7–10 പ്രവൃത്തി ദിവസങ്ങൾ",
        validity: "Permanent (until next update)",
        validity_ml: "സ്ഥിരം (അടുത്ത അപ്ഡേറ്റ് വരെ)",
        best_visit_time: "9 AM – 11 AM weekdays",
        best_visit_time_ml: "രാവിലെ 9 – 11 പ്രവൃത്തി ദിവസങ്ങളിൽ",
        apply_at: "Akshaya Centre / UIDAI Portal",
        apply_at_ml: "അക്ഷയ കേന്ദ്രം / UIDAI പോർട്ടൽ",
        akshaya_eligible: true,
        notes: "You can also update online at myaadhaar.uidai.gov.in using OTP verification",
        notes_ml: "myaadhaar.uidai.gov.in-ൽ OTP ഉപയോഗിച്ച് ഓൺലൈനായും അപ്ഡേറ്റ് ചെയ്യാം"
    },
    {
        id: "pan_card",
        service: "PAN Card (New / Correction / Reprint)",
        service_ml: "പാൻ കാർഡ് (പുതിയത് / തിരുത്തൽ / റീപ്രിന്റ്)",
        department: "Income Tax Department (NSDL / UTIITSL)",
        keywords: ["pan", "pan card", "pancard", "permanent account number", "income tax", "nsdl", "utiitsl", "പാൻ"],
        steps: [
            "Apply online through NSDL or UTIITSL portal (or via Akshaya support center)",
            "Choose request type: New PAN / Correction / Reprint",
            "Fill personal details and upload required documents",
            "Complete Aadhaar OTP / eKYC and pay applicable fee",
            "Track application using acknowledgement number",
            "Receive e-PAN by email and physical PAN by post (if selected)"
        ],
        required_documents: ["Identity Proof", "Address Proof", "Date of Birth Proof", "Passport-size photo (if required)", "Existing PAN copy (for correction/reprint)"],
        fee: "Usually starts around ₹107 for Indian communication address; provider-wise charges may vary",
        processing_time: "Usually 10-15 working days",
        validity: "Permanent",
        best_visit_time: "Apply online anytime; for centers prefer 10 AM - 12 PM weekdays",
        apply_at: "NSDL / UTIITSL portal or authorized PAN facilitation center",
        akshaya_eligible: true,
        notes: "Only one PAN per person is allowed. Use correction/reprint if PAN already exists."
    },
    {
        id: "income_certificate",
        service: "Income Certificate",
        service_ml: "വരുമാന സർട്ടിഫിക്കറ്റ്",
        department: "Village Office / Taluk Office",
        keywords: ["income", "certificate", "income certificate", "salary", "earnings", "വരുമാനം", "സർട്ടിഫിക്കറ്റ്"],
        steps: [
            "Visit Village Office or apply at e-District portal",
            "Submit application with required documents",
            "Pay ₹25 fee (or ₹15 online)",
            "Village Officer verifies details",
            "Certificate issued within 5 working days",
            "Collect from office or download from e-District portal"
        ],
        steps_ml: [
            "വില്ലേജ് ഓഫീസിൽ പോകുക അല്ലെങ്കിൽ e-District പോർട്ടലിൽ അപേക്ഷിക്കുക",
            "ആവശ്യമായ രേഖകളോടൊപ്പം അപേക്ഷ സമർപ്പിക്കുക",
            "₹25 ഫീസ് അടയ്ക്കുക (ഓൺലൈൻ ₹15)",
            "വില്ലേജ് ഓഫീസർ വിശദാംശങ്ങൾ പരിശോധിക്കും",
            "5 പ്രവൃത്തി ദിവസത്തിനുള്ളിൽ സർട്ടിഫിക്കറ്റ് ലഭിക്കും",
            "ഓഫീസിൽ നിന്ന് ശേഖരിക്കുക അല്ലെങ്കിൽ e-District പോർട്ടലിൽ നിന്ന് ഡൗൺലോഡ് ചെയ്യുക"
        ],
        required_documents: ["Aadhaar Card", "Ration Card", "Salary Certificate / Self-Declaration", "Land Tax Receipt (if applicable)"],
        required_documents_ml: ["ആധാർ കാർഡ്", "റേഷൻ കാർഡ്", "ശമ്പള സർട്ടിഫിക്കറ്റ് / സ്വയം പ്രഖ്യാപനം", "ഭൂനികുതി രസീത് (ബാധകമെങ്കിൽ)"],
        fee: { "General (Akshaya)": "₹25", "General (Online)": "₹15", "BPL": "₹15" },
        processing_time: "5 working days",
        processing_time_ml: "5 പ്രവൃത്തി ദിവസങ്ങൾ",
        validity: "1 year",
        validity_ml: "1 വർഷം",
        best_visit_time: "10 AM – 11:30 AM weekdays",
        best_visit_time_ml: "രാവിലെ 10 – 11:30 പ്രവൃത്തി ദിവസങ്ങളിൽ",
        apply_at: "Village Office / e-District Portal",
        apply_at_ml: "വില്ലേജ് ഓഫീസ് / e-District പോർട്ടൽ",
        akshaya_eligible: true,
        notes: "e-District portal: https://edistrict.kerala.gov.in",
        notes_ml: "e-District പോർട്ടൽ: https://edistrict.kerala.gov.in"
    },
    {
        id: "community_certificate",
        service: "Community / Caste Certificate",
        service_ml: "ജാതി സർട്ടിഫിക്കറ്റ്",
        department: "Village Office / Taluk Office",
        keywords: ["caste", "community", "certificate", "obc", "sc", "st", "ജാതി", "സമുദായം"],
        steps: [
            "Gather all required documents including affidavit",
            "Visit Akshaya Centre or apply via e-District portal",
            "Submit application with documents and fee",
            "Get acknowledgement slip with reference number",
            "Village Officer conducts verification (may include local enquiry)",
            "Collect certificate from office or download online"
        ],
        steps_ml: [
            "സത്യവാങ്മൂലം ഉൾപ്പെടെ ആവശ്യമായ എല്ലാ രേഖകളും ശേഖരിക്കുക",
            "അക്ഷയ കേന്ദ്രത്തിൽ പോകുക അല്ലെങ്കിൽ e-District പോർട്ടലിൽ അപേക്ഷിക്കുക",
            "രേഖകളും ഫീസും സഹിതം അപേക്ഷ സമർപ്പിക്കുക",
            "റഫറൻസ് നമ്പറുള്ള രസീത് സ്ലിപ്പ് വാങ്ങുക",
            "വില്ലേജ് ഓഫീസർ പരിശോധന നടത്തും",
            "ഓഫീസിൽ നിന്ന് സർട്ടിഫിക്കറ്റ് ശേഖരിക്കുക"
        ],
        required_documents: ["Affidavit (Notarised)", "Existing Caste Certificate (if any)", "Ration Card", "School Certificate", "Gazette Notification (if applicable)", "Conversion Certificate (if applicable)"],
        required_documents_ml: ["സത്യവാങ്മൂലം (നോട്ടറൈസ്ഡ്)", "നിലവിലുള്ള ജാതി സർട്ടിഫിക്കറ്റ് (ഉണ്ടെങ്കിൽ)", "റേഷൻ കാർഡ്", "സ്കൂൾ സർട്ടിഫിക്കറ്റ്", "ഗസറ്റ് വിജ്ഞാപനം (ബാധകമെങ്കിൽ)", "പരിവർത്തന സർട്ടിഫിക്കറ്റ് (ബാധകമെങ്കിൽ)"],
        fee: { "General (Akshaya)": "₹25", "General (Online)": "₹15", "BPL": "₹15" },
        processing_time: "5 working days",
        processing_time_ml: "5 പ്രവൃത്തി ദിവസങ്ങൾ",
        validity: "3 years",
        validity_ml: "3 വർഷം",
        best_visit_time: "9 AM – 11 AM weekdays",
        best_visit_time_ml: "രാവിലെ 9 – 11 പ്രവൃത്തി ദിവസങ്ങളിൽ",
        apply_at: "Village Office / Taluk Office / e-District Portal",
        apply_at_ml: "വില്ലേജ് ഓഫീസ് / താലൂക്ക് ഓഫീസ് / e-District പോർട്ടൽ",
        akshaya_eligible: true,
        notes: "Outside-state purpose certificates are issued by Taluk Office only",
        notes_ml: "സംസ്ഥാനത്തിന് പുറത്തേക്കുള്ള സർട്ടിഫിക്കറ്റുകൾ താലൂക്ക് ഓഫീസിൽ നിന്ന് മാത്രമേ ലഭിക്കൂ"
    },
    {
        id: "land_record",
        service: "Land Record / Thandaper Extract",
        service_ml: "ഭൂമി രേഖ / തണ്ടപ്പേർ",
        department: "Land Revenue Department",
        keywords: ["land", "record", "thandaper", "property", "patta", "ഭൂമി", "തണ്ടപ്പേർ", "സ്വത്ത്"],
        steps: [
            "Visit Village Office with property details",
            "Submit application for land record extract",
            "Pay required fee",
            "Officer verifies records",
            "Collect Thandaper extract"
        ],
        steps_ml: [
            "സ്വത്ത് വിശദാംശങ്ങളുമായി വില്ലേജ് ഓഫീസിൽ പോകുക",
            "ഭൂമി രേഖ എക്സ്ട്രാക്ടിന് അപേക്ഷ സമർപ്പിക്കുക",
            "ആവശ്യമായ ഫീസ് അടയ്ക്കുക",
            "ഓഫീസർ രേഖകൾ പരിശോധിക്കും",
            "തണ്ടപ്പേർ എക്സ്ട്രാക്ട് ശേഖരിക്കുക"
        ],
        required_documents: ["Property Tax Receipt", "Previous Land Record (if available)", "Aadhaar Card", "Survey Number details"],
        required_documents_ml: ["സ്വത്ത് നികുതി രസീത്", "മുൻ ഭൂമി രേഖ (ലഭ്യമെങ്കിൽ)", "ആധാർ കാർഡ്", "സർവേ നമ്പർ വിശദാംശങ്ങൾ"],
        fee: "₹15–₹50",
        processing_time: "3–7 working days",
        processing_time_ml: "3–7 പ്രവൃത്തി ദിവസങ്ങൾ",
        validity: "As of issue date",
        validity_ml: "ഇഷ്യൂ ചെയ്ത തീയതി പ്രകാരം",
        best_visit_time: "10 AM – 12 PM weekdays",
        best_visit_time_ml: "രാവിലെ 10 – 12 പ്രവൃത്തി ദിവസങ്ങളിൽ",
        apply_at: "Village Office",
        apply_at_ml: "വില്ലേജ് ഓഫീസ്",
        akshaya_eligible: false,
        notes: "Online records: https://erekha.kerala.gov.in",
        notes_ml: "ഓൺലൈൻ രേഖകൾ: https://erekha.kerala.gov.in"
    },
    {
        id: "birth_certificate",
        service: "Birth Certificate",
        service_ml: "ജനന സർട്ടിഫിക്കറ്റ്",
        department: "Local Body (Panchayat / Municipality)",
        keywords: ["birth", "certificate", "born", "child", "baby", "ജനനം", "ജനന"],
        steps: [
            "Obtain Hospital Discharge Summary",
            "Visit local Panchayat / Municipality office within 21 days",
            "Submit birth registration form with documents",
            "Pay registration fee",
            "Collect birth certificate"
        ],
        steps_ml: [
            "ഹോസ്പിറ്റൽ ഡിസ്ചാർജ് സമ്മറി ലഭ്യമാക്കുക",
            "21 ദിവസത്തിനുള്ളിൽ പഞ്ചായത്ത് / മുനിസിപ്പാലിറ്റി ഓഫീസിൽ പോകുക",
            "രേഖകൾ സഹിതം ജനന രജിസ്ട്രേഷൻ ഫോം സമർപ്പിക്കുക",
            "രജിസ്ട്രേഷൻ ഫീസ് അടയ്ക്കുക",
            "ജനന സർട്ടിഫിക്കറ്റ് ശേഖരിക്കുക"
        ],
        required_documents: ["Hospital Discharge Summary / Birth Report", "Parent ID Proof (Aadhaar)", "Parent Marriage Certificate", "Address Proof"],
        required_documents_ml: ["ഹോസ്പിറ്റൽ ഡിസ്ചാർജ് സമ്മറി / ജനന റിപ്പോർട്ട്", "രക്ഷിതാവിന്റെ ഐഡി (ആധാർ)", "രക്ഷിതാവിന്റെ വിവാഹ സർട്ടിഫിക്കറ്റ്", "വിലാസ തെളിവ്"],
        fee: "₹10 (Free if within 21 days in some panchayats)",
        processing_time: "7 working days",
        processing_time_ml: "7 പ്രവൃത്തി ദിവസങ്ങൾ",
        validity: "Permanent",
        validity_ml: "സ്ഥിരം",
        best_visit_time: "10 AM – 12 PM weekdays",
        best_visit_time_ml: "രാവിലെ 10 – 12 പ്രവൃത്തി ദിവസങ്ങളിൽ",
        apply_at: "Local Panchayat / Municipality",
        apply_at_ml: "പഞ്ചായത്ത് / മുനിസിപ്പാലിറ്റി",
        akshaya_eligible: true,
        notes: "Registration is mandatory within 21 days of birth. Late registration requires additional processes.",
        notes_ml: "21 ദിവസത്തിനുള്ളിൽ രജിസ്ട്രേഷൻ നിർബന്ധമാണ്. വൈകിയുള്ള രജിസ്ട്രേഷന് അധിക നടപടികൾ ആവശ്യമാണ്."
    },
    {
        id: "death_certificate",
        service: "Death Certificate",
        service_ml: "മരണ സർട്ടിഫിക്കറ്റ്",
        department: "Local Body (Panchayat / Municipality)",
        keywords: ["death", "certificate", "died", "deceased", "മരണം", "മരണ"],
        steps: [
            "Obtain Hospital Death Report / Medical Certificate of Cause of Death",
            "Visit local Panchayat / Municipality office within 21 days",
            "Submit death registration form with documents",
            "Pay registration fee",
            "Collect death certificate"
        ],
        steps_ml: [
            "ഹോസ്പിറ്റൽ മരണ റിപ്പോർട്ട് / മരണ കാരണ സർട്ടിഫിക്കറ്റ് ലഭ്യമാക്കുക",
            "21 ദിവസത്തിനുള്ളിൽ പഞ്ചായത്ത് / മുനിസിപ്പാലിറ്റി ഓഫീസിൽ പോകുക",
            "രേഖകൾ സഹിതം മരണ രജിസ്ട്രേഷൻ ഫോം സമർപ്പിക്കുക",
            "രജിസ്ട്രേഷൻ ഫീസ് അടയ്ക്കുക",
            "മരണ സർട്ടിഫിക്കറ്റ് ശേഖരിക്കുക"
        ],
        required_documents: ["Hospital Death Report / MCCD", "ID Proof of Deceased", "ID Proof of Informant", "Address Proof"],
        required_documents_ml: ["ഹോസ്പിറ്റൽ മരണ റിപ്പോർട്ട് / MCCD", "മരണപ്പെട്ടയാളുടെ ഐഡി", "അറിയിക്കുന്ന വ്യക്തിയുടെ ഐഡി", "വിലാസ തെളിവ്"],
        fee: "₹10",
        processing_time: "7 working days",
        processing_time_ml: "7 പ്രവൃത്തി ദിവസങ്ങൾ",
        validity: "Permanent",
        validity_ml: "സ്ഥിരം",
        best_visit_time: "10 AM – 12 PM weekdays",
        best_visit_time_ml: "രാവിലെ 10 – 12 പ്രവൃത്തി ദിവസങ്ങളിൽ",
        apply_at: "Local Panchayat / Municipality",
        apply_at_ml: "പഞ്ചായത്ത് / മുനിസിപ്പാലിറ്റി",
        akshaya_eligible: true,
        notes: "Must be registered within 21 days. Late registration requires Magistrate order.",
        notes_ml: "21 ദിവസത്തിനുള്ളിൽ രജിസ്റ്റർ ചെയ്യണം. വൈകിയ രജിസ്ട്രേഷന് മജിസ്ട്രേറ്റ് ഉത്തരവ് ആവശ്യമാണ്."
    },
    {
        id: "pension",
        service: "Old Age / Widow / Disability Pension",
        service_ml: "പെൻഷൻ (വാർദ്ധക്യ / വിധവ / വൈകല്യം)",
        department: "Social Justice Department",
        keywords: ["pension", "old age", "widow", "disability", "social", "welfare", "പെൻഷൻ", "വാർദ്ധക്യ", "വിധവ"],
        steps: [
            "Visit Panchayat / Municipality office or apply via Sevana portal",
            "Submit application with required documents",
            "Ward member / Secretary verifies eligibility",
            "Application forwarded to Social Justice Department",
            "Approval and pension disbursement begins"
        ],
        steps_ml: [
            "പഞ്ചായത്ത് / മുനിസിപ്പാലിറ്റി ഓഫീസിൽ പോകുക അല്ലെങ്കിൽ സേവന പോർട്ടലിൽ അപേക്ഷിക്കുക",
            "ആവശ്യമായ രേഖകളോടൊപ്പം അപേക്ഷ സമർപ്പിക്കുക",
            "വാർഡ് മെമ്പർ / സെക്രട്ടറി യോഗ്യത പരിശോധിക്കും",
            "അപേക്ഷ സാമൂഹ്യ നീതി വകുപ്പിലേക്ക് അയയ്ക്കും",
            "അംഗീകാരത്തിനു ശേഷം പെൻഷൻ വിതരണം ആരംഭിക്കും"
        ],
        required_documents: ["Aadhaar Card", "Age Proof / Birth Certificate", "Income Certificate", "Bank Account Details", "BPL Certificate (if applicable)", "Disability Certificate (for disability pension)", "Death Certificate of Husband (for widow pension)"],
        required_documents_ml: ["ആധാർ കാർഡ്", "പ്രായ തെളിവ് / ജനന സർട്ടിഫിക്കറ്റ്", "വരുമാന സർട്ടിഫിക്കറ്റ്", "ബാങ്ക് അക്കൗണ്ട് വിശദാംശങ്ങൾ", "BPL സർട്ടിഫിക്കറ്റ് (ബാധകമെങ്കിൽ)", "വൈകല്യ സർട്ടിഫിക്കറ്റ് (വൈകല്യ പെൻഷന്)", "ഭർത്താവിന്റെ മരണ സർട്ടിഫിക്കറ്റ് (വിധവ പെൻഷന്)"],
        fee: "Free",
        processing_time: "30–60 working days",
        processing_time_ml: "30–60 പ്രവൃത്തി ദിവസങ്ങൾ",
        validity: "Annual renewal",
        validity_ml: "വാർഷിക പുതുക്കൽ",
        best_visit_time: "10 AM – 11:30 AM weekdays",
        best_visit_time_ml: "രാവിലെ 10 – 11:30 പ്രവൃത്തി ദിവസങ്ങളിൽ",
        apply_at: "Panchayat / Municipality / Sevana Portal",
        apply_at_ml: "പഞ്ചായത്ത് / മുനിസിപ്പാലിറ്റി / സേവന പോർട്ടൽ",
        akshaya_eligible: true,
        notes: "Sevana portal: https://welfarepension.lsgkerala.gov.in",
        notes_ml: "സേവന പോർട്ടൽ: https://welfarepension.lsgkerala.gov.in"
    },
    {
        id: "ration_card",
        service: "Ration Card Update / New Application",
        service_ml: "റേഷൻ കാർഡ് (പുതിയത് / അപ്ഡേറ്റ്)",
        department: "Civil Supplies Department",
        keywords: ["ration", "ration card", "food", "supply", "bpl", "apl", "റേഷൻ"],
        steps: [
            "Visit Civil Supplies Office (Taluk Supply Office)",
            "Submit application form with documents",
            "Pay required fee",
            "Inspector verifies details (home visit may occur)",
            "Ration card issued / updated"
        ],
        steps_ml: [
            "സിവിൽ സപ്ലൈസ് ഓഫീസിൽ (താലൂക്ക് സപ്ലൈ ഓഫീസ്) പോകുക",
            "രേഖകൾ സഹിതം അപേക്ഷാ ഫോം സമർപ്പിക്കുക",
            "ആവശ്യമായ ഫീസ് അടയ്ക്കുക",
            "ഇൻസ്പെക്ടർ വിശദാംശങ്ങൾ പരിശോധിക്കും (വീട്ടിൽ സന്ദർശനം ഉണ്ടാകാം)",
            "റേഷൻ കാർഡ് ലഭിക്കും / അപ്ഡേറ്റ് ചെയ്യും"
        ],
        required_documents: ["Aadhaar Card (all members)", "Address Proof", "Income Certificate", "Previous Ration Card (for update)", "Birth Certificate (for adding members)", "Death Certificate (for removing members)"],
        required_documents_ml: ["ആധാർ കാർഡ് (എല്ലാ അംഗങ്ങളുടെയും)", "വിലാസ തെളിവ്", "വരുമാന സർട്ടിഫിക്കറ്റ്", "മുൻ റേഷൻ കാർഡ് (അപ്ഡേറ്റിന്)", "ജനന സർട്ടിഫിക്കറ്റ് (അംഗങ്ങളെ ചേർക്കാൻ)", "മരണ സർട്ടിഫിക്കറ്റ് (അംഗങ്ങളെ നീക്കാൻ)"],
        fee: "₹20–₹50",
        processing_time: "15–30 working days",
        processing_time_ml: "15–30 പ്രവൃത്തി ദിവസങ്ങൾ",
        validity: "Permanent (with updates)",
        validity_ml: "സ്ഥിരം (അപ്ഡേറ്റുകളോടെ)",
        best_visit_time: "10 AM – 12 PM weekdays",
        best_visit_time_ml: "രാവിലെ 10 – 12 പ്രവൃത്തി ദിവസങ്ങളിൽ",
        apply_at: "Taluk Supply Office / Civil Supplies",
        apply_at_ml: "താലൂക്ക് സപ്ലൈ ഓഫീസ് / സിവിൽ സപ്ലൈസ്",
        akshaya_eligible: true,
        notes: "Online application possible via civilsupplieskerala.gov.in",
        notes_ml: "civilsupplieskerala.gov.in വഴി ഓൺലൈൻ അപേക്ഷ സാധ്യമാണ്"
    },
    {
        id: "scholarship",
        service: "Kerala Government Scholarship",
        service_ml: "സ്കോളർഷിപ്പ്",
        department: "Welfare Department",
        keywords: ["scholarship", "student", "education", "study", "grant", "സ്കോളർഷിപ്പ്", "വിദ്യാഭ്യാസം"],
        steps: [
            "Check eligibility on the e-Grantz portal",
            "Register on e-Grantz (egrantz.kerala.gov.in)",
            "Fill application form with required details",
            "Upload documents and submit",
            "Application verified by institution and department",
            "Scholarship amount credited to bank account"
        ],
        steps_ml: [
            "e-Grantz പോർട്ടലിൽ യോഗ്യത പരിശോധിക്കുക",
            "e-Grantz-ൽ (egrantz.kerala.gov.in) രജിസ്റ്റർ ചെയ്യുക",
            "ആവശ്യമായ വിശദാംശങ്ങളോടെ അപേക്ഷാ ഫോം പൂരിപ്പിക്കുക",
            "രേഖകൾ അപ്‌ലോഡ് ചെയ്ത് സമർപ്പിക്കുക",
            "സ്ഥാപനവും വകുപ്പും അപേക്ഷ പരിശോധിക്കും",
            "സ്കോളർഷിപ്പ് തുക ബാങ്ക് അക്കൗണ്ടിൽ ക്രെഡിറ്റ് ചെയ്യും"
        ],
        required_documents: ["Aadhaar Card", "Income Certificate", "Caste Certificate (if applicable)", "Previous Year Mark Sheet", "Bank Account Details", "Institution verification letter"],
        required_documents_ml: ["ആധാർ കാർഡ്", "വരുമാന സർട്ടിഫിക്കറ്റ്", "ജാതി സർട്ടിഫിക്കറ്റ് (ബാധകമെങ്കിൽ)", "മുൻ വർഷ മാർക്ക് ഷീറ്റ്", "ബാങ്ക് അക്കൗണ്ട് വിശദാംശങ്ങൾ", "സ്ഥാപന പരിശോധന കത്ത്"],
        fee: "Free",
        processing_time: "30–90 days",
        processing_time_ml: "30–90 ദിവസങ്ങൾ",
        validity: "Academic year",
        validity_ml: "അക്കാദമിക് വർഷം",
        best_visit_time: "Apply online — 24/7",
        best_visit_time_ml: "ഓൺലൈനായി അപേക്ഷിക്കുക — 24/7",
        apply_at: "e-Grantz Portal (egrantz.kerala.gov.in)",
        apply_at_ml: "e-Grantz പോർട്ടൽ (egrantz.kerala.gov.in)",
        akshaya_eligible: true,
        notes: "Multiple scholarships available for SC/ST/OBC/Minority/General economically weak students",
        notes_ml: "SC/ST/OBC/ന്യൂനപക്ഷ/സാമ്പത്തികമായി ദുർബലരായ വിദ്യാർത്ഥികൾക്ക് നിരവധി സ്കോളർഷിപ്പുകൾ ലഭ്യമാണ്"
    },
    {
        id: "driving_licence_update",
        service: "Driving Licence Address Update",
        service_ml: "ഡ്രൈവിംഗ് ലൈസൻസ് വിലാസ മാറ്റം",
        department: "Motor Vehicles Department",
        keywords: ["driving", "licence", "license", "dl", "motor", "vehicle", "driving license", "ഡ്രൈവിംഗ്", "ലൈസൻസ്"],
        steps: [
            "Visit Parivahan portal or RTO office",
            "Submit Form 1 for address update",
            "Upload or submit address proof documents",
            "Pay ₹200 fee",
            "Updated DL delivered by post or collect at RTO"
        ],
        steps_ml: [
            "പരിവാഹൻ പോർട്ടൽ അല്ലെങ്കിൽ RTO ഓഫീസിൽ പോകുക",
            "വിലാസ മാറ്റത്തിനുള്ള ഫോം 1 സമർപ്പിക്കുക",
            "വിലാസ തെളിവ് രേഖകൾ അപ്‌ലോഡ് ചെയ്യുക അല്ലെങ്കിൽ സമർപ്പിക്കുക",
            "₹200 ഫീസ് അടയ്ക്കുക",
            "അപ്ഡേറ്റ് ചെയ്ത DL തപാൽ വഴി ലഭിക്കും അല്ലെങ്കിൽ RTO-ൽ നിന്ന് ശേഖരിക്കുക"
        ],
        required_documents: ["Current Driving Licence", "New Address Proof", "Aadhaar Card", "Passport-size Photo"],
        required_documents_ml: ["നിലവിലെ ഡ്രൈവിംഗ് ലൈസൻസ്", "പുതിയ വിലാസ തെളിവ്", "ആധാർ കാർഡ്", "പാസ്പോർട്ട് സൈസ് ഫോട്ടോ"],
        fee: "₹200",
        processing_time: "7–15 working days",
        processing_time_ml: "7–15 പ്രവൃത്തി ദിവസങ്ങൾ",
        validity: "As per original DL expiry",
        validity_ml: "യഥാർത്ഥ DL കാലാവധി പ്രകാരം",
        best_visit_time: "10 AM – 12 PM weekdays",
        best_visit_time_ml: "രാവിലെ 10 – 12 പ്രവൃത്തി ദിവസങ്ങളിൽ",
        apply_at: "Parivahan Portal / RTO Office",
        apply_at_ml: "പരിവാഹൻ പോർട്ടൽ / RTO ഓഫീസ്",
        akshaya_eligible: false,
        notes: "Online: parivahan.gov.in/parivahan",
        notes_ml: "ഓൺലൈൻ: parivahan.gov.in/parivahan"
    }
];

const GENERIC_KEYWORDS = new Set(["card", "certificate", "application", "apply", "service", "services", "new", "update"]);

function normalizeForMatch(text = "") {
    return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function escapeRegex(value = "") {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasWholeWord(text, word) {
    if (!word) return false;
    // \b word boundary doesn't work with non-Latin scripts (Malayalam, Hindi, etc.)
    if (/[^\x00-\x7F]/.test(word)) {
        return text.includes(word.toLowerCase());
    }
    const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, "i");
    return regex.test(text);
}

function scoreKeywordMatch(text, keyword) {
    const normalizedKeyword = normalizeForMatch(keyword);
    if (!normalizedKeyword) return 0;

    if (normalizedKeyword.includes(" ")) {
        return text.includes(normalizedKeyword) ? 6 : 0;
    }

    // Only skip generic keywords for English terms
    if (/^[a-z]+$/.test(normalizedKeyword) && GENERIC_KEYWORDS.has(normalizedKeyword)) {
        return 0;
    }

    return hasWholeWord(text, normalizedKeyword) ? 2 : 0;
}

function scoreServiceMatch(text, service = {}) {
    let score = 0;
    const serviceName = normalizeForMatch(service.service || "");
    const serviceNameMl = normalizeForMatch(service.service_ml || "");
    const keywords = Array.isArray(service.keywords) ? service.keywords : [];

    if (serviceName && text.includes(serviceName)) {
        score += 8;
    }
    // Also match Malayalam service name
    if (serviceNameMl && text.includes(serviceNameMl)) {
        score += 8;
    }

    for (const keyword of keywords) {
        score += scoreKeywordMatch(text, keyword);
    }

    return score;
}

export async function findService(message) {
    const text = normalizeForMatch(message);

    // Try Firestore first
    if (db) {
        try {
            const snapshot = await db.collection("services").get();
            let bestMatch = null;
            let bestScore = 0;

            for (const doc of snapshot.docs) {
                const data = doc.data();
                const candidate = { id: doc.id, ...data };
                const score = scoreServiceMatch(text, candidate);
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = candidate;
                }
            }

            if (bestMatch && bestScore > 0) {
                return bestMatch;
            }
        } catch (err) {
            console.error("Error finding service in Firestore:", err.message);
            console.log("Falling back to local service data...");
        }
    }

    // Fallback to local data
    let bestLocalMatch = null;
    let bestLocalScore = 0;
    for (const service of LOCAL_SERVICES) {
        const score = scoreServiceMatch(text, service);
        if (score > bestLocalScore) {
            bestLocalScore = score;
            bestLocalMatch = service;
        }
    }

    return bestLocalScore > 0 ? bestLocalMatch : null;
}

export function formatService(service, language = "en") {
    const ml = language === "ml";

    const serviceName = ml && service.service_ml ? service.service_ml : service.service;
    const applyAt = ml && service.apply_at_ml ? service.apply_at_ml : (service.apply_at || "N/A");
    const processingTime = ml && service.processing_time_ml ? service.processing_time_ml : (service.processing_time || "N/A");
    const validity = ml && service.validity_ml ? service.validity_ml : (service.validity || "N/A");
    const bestVisitTime = ml && service.best_visit_time_ml ? service.best_visit_time_ml : (service.best_visit_time || "10:00 AM - 11:30 AM");
    const notes = ml && service.notes_ml ? service.notes_ml : (service.notes || "N/A");

    const docs = ml && service.required_documents_ml ? service.required_documents_ml : (service.required_documents || []);
    const steps = ml && service.steps_ml ? service.steps_ml : (service.steps || []);

    const docsText = docs.map((doc) => `✅ ${doc}`).join("\n");

    const emojiNumbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
    const stepsText = steps.map((step, i) => `${emojiNumbers[i] || `${i + 1}.`} ${step}`).join("\n");

    let feeText = service.fee || (ml ? "വ്യത്യാസപ്പെടും" : "Varies");
    if (typeof service.fee === "object" && service.fee !== null) {
        feeText = Object.entries(service.fee)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");
    }

    // Labels based on language
    const labels = ml ? {
        applyAt: "അപേക്ഷിക്കേണ്ട സ്ഥലം",
        requiredDocs: "ആവശ്യമായ രേഖകൾ",
        steps: "ഘട്ടങ്ങൾ",
        fee: "ഫീസ്",
        processingTime: "പ്രോസസ്സിംഗ് സമയം",
        validity: "കാലാവധി",
        note: "കുറിപ്പ്",
        extras: "പൗര സഹായ അധിക വിവരങ്ങൾ",
        nearestAkshaya: "അടുത്തുള്ള അക്ഷയ കേന്ദ്രം",
        workingHours: "പ്രവൃത്തി സമയം",
        viewOnMap: "മാപ്പിൽ കാണുക",
        visitGuidance: "സന്ദർശന സമയ മാർഗ്ഗനിർദ്ദേശം",
        bestTime: "സന്ദർശിക്കാൻ ഏറ്റവും നല്ല സമയം",
        avoidTime: "ഉച്ചഭക്ഷണ സമയം ഒഴിവാക്കുക (1:00 PM - 2:00 PM)",
        followUps: "സ്മാർട്ട് ഫോളോ-അപ്പുകൾ",
        checkStatus: "e-District പോർട്ടലിൽ ഓൺലൈൻ സ്റ്റാറ്റസ് ട്രാക്കിംഗ് പരിശോധിക്കുക.",
        moreServices: "കൂടുതൽ സേവനങ്ങൾക്ക് https://edistrict.kerala.gov.in സന്ദർശിക്കുക.",
        contactOffice: "ഘട്ടങ്ങൾക്ക് ഓഫീസിൽ ബന്ധപ്പെടുക",
        noneSpecified: "ഒന്നും നിർണ്ണയിച്ചിട്ടില്ല"
    } : {
        applyAt: "Apply At",
        requiredDocs: "Required Documents",
        steps: "Steps",
        fee: "Fee",
        processingTime: "Processing Time",
        validity: "Validity",
        note: "Note",
        extras: "Citizen Assistance Extras",
        nearestAkshaya: "Nearest Akshaya Center",
        workingHours: "Working Hours",
        viewOnMap: "View on Map",
        visitGuidance: "Visit Time Guidance",
        bestTime: "Best time to visit",
        avoidTime: "Avoid 1:00 PM - 2:00 PM (Lunch break peak)",
        followUps: "Smart Follow-ups",
        checkStatus: "Check online status tracking on the e-District portal.",
        moreServices: "Visit https://edistrict.kerala.gov.in for more services.",
        contactOffice: "Contact office for steps",
        noneSpecified: "None specified"
    };

    return `
📄 **${serviceName}**

🏢 **${labels.applyAt}:** ${applyAt}

📑 **${labels.requiredDocs}:**
${docsText || labels.noneSpecified}

📝 **${labels.steps}:**
${stepsText || labels.contactOffice}

💰 **${labels.fee}:** ${feeText}
⏱️ **${labels.processingTime}:** ${processingTime}
⏳ **${labels.validity}:** ${validity}
💡 **${labels.note}:** ${notes}

---
⭐ **${labels.extras}** ⭐

📍 **${labels.nearestAkshaya}:**
  • Akshaya e-Kendra
  • ${labels.workingHours}: 9:30 AM - 5:00 PM
  • 🗺️ [${labels.viewOnMap}](https://maps.google.com/?q=Akshaya+Center+near+me)

⏰ **${labels.visitGuidance}:**
  • ${labels.bestTime}: ${bestVisitTime}
  • 🛑 ${labels.avoidTime}

🔗 **${labels.followUps}:**
  • ${labels.checkStatus}
  • ${labels.moreServices}
  `.trim();
}

export { LOCAL_SERVICES };
