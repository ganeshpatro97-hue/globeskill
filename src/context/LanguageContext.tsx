"use client";

/**
 * GlobeSkill Phase 6: Regional Language Support (बहुभाषी मंच)
 * Complete implementation for localising the GlobeSkill platform into
 * major regional Indian languages (Hindi, Tamil, Kannada, Marathi) along with English.
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';

// ==========================================
// 1. Core Types and Supported Languages
// ==========================================
export type LanguageCode = 'en' | 'hi' | 'ta' | 'kn' | 'mr';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', flag: '🇮🇳' },
];

// ==========================================
// 2. Multilingual Dictionaries (अनुवाद शब्दकोश)
// ==========================================
export const translations = {
  en: {
    brand: 'GlobeSkill',
    tagline: 'Technology & AI Education for Every Child',
    description: 'Providing accessible digital skilling, career enablement, and vocational learning to build a thriving, inclusive digital economy for underserved talent.',
    exploreBtn: 'Explore GlobeSkill',
    systemStatus: 'System Status',
    statusOnline: 'Platform Status: Online',
    statusLoading: 'Checking platform status...',
    statusError: 'Connection issue. Please retry.',
    roleStudent: 'Student',
    roleTrainer: 'Trainer',
    roleAdmin: 'Administrator',
    roleDonor: 'Donor',
    aiMentorTitle: 'AI Coding Mentor',
    aiMentorWelcome: "Hi there! I'm your GlobeSkill AI Coding Mentor. 🌟 Ask me any programming or AI question, and I'll explain it simply!",
    suggestedQuery1: 'What is an API?',
    suggestedQuery2: 'What is a Variable?',
    suggestedQuery3: 'Why use a Database?',
    placeholderChat: 'Ask Sparky any coding question...',
    sponsorshipImpact: '1 Student fully sponsored for the AI Micro Degree Program!',
    taxExemption80G: 'Sec 80G Tax Exemption Certificate Enabled',
    downloadReceipt: 'Download 80G Tax Receipt',
    courseCatalog: 'Technical Course Directory',
    verifiedCohorts: 'Verified UN SDG Programs',
    activeLearners: 'Active Learners',
    classTrack: 'Class Progression',
    coursesNav: 'Courses',
    supportUsNav: 'Support Us',
    apiStatusNav: 'API Status',
    loginBtn: 'Log In',
    signupBtn: 'Sign Up',
  },
  hi: {
    brand: 'ग्लोबस्किल (GlobeSkill)',
    tagline: 'हर बच्चे के लिए तकनीकी और एआई (AI) शिक्षा',
    description: 'वंचित बच्चों के लिए सुलभ डिजिटल कौशल, करियर सक्षमता और व्यावसायिक शिक्षा प्रदान करना ताकि एक समृद्ध और समावेशी डिजिटल अर्थव्यवस्था का निर्माण हो सके।',
    exploreBtn: 'ग्लोबस्किल का अन्वेषण करें',
    systemStatus: 'सिस्टम की स्थिति',
    statusOnline: 'प्लेटफ़ॉर्म स्थिति: ऑनलाइन',
    statusLoading: 'प्लेटफ़ॉर्म स्थिति की जाँच की जा रही है...',
    statusError: 'कनेक्शन की समस्या। कृपया पुनः प्रयास करें।',
    roleStudent: 'छात्र (Student)',
    roleTrainer: 'प्रशिक्षक (Trainer)',
    roleAdmin: 'प्रशासक (Admin)',
    roleDonor: 'दाता (Donor)',
    aiMentorTitle: 'एआई कोडिंग मेंटर',
    aiMentorWelcome: "नमस्ते! मैं आपका ग्लोबस्किल एआई कोडिंग मेंटर हूँ। 🌟 मुझसे कोई भी प्रोग्रामिंग या एआई का सवाल पूछें, और मैं उसे आसानी से समझाऊँगा!",
    suggestedQuery1: 'एपीआई (API) क्या है?',
    suggestedQuery2: 'वेरिएबल (Variable) क्या होता है?',
    suggestedQuery3: 'डेटाबेस (Database) की क्या जरूरत है?',
    placeholderChat: 'अपना कोडिंग प्रश्न यहाँ पूछें...',
    sponsorshipImpact: 'एआई माइक्रो डिग्री प्रोग्राम के लिए 1 छात्र को पूरी तरह से प्रायोजित किया गया है!',
    taxExemption80G: 'धारा 80G कर छूट प्रमाणपत्र सक्रिय',
    downloadReceipt: '80G टैक्स रसीद डाउनलोड करें',
    courseCatalog: 'तकनीकी पाठ्यक्रम निर्देशिका',
    verifiedCohorts: 'सत्यापित यूएन एसडीजी (UN SDG) कार्यक्रम',
    activeLearners: 'सक्रिय छात्र',
    classTrack: 'कक्षा की प्रगति',
    coursesNav: 'पाठ्यक्रम (Courses)',
    supportUsNav: 'सहयोग करें (Donate)',
    apiStatusNav: 'एपीआई स्थिति',
    loginBtn: 'लॉग इन',
    signupBtn: 'साइन अप',
  },
  ta: {
    brand: 'குளோப்ஸ்கில் (GlobeSkill)',
    tagline: 'ஒவ்வொரு குழந்தைக்கும் தொழில்நுட்பம் மற்றும் AI கல்வி',
    description: 'பின்தங்கிய மாணவர்களுக்கு எளிதான டிஜிட்டல் திறன், தொழில் வாய்ப்புகள் மற்றும் தொழிற்கல்வி அளித்து, அனைவரையும் உள்ளடக்கிய டிஜிட்டல் பொருளாதாரத்தை உருவாக்குதல்.',
    exploreBtn: 'குளோப்ஸ்கில் ஆராயுங்கள்',
    systemStatus: 'கணினி நிலை',
    statusOnline: 'இயங்குதள நிலை: ஆன்லைன்',
    statusLoading: 'இயங்குதள நிலை சரிபார்க்கப்படுகிறது...',
    statusError: 'இணைப்பு பிரச்சனை. மீண்டும் முயற்சிக்கவும்.',
    roleStudent: 'மாணவர்',
    roleTrainer: 'பயிற்சியாளர்',
    roleAdmin: 'நிர்வாகி',
    roleDonor: 'நன்கொடையாளர்',
    aiMentorTitle: 'AI கோடிங் வழிகாட்டி',
    aiMentorWelcome: "வணக்கம்! நான் உங்கள் குளோப்ஸ்கில் AI கோடிங் வழிகாட்டி. 🌟 எந்தவொரு புரோகிராமிங் அல்லது AI கேள்வியையும் கேளுங்கள், நான் எளிமையாக விளக்குகிறேன்!",
    suggestedQuery1: 'API என்றால் என்ன?',
    suggestedQuery2: 'Variable என்றால் என்ன?',
    suggestedQuery3: 'Database ஏன் பயன்படுத்த வேண்டும்?',
    placeholderChat: 'உங்கள் கோடிங் கேள்வியை இங்கே தட்டச்சு செய்யவும்...',
    sponsorshipImpact: 'AI மைக்ரோ டிகிரி திட்டத்திற்கு 1 மாணவர் முழுமையாக ஸ்பான்சர் செய்யப்பட்டுள்ளார்!',
    taxExemption80G: 'பிரிவு 80G வரி விலக்கு சான்றிதழ் செயல்படுத்தப்பட்டது',
    downloadReceipt: '80G வரி ரசீதை பதிவிறக்கவும்',
    courseCatalog: 'தொழில்நுட்ப பாடநெறி அடைவு',
    verifiedCohorts: 'சரிபார்க்கப்பட்ட UN SDG திட்டங்கள்',
    activeLearners: 'செயலில் உள்ள மாணவர்கள்',
    classTrack: 'வகுப்பு முன்னேற்றம்',
    coursesNav: 'பாடங்கள்',
    supportUsNav: 'ஆதரவு அளியுங்கள்',
    apiStatusNav: 'API நிலை',
    loginBtn: 'உள்நுழைய',
    signupBtn: 'பதிவு செய்க',
  },
  kn: {
    brand: 'ಗ್ಲೋಬ್‌ಸ್ಕಿಲ್ (GlobeSkill)',
    tagline: 'ಪ್ರತಿಯೊಂದು ಮಗುವಿಗೂ ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಎಐ (AI) ಶಿಕ್ಷಣ',
    description: 'ವಂಚಿತ ಮಕ್ಕಳಿಗೆ ಸುಲಭ ಡಿಜಿಟಲ್ ಕೌಶಲ್ಯ, ವೃತ್ತಿಪರ ತರಬೇತಿ ಮತ್ತು ಉದ್ಯೋಗಾವಕಾಶ ಒದಗಿಸುವ ಮೂಲಕ ಅಂತರ್ಗತ ಡಿಜಿಟಲ್ ಆರ್ಥಿಕತೆಯನ್ನು ನಿರ್ಮಿಸುವುದು.',
    exploreBtn: 'ಗ್ಲೋಬ್‌ಸ್ಕಿಲ್ ಅನ್ವೇಷಿಸಿ',
    systemStatus: 'ಸಿಸ್ಟಮ್ ಸ್ಥಿತಿ',
    statusOnline: 'ವೇದಿಕೆಯ ಸ್ಥಿತಿ: ಆನ್‌ಲೈನ್',
    statusLoading: 'ವೇದಿಕೆಯ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    statusError: 'ಸಂಪರ್ಕದ ತೊಂದರೆ. ದಯವಿಟ್ಟು ಮರುಪ್ರಯತ್ನಿಸಿ.',
    roleStudent: 'ವಿದ್ಯಾರ್ಥಿ',
    roleTrainer: 'ತರಬೇತುದಾರ',
    roleAdmin: 'ಆಡಳಿತಾಧಿಕಾರಿ',
    roleDonor: 'ದಾನಿ',
    aiMentorTitle: 'ಎಐ ಕೋಡಿಂಗ್ ಮಾರ್ಗದರ್ಶಕ',
    aiMentorWelcome: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಗ್ಲೋಬ್‌ಸ್ಕಿಲ್ ಎಐ ಕೋಡಿಂಗ್ ಮಾರ್ಗದರ್ಶಕ. 🌟 ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಅಥವಾ ಎಐಗೆ ಸಂಬಂಧಿಸಿದ ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ, ನಾನು ಸರಳವಾಗಿ ವಿವರಿಸುತ್ತೇನೆ!",
    suggestedQuery1: 'API ಎಂದರೇನು?',
    suggestedQuery2: 'Variable ಎಂದರೇನು?',
    suggestedQuery3: 'Database ಏಕಾಗಿ ಬೇಕು?',
    placeholderChat: 'ನಿಮ್ಮ ಕೋಡಿಂಗ್ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...',
    sponsorshipImpact: 'ಎಐ ಮೈಕ್ರೋ ಡಿಗ್ರಿ ಕಾರ್ಯಕ್ರಮಕ್ಕಾಗಿ 1 ವಿದ್ಯಾರ್ಥಿಗೆ ಸಂಪೂರ್ಣ ಪ್ರಾಯೋಜಕತ್ವ ನೀಡಲಾಗಿದೆ!',
    taxExemption80G: 'ಸೆಕ್ಷನ್ 80G ತೆರಿಗೆ ವಿನಾಯಿತಿ ಪ್ರಮಾಣಪತ್ರ ಸಕ್ರಿಯವಾಗಿದೆ',
    downloadReceipt: '80G ತೆರಿಗೆ ರಶೀದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    courseCatalog: 'ತಾಂತ್ರಿಕ ಕೋರ್ಸ್ ಡೈರೆಕ್ಟರಿ',
    verifiedCohorts: 'ಯುಎನ್ ಎಸ್‌ಡಿಜಿ (UN SDG) ಕಾರ್ಯಕ್ರಮಗಳು',
    activeLearners: 'ಸಕ್ರಿಯ ವಿದ್ಯಾರ್ಥಿಗಳು',
    classTrack: 'ತರಗತಿಯ ಪ್ರಗತಿ',
    coursesNav: 'ಕೋರ್ಸ್‌ಗಳು',
    supportUsNav: 'ಬೆಂಬಲಿಸಿ',
    apiStatusNav: 'API ಸ್ಥಿತಿ',
    loginBtn: 'ಲಾಗಿನ್',
    signupBtn: 'ಸೈನ್ ಅಪ್',
  },
  mr: {
    brand: 'ग्लोबस्किल (GlobeSkill)',
    tagline: 'प्रत्येक मुलासाठी तंत्रज्ञान आणि एआय (AI) शिक्षण',
    description: 'वंचित मुलांसाठी सुलभ डिजिटल कौशल्ये, करिअर सक्षमता आणि व्यावसायिक शिक्षण देणे जेणेकरून एक समृद्ध आणि सर्वसमावेशक डिजिटल अर्थव्यवस्था निर्माण होईल.',
    exploreBtn: 'ग्लोबस्किलचा शोध घ्या',
    systemStatus: 'सिस्टमची स्थिती',
    statusOnline: 'प्लॅटफॉर्म स्थिती: ऑनलाइन',
    statusLoading: 'प्लॅटफॉर्म स्थिती तपासत आहे...',
    statusError: 'कनेक्शनची समस्या. कृपया पुन्हा प्रयत्न करा.',
    roleStudent: 'विद्यार्थी',
    roleTrainer: 'प्रशिक्षक',
    roleAdmin: 'प्रशासक',
    roleDonor: 'देणगीदार',
    aiMentorTitle: 'एआय कोडिंग मेंटर',
    aiMentorWelcome: "नमस्कार! मी तुमचा ग्लोबस्किल एआय कोडिंग मेंटर आहे. 🌟 मला कोणताही प्रोग्रामिंग किंवा एआय प्रश्न विचारा, मी तो सोप्या भाषेत समजावून सांगेन!",
    suggestedQuery1: 'एपीआय (API) म्हणजे काय?',
    suggestedQuery2: 'व्हेरिएबल (Variable) म्हणजे काय?',
    suggestedQuery3: 'डेटाबेस (Database) ची काय गरज आहे?',
    placeholderChat: 'तुमचा कोडिंग प्रश्न इथे टाईप करा...',
    sponsorshipImpact: 'एआय मायक्रो डिग्री प्रोग्रामसाठी १ विद्यार्थ्याला पूर्णपणे प्रायोजित केले गेले आहे!',
    taxExemption80G: 'कलम 80G कर सवलत प्रमाणपत्र सक्रिय',
    downloadReceipt: '80G कर पावती डाउनलोड करा',
    courseCatalog: 'तांत्रिक अभ्यासक्रम निर्देशिका',
    verifiedCohorts: 'सत्यापित यूएन एसडीजी (UN SDG) कार्यक्रम',
    activeLearners: 'सक्रिय विद्यार्थी',
    classTrack: 'वर्गाची प्रगती',
    coursesNav: 'अभ्यासक्रम',
    supportUsNav: 'सहकार्य करा',
    apiStatusNav: 'API स्थिती',
    loginBtn: 'लॉगिन',
    signupBtn: 'साइन अप',
  }
};

// ==========================================
// 3. React i18n Translation Provider
// ==========================================
interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  // Load saved preference from localStorage if in browser environment
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('globeskill_lang') as LanguageCode;
      if (savedLang && translations[savedLang]) {
        setLanguageState(savedLang);
      }
    } catch {
      // Fallback to default
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    if (translations[lang]) {
      setLanguageState(lang);
      try {
        localStorage.setItem('globeskill_lang', lang);
      } catch {
        // Safe fallback
      }
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url.toString());
      }
    }
  };

  const t = (key: keyof typeof translations['en']): string => {
    return translations[language]?.[key] || translations['en']?.[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

// ==========================================
// 4. Language Switcher Component UI
// ==========================================
export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="inline-flex justify-center items-center gap-1.5 rounded-lg border border-slate-200 shadow-2xs px-2.5 py-1.5 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
        title="Change Language / भाषा बदलें"
      >
        <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span className="font-medium text-slate-800">{currentLang.nativeLabel}</span>
        <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
      </button>

      {isDropdownOpen && (
        <div className="origin-top-right absolute right-0 mt-1.5 w-44 rounded-xl shadow-xl bg-white ring-1 ring-slate-200 border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/80 border-b border-slate-100">
              Select Language
            </div>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsDropdownOpen(false);
                }}
                className={`flex items-center justify-between w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer ${
                  language === lang.code ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
                role="menuitem"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{lang.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 leading-tight">{lang.nativeLabel}</span>
                    <span className="text-[10px] text-slate-400 font-normal leading-tight">{lang.label}</span>
                  </div>
                </div>
                {language === lang.code && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. Upgrade Prompt Logic for AI Chatbot System Instructions
// ==========================================
export function getLocalizedSystemPrompt(lang: LanguageCode): string {
  const nativeNames = {
    en: 'English',
    hi: 'Hindi (हिन्दी / Hinglish)',
    ta: 'Tamil (தமிழ்)',
    kn: 'Kannada (ಕನ್ನಡ)',
    mr: 'Marathi (मराठी)'
  };

  return `
Role: You are 'Sparky', the GlobeSkill AI Coding Mentor, an encouraging, patient, and friendly technical mentor helping young learners from underserved communities learn programming, AI, and digital skills.
Target Language: You MUST formulate your entire response in the following language: ${nativeNames[lang] || 'English'}.

CRITICAL MULTILINGUAL INSTRUCTIONS:
1. Reply entirely in ${nativeNames[lang]}. If the language is Hindi, use simple, friendly Conversational Hindi (Hinglish/Devanagari text) that an 8-14-year-old child can easily read and understand.
2. Keep technical words like "Variable", "API", "Database", "Loop", "Server", "CSS", "Frontend", "Function" in English characters or written phonetic format (e.g., "वेरिएबल" in Hindi), but explain their meanings with simple analogies.
3. Do NOT translate technical syntax (e.g., do not translate \`let x = 10;\` or code snippets). Keep code syntax written exactly in standard English programming format.
4. Provide comforting, patient affirmations in the student's chosen regional language. Keep your tone highly encouraging, using friendly emojis!
5. Kid-Friendly Analogy Reference:
   - Variables = labelled toy boxes or storage bins where you keep your favourite toys.
   - Loops = a merry-go-round or repeating your morning brushing routine.
   - Functions = magic recipe cards where you put in ingredients and get a delicious treat.
   - If/Else = choosing between eating an ice cream or wearing a raincoat when it pours.
   - Neural Networks / AI = a brain made of lightbulbs that learn to recognize patterns after seeing lots of pictures.
`;
}
