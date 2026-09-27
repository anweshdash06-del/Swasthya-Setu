// -----------------------------------------------------------------------
// Central translation dictionary — English / Hindi / Odia
// Used across the Patient Portal + shared navigation UI.
// -----------------------------------------------------------------------
export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', speechLocale: 'en-IN' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', speechLocale: 'hi-IN' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ', speechLocale: 'or-IN' },
];

const dict = {
  en: {
    appName: 'SwasthyaSetu',
    tagline: 'AI-assisted triage, not AI diagnosis',
    home: 'Home', about: 'About', privacy: 'Privacy', logout: 'Logout',
    patientPortal: 'Patient Portal', workerPortal: 'Healthcare Worker',
    heroTitle: 'Faster, fairer first-contact care',
    heroSubtitle: 'A human-in-the-loop triage assistant that helps patients describe symptoms in their own language and helps healthcare workers prioritize care — safely, transparently, and without ever making a diagnosis.',
    getStarted: 'Get Started', startEntry: 'Start New Symptom Entry',
    selectLanguage: 'Select your language',
    typeSymptoms: 'Type your symptoms here… e.g. "I have had fever and cough for 3 days"',
    speak: 'Speak', listening: 'Listening…',
    editText: 'Edit text', next: 'Next',
    uploadReport: 'Upload medical report (optional)',
    dragDropReport: 'Drag & drop a report image, or click to choose a file',
    processingOcr: 'Reading report with OCR…',
    skipToReview: 'Skip & review',
    reviewTitle: 'Review your AI-organized summary',
    reviewHelp: 'This is only an organized summary for the healthcare worker — not a diagnosis. Please check it is accurate before sending.',
    confirmSubmit: 'Confirm & Send to Healthcare Worker',
    submitted: 'Sent! A healthcare worker will review your case shortly.',
    viewTimeline: 'View my symptom timeline',
    fullName: 'Full name', age: 'Age', gender: 'Gender', phone: 'Phone number', facility: 'Nearest facility',
    male: 'Male', female: 'Female', other: 'Other',
    disclaimerShort: 'AI-assisted triage only. This tool does not diagnose, prescribe, or replace a qualified clinician — every case is reviewed by a human healthcare worker.',
  },
  hi: {
    appName: 'स्वास्थ्य सेतु एआई ट्राइएज',
    tagline: 'एआई-सहायता प्राप्त ट्राइएज, एआई निदान नहीं',
    home: 'होम', about: 'परिचय', privacy: 'गोपनीयता', logout: 'लॉगआउट',
    patientPortal: 'मरीज़ पोर्टल', workerPortal: 'स्वास्थ्यकर्मी',
    heroTitle: 'तेज़ और निष्पक्ष प्रारंभिक देखभाल',
    heroSubtitle: 'एक मानव-पर्यवेक्षित ट्राइएज सहायक जो मरीजों को अपनी भाषा में लक्षण बताने में और स्वास्थ्यकर्मियों को सुरक्षित रूप से प्राथमिकता तय करने में मदद करता है — यह कभी भी निदान नहीं करता।',
    getStarted: 'शुरू करें', startEntry: 'नई लक्षण प्रविष्टि शुरू करें',
    selectLanguage: 'अपनी भाषा चुनें',
    typeSymptoms: 'यहाँ अपने लक्षण लिखें… जैसे "मुझे 3 दिनों से बुखार और खांसी है"',
    speak: 'बोलें', listening: 'सुन रहा है…',
    editText: 'टेक्स्ट संपादित करें', next: 'आगे',
    uploadReport: 'मेडिकल रिपोर्ट अपलोड करें (वैकल्पिक)',
    dragDropReport: 'रिपोर्ट की छवि यहाँ खींचें, या फ़ाइल चुनने के लिए क्लिक करें',
    processingOcr: 'OCR से रिपोर्ट पढ़ी जा रही है…',
    skipToReview: 'छोड़ें और समीक्षा करें',
    reviewTitle: 'अपने एआई-संगठित सारांश की समीक्षा करें',
    reviewHelp: 'यह केवल स्वास्थ्यकर्मी के लिए एक संगठित सारांश है — यह निदान नहीं है। भेजने से पहले कृपया इसकी सटीकता जांचें।',
    confirmSubmit: 'पुष्टि करें और स्वास्थ्यकर्मी को भेजें',
    submitted: 'भेज दिया गया! एक स्वास्थ्यकर्मी जल्द ही आपके मामले की समीक्षा करेगा।',
    viewTimeline: 'मेरी लक्षण समयरेखा देखें',
    fullName: 'पूरा नाम', age: 'उम्र', gender: 'लिंग', phone: 'फ़ोन नंबर', facility: 'निकटतम केंद्र',
    male: 'पुरुष', female: 'महिला', other: 'अन्य',
    disclaimerShort: 'यह उपकरण केवल एआई-सहायता प्राप्त ट्राइएज करता है। यह निदान, दवा सुझाव नहीं देता और योग्य चिकित्सक का विकल्प नहीं है — हर मामले की समीक्षा एक स्वास्थ्यकर्मी करता है।',
  },
  or: {
    appName: 'ସ୍ୱାସ୍ଥ୍ୟ ସେତୁ AI ଟ୍ରାଏଜ୍',
    tagline: 'AI-ସହାୟତା ପ୍ରାପ୍ତ ଟ୍ରାଏଜ୍, AI ନିଦାନ ନୁହେଁ',
    home: 'ମୂଳପୃଷ୍ଠା', about: 'ବିବରଣୀ', privacy: 'ଗୋପନୀୟତା', logout: 'ଲଗଆଉଟ୍',
    patientPortal: 'ରୋଗୀ ପୋର୍ଟାଲ', workerPortal: 'ସ୍ୱାସ୍ଥ୍ୟକର୍ମୀ',
    heroTitle: 'ଦ୍ରୁତ ଏବଂ ନିଷ୍ପକ୍ଷ ପ୍ରାଥମିକ ଯତ୍ନ',
    heroSubtitle: 'ଏକ ମାନବ-ତତ୍ତ୍ୱାବଧାନ ଟ୍ରାଏଜ୍ ସହାୟକ ଯାହା ରୋଗୀମାନଙ୍କୁ ନିଜ ଭାଷାରେ ଲକ୍ଷଣ ବର୍ଣ୍ଣନା କରିବାରେ ଏବଂ ସ୍ୱାସ୍ଥ୍ୟକର୍ମୀଙ୍କୁ ସୁରକ୍ଷିତ ଭାବରେ ପ୍ରାଥମିକତା ଦେବାରେ ସାହାଯ୍ୟ କରେ — ଏହା କେବେ ବି ନିଦାନ କରେ ନାହିଁ।',
    getStarted: 'ଆରମ୍ଭ କରନ୍ତୁ', startEntry: 'ନୂଆ ଲକ୍ଷଣ ପ୍ରବେଶ ଆରମ୍ଭ କରନ୍ତୁ',
    selectLanguage: 'ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ',
    typeSymptoms: 'ଏଠାରେ ଆପଣଙ୍କ ଲକ୍ଷଣ ଲେଖନ୍ତୁ…',
    speak: 'କୁହନ୍ତୁ', listening: 'ଶୁଣୁଛି…',
    editText: 'ଟେକ୍ସଟ୍ ସମ୍ପାଦନ କରନ୍ତୁ', next: 'ପରବର୍ତ୍ତୀ',
    uploadReport: 'ମେଡିକାଲ ରିପୋର୍ଟ ଅପଲୋଡ୍ କରନ୍ତୁ (ଇଚ୍ଛାଧୀନ)',
    dragDropReport: 'ରିପୋର୍ଟ ପ୍ରତିଛବି ଏଠାରେ ଛାଡ଼ନ୍ତୁ, କିମ୍ବା ଫାଇଲ୍ ବାଛିବାକୁ କ୍ଲିକ୍ କରନ୍ତୁ',
    processingOcr: 'OCR ସାହାଯ୍ୟରେ ରିପୋର୍ଟ ପଢ଼ାଯାଉଛି…',
    skipToReview: 'ଛାଡ଼ନ୍ତୁ ଏବଂ ସମୀକ୍ଷା କରନ୍ତୁ',
    reviewTitle: 'ଆପଣଙ୍କ AI-ସଂଗଠିତ ସାରାଂଶ ସମୀକ୍ଷା କରନ୍ତୁ',
    reviewHelp: 'ଏହା ସ୍ୱାସ୍ଥ୍ୟକର୍ମୀଙ୍କ ପାଇଁ କେବଳ ଏକ ସଂଗଠିତ ସାରାଂଶ — ଏହା ନିଦାନ ନୁହେଁ। ପଠାଇବା ପୂର୍ବରୁ ଦୟାକରି ଏହାର ସଠିକତା ଯାଞ୍ଚ କରନ୍ତୁ।',
    confirmSubmit: 'ନିଶ୍ଚିତ କରନ୍ତୁ ଏବଂ ସ୍ୱାସ୍ଥ୍ୟକର୍ମୀଙ୍କୁ ପଠାନ୍ତୁ',
    submitted: 'ପଠାଗଲା! ଜଣେ ସ୍ୱାସ୍ଥ୍ୟକର୍ମୀ ଶୀଘ୍ର ଆପଣଙ୍କ ମାମଲା ସମୀକ୍ଷା କରିବେ।',
    viewTimeline: 'ମୋର ଲକ୍ଷଣ ସମୟରେଖା ଦେଖନ୍ତୁ',
    fullName: 'ପୂରା ନାମ', age: 'ବୟସ', gender: 'ଲିଙ୍ଗ', phone: 'ଫୋନ୍ ନମ୍ବର', facility: 'ନିକଟତମ କେନ୍ଦ୍ର',
    male: 'ପୁରୁଷ', female: 'ମହିଳା', other: 'ଅନ୍ୟ',
    disclaimerShort: 'ଏହି ଉପକରଣ କେବଳ AI-ସହାୟତା ପ୍ରାପ୍ତ ଟ୍ରାଏଜ୍ କରେ। ଏହା ନିଦାନ କରେ ନାହିଁ କିମ୍ବା ଯୋଗ୍ୟ ଡାକ୍ତରଙ୍କ ବିକଳ୍ପ ନୁହେଁ — ପ୍ରତ୍ୟେକ ମାମଲା ଜଣେ ସ୍ୱାସ୍ଥ୍ୟକର୍ମୀଙ୍କ ଦ୍ୱାରା ସମୀକ୍ଷା ହୁଏ।',
  },
};

export function t(lang, key) {
  return (dict[lang] && dict[lang][key]) || dict.en[key] || key;
}

export default dict;
