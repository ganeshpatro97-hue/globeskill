"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Sparkles, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';
import VoiceNarrator from '@/components/VoiceNarrator';

interface Challenge {
  id: string;
  level: number;
  title: {
    en: string; hi: string; ta: string; kn: string; mr: string;
  };
  description: {
    en: string; hi: string; ta: string; kn: string; mr: string;
  };
  instructions: {
    en: string; hi: string; ta: string; kn: string; mr: string;
  };
  initialCode: string;
  validationRegex: RegExp;
  expectedKeyword: string;
  analogy: {
    en: string; hi: string; ta: string; kn: string; mr: string;
  };
}

const CODING_CHALLENGES: Challenge[] = [
  {
    id: 'challenge-1',
    level: 1,
    title: {
      en: 'Level 1: The Magic Toy Box (Variables)',
      hi: 'स्तर 1: जादुई खिलौने का डिब्बा (Variables)',
      ta: 'நிலை 1: மந்திர பொம்மை பெட்டி (Variables)',
      kn: 'ಮಟ್ಟ 1: ಮ್ಯಾಜಿಕ್ ಆಟದ ಪೆಟ್ಟಿಗೆ (Variables)',
      mr: 'स्तर 1: जादूचा खेळण्यांचा डबा (Variables)'
    },
    description: {
      en: 'Learn how to create a variable to store a secret number.',
      hi: 'एक गुप्त संख्या (secret number) को संग्रहीत करने के लिए वेरिएबल बनाना सीखें।',
      ta: 'ரகசிய எண்ணைச் சேமிக்க ஒரு வேரியபிள் உருவாக்கக் கற்றுக்கொள்ளுங்கள்.',
      kn: 'ರಹಸ್ಯ ಸಂಖ್ಯೆಯನ್ನು ಸಂಗ್ರಹಿಸಲು ವೇರಿಯಬಲ್ ಮಾಡುವುದನ್ನು ಕಲಿಯಿರಿ.',
      mr: 'गुप्त संख्या साठवण्यासाठी व्हेरिएबल बनवायला शिका.'
    },
    instructions: {
      en: 'Declare a variable named "toyBox" and set its value to 10.',
      hi: '"toyBox" नाम का एक वेरिएबल बनाएं और उसका मान 10 सेट करें।',
      ta: '"toyBox" என்ற பெயரில் ஒரு வேரியபிள் உருவாக்கி, அதன் மதிப்பை 10 ஆக அமைக்கவும்.',
      kn: '"toyBox" ಹೆಸರಿನ ವೇರಿಯಬಲ್ ರಚಿಸಿ ಮತ್ತು ಅದರ ಮೌಲ್ಯವನ್ನು 10 ಕ್ಕೆ ಹೊಂದಿಸಿ.',
      mr: '"toyBox" नावाचे व्हेरिएबल तयार करा आणि त्याची किंमत 10 सेट करा.'
    },
    initialCode: '// Write your code below!\nlet toyBox = ',
    validationRegex: /let\s+toyBox\s*=\s*10\s*;?/i,
    expectedKeyword: 'let toyBox = 10',
    analogy: {
      en: 'A variable is like a toy box. You label the box ("toyBox") and put a toy inside (the number 10) so the computer remembers it!',
      hi: 'एक वेरिएबल खिलौने के डिब्बे जैसा होता है। आप डिब्बे पर एक लेबल लगाते हैं ("toyBox") और उसके अंदर एक खिलौना (संख्या 10) रखते हैं ताकि कंप्यूटर उसे याद रखे!',
      ta: 'வேரியபிள் என்பது பொம்மை பெட்டி போன்றது. பெட்டிக்கு லேபிள் ("toyBox") ஒட்டி, உள்ளே பொம்மை (எண் 10) வைத்தால், கணினி அதை நினைவில் கொள்ளும்!',
      kn: 'ವೇರಿಯಬಲ್ ಆಟದ ಪೆಟ್ಟಿಗೆಯಿದ್ದಂತೆ. ನೀವು ಪೆಟ್ಟಿಗೆಗೆ ಹೆಸರಿಟ್ಟು ("toyBox") ಒಳಗೆ ಆಟದ ಸಾಮಾನು (ಸಂಖ್ಯೆ 10) ಇಟ್ಟರೆ ಕಂಪ್ಯೂಟರ್ ಅದನ್ನು ನೆನಪಿಟ್ಟುಕೊಳ್ಳುತ್ತದೆ!',
      mr: 'व्हेरिएबल हे खेळण्याच्या डब्यासारखे आहे. तुम्ही डब्याला लेबल लावता ("toyBox") आणि आत खेळणे (संख्या 10) ठेवता जेणेकरून कॉम्प्युटर ते लक्षात ठेवेल!'
    }
  },
  {
    id: 'challenge-2',
    level: 2,
    title: {
      en: 'Level 2: The Infinite Carousel (Loops)',
      hi: 'स्तर 2: जादुई झूला (Loops)',
      ta: 'நிலை 2: சுழலும் ராட்டினம் (Loops)',
      kn: 'ಮಟ್ಟ 2: ಮ್ಯಾಜಿಕ್ ರೋಟರಿ (Loops)',
      mr: 'स्तर 2: फिरणारा पाळणा (Loops)'
    },
    description: {
      en: 'Learn how to make the computer repeat actions automatically using loops.',
      hi: 'लूप्स का उपयोग करके कंप्यूटर से बार-बार एक ही काम स्वचालित रूप से करवाना सीखें।',
      ta: 'லூப்களைப் பயன்படுத்தி கணினியை தானாகவே வேலைகளை மீண்டும் செய்ய வைக்கக் கற்றுக்கொள்ளுங்கள்.',
      kn: 'ಲೂಪ್‌ಗಳನ್ನು ಬಳಸಿ ಕಂಪ್ಯೂಟರ್ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಕೆಲಸವನ್ನು ಪುನರಾವರ್ತಿಸುವಂತೆ ಮಾಡಿ.',
      mr: 'लूप्सचा वापर करून कॉम्प्युटरला पुन्हा पुन्हा तेच काम करायला सांगा.'
    },
    instructions: {
      en: 'Create a "for" loop that runs 5 times to spin the carousel.',
      hi: 'एक "for" लूप बनाएं जो झूले को 5 बार घुमाने के लिए 5 बार चले।',
      ta: 'ராட்டினத்தை 5 முறை சுற்ற வைக்க, 5 முறை இயங்கும் ஒரு "for" லூப் உருவாக்கவும்.',
      kn: 'ರೋಟರಿಯನ್ನು 5 ಬಾರಿ ತಿರುಗಿಸಲು 5 ಬಾರಿ ರನ್ ಆಗುವ "for" ಲೂಪ್ ರಚಿಸಿ.',
      mr: 'पाळणा ५ वेळा फिरवण्यासाठी एक "for" लूप तयार करा जो ५ वेळा चालेल.'
    },
    initialCode: 'for (let count = 0; count < 5; count++) {\n  console.log("Carousel Spin!");\n}',
    validationRegex: /for\s*\(\s*let\s+\w+\s*=\s*0\s*;\s*\w+\s*<\s*5\s*;\s*\w+\s*\+\+\s*\)/i,
    expectedKeyword: 'for (let count = 0; count < 5; count++)',
    analogy: {
      en: 'A loop is like a bicycle wheel spinning or a musical carousel. Instead of writing code 5 times, a loop tells the computer to repeat it 5 times in a circle!',
      hi: 'एक लूप साइकिल के पहिये या झूले के चक्कर लगाने जैसा है। 5 बार अलग से कोड लिखने के बजाय, लूप कंप्यूटर को एक सर्कल में काम को 5 बार दोहराने के लिए कहता है!',
      ta: 'லூப் என்பது சைக்கிள் சக்கரம் சுற்றுவது போன்றது. 5 முறை தனித்தனியாக கோடிங் எழுதுவதற்குப் பதிலாக, லூப் அதை 5 முறை சுழற்சியில் செய்யச் சொல்கிறது!',
      kn: 'ಲೂಪ್ ಸೈಕಲ್ ಚಕ್ರದಂತೆ. 5 ಬಾರಿ ಪ್ರತ್ಯೇಕವಾಗಿ ಕೋಡ್ ಬರೆಯುವ ಬದಲು, ಒಂದು ಲೂಪ್ ಕಂಪ್ಯೂಟರ್‌ಗೆ ಆ ಕೆಲಸವನ್ನು 5 ಬಾರಿ ಮಾಡಲು ಆದೇಶಿಸುತ್ತದೆ!',
      mr: 'लूप म्हणजे सायकलच्या चाकासारखे फिरणे. ५ वेळा वेगवेगळा कोड लिहिण्याऐवजी, लूप कॉम्प्युटरला चक्राकार पद्धतीने ५ वेळा काम करायला सांगतो.'
    }
  },
  {
    id: 'challenge-3',
    level: 3,
    title: {
      en: 'Level 3: The Helpful Waiter (APIs)',
      hi: 'स्तर 3: मददगार वेटर (APIs)',
      ta: 'நிலை 3: உதவும் சமையலறை உதவியாளர் (APIs)',
      kn: 'ಮಟ್ಟ 3: ಸಹಾಯಕ ವೇಟರ್ (APIs)',
      mr: 'स्तर 3: मदत करणारा वेटर (APIs)'
    },
    description: {
      en: 'Fetch dynamic data from another computer using API calls.',
      hi: 'एपीआई कॉल का उपयोग करके दूसरे कंप्यूटर से गतिशील डेटा (dynamic data) प्राप्त करें।',
      ta: 'API அழைப்புகளைப் பயன்படுத்தி மற்றொரு கணினியிலிருந்து டைனமிக் தரவைப் பெறவும்.',
      kn: 'API ಕರೆಗಳನ್ನು ಬಳಸಿಕೊಂಡು ಮತ್ತೊಂದು ಕಂಪ್ಯೂಟರ್‌ನಿಂದ ಡೈನಾಮಿಕ್ ಡೇಟಾವನ್ನು ಪಡೆದುಕೊಳ್ಳಿ.',
      mr: 'एपीआय कॉलचा वापर करून दुसऱ्या कॉम्प्युटरवरून नवीन डेटा मिळवा.'
    },
    instructions: {
      en: 'Fetch data from the url "/api/courses" using the dynamic fetch() command.',
      hi: 'डायनेमिक fetch() कमांड का उपयोग करके "/api/courses" यूआरएल से डेटा प्राप्त करें।',
      ta: 'fetch() கட்டளையைப் பயன்படுத்தி "/api/courses" என்ற முகவரியிலிருந்து தரவைப் பெறவும்.',
      kn: 'fetch() ಕಮಾಂಡ್ ಬಳಸಿ "/api/courses" ಲಿಂಕ್‌ನಿಂದ ಡೇಟಾವನ್ನು ಹಿಂಪಡೆಯಿರಿ.',
      mr: 'fetch() कमांडचा वापर करून "/api/courses" वरून डेटा मिळवा.'
    },
    initialCode: 'fetch("/api/courses")\n  .then(response => response.json())\n  .then(data => console.log(data));',
    validationRegex: /fetch\s*\(\s*["']\/api\/courses["']\s*\)/i,
    expectedKeyword: 'fetch("/api/courses")',
    analogy: {
      en: 'An API is like a restaurant waiter. You (the client) tell the waiter your order, the waiter carries it to the kitchen (the server), and brings back your delicious food (the data)!',
      hi: 'एक एपीआई रेस्टोरेंट के वेटर की तरह है। आप वेटर को अपना ऑर्डर बताते हैं, वेटर उसे किचन (सर्वर) तक ले जाता है, और आपका स्वादिष्ट खाना (डेटा) वापस लाता है!',
      ta: 'API என்பது ஹோட்டல் சர்வர் போன்றது. நீங்கள் ஆர்டர் சொன்னால், சர்வர் சமையலறைக்குச் சென்று, உங்களுக்கான உணவை (தரவை) கொண்டு வருவார்!',
      kn: 'API ಎನ್ನುವುದು ರೆಸ್ಟೋರೆಂಟ್‌ನ ವೇಟರ್ ಇದ್ದಂತೆ. ನೀವು ಆರ್ಡರ್ ಕೊಟ್ಟರೆ, ವೇಟರ್ ಅಡುಗೆಮನೆಗೆ (ಸರ್ವರ್) ಹೋಗಿ ನಿಮಗಾಗಿ ರುಚಿಕರವಾದ ಊಟವನ್ನು (ಡೇಟಾ) ತರುತ್ತಾನೆ!',
      mr: 'एपीआय म्हणजे हॉटेलमधील वेटरसारखे आहे. तुम्ही वेटरला ऑर्डर देता, वेटर किचनमध्ये (सर्व्हर) जातो आणि तुमचे स्वादिष्ट जेवण (डेटा) घेऊन येतो!'
    }
  }
];

export default function StudentChallengesUI() {
  const [currentLang, setCurrentLang] = useState<'en' | 'hi' | 'ta' | 'kn' | 'mr'>('en');
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0);
  const [studentCode, setStudentCode] = useState(CODING_CHALLENGES[0].initialCode);
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'success' | 'error'; message: string }>({ status: 'idle', message: '' });
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);

  const currentChallenge = CODING_CHALLENGES[activeChallengeIndex];

  useEffect(() => {
    setStudentCode(currentChallenge.initialCode);
    setTestResult({ status: 'idle', message: '' });
  }, [activeChallengeIndex]);

  const handleRunTest = () => {
    const isPassed = currentChallenge.validationRegex.test(studentCode);

    if (isPassed) {
      setTestResult({
        status: 'success',
        message: currentLang === 'hi' ? '🎉 कमाल कर दिया! आपका कोड पूरी तरह से सही है!' 
               : currentLang === 'ta' ? '🎉 அற்புதம்! உங்கள் கோட் சரியாக வேலை செய்கிறது!'
               : currentLang === 'kn' ? '🎉 ಅದ್ಭುತ! ನಿಮ್ಮ ಕೋಡ್ ಸಂಪೂರ್ಣವಾಗಿ ಸರಿಯಾಗಿದೆ!'
               : currentLang === 'mr' ? '🎉 अप्रतिम! तुमचा कोड अगदी बरोबर आहे!'
               : '🎉 Fantastic job! Your code passed all validation checks successfully!'
      });

      if (currentChallenge.level === unlockedLevel && unlockedLevel < CODING_CHALLENGES.length) {
        setUnlockedLevel(prev => prev + 1);
      }
    } else {
      setTestResult({
        status: 'error',
        message: currentLang === 'hi' ? `❌ थोड़ा सुधार की जरूरत है। सुनिश्चित करें कि आप "${currentChallenge.expectedKeyword}" सही ढंग से लिख रहे हैं।` 
               : currentLang === 'ta' ? `❌ சிறிய தவறு. நீங்கள் "${currentChallenge.expectedKeyword}" சரியாக எழுதியுள்ளீர்களா என சரிபார்க்கவும்.`
               : currentLang === 'kn' ? `❌ ಸಣ್ಣ ತಿದ್ದುಪಡಿ ಅಗತ್ಯವಿದೆ. ನೀವು "${currentChallenge.expectedKeyword}" ಸರಿಯಾಗಿ ಬರೆದಿದ್ದೀರಾ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.`
               : currentLang === 'mr' ? `❌ थोडी दुरुस्ती हवी आहे. तुम्ही "${currentChallenge.expectedKeyword}" योग्य लिहिल्याची खात्री करा.`
               : `❌ Code test failed. Double check your typing! Did you include "${currentChallenge.expectedKeyword}" correctly?`
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      {/* Top Header & Language Toggler */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center border-b border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/student" className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              🚀 GlobeSkill Coding Quest
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">Learn real programming step-by-step with interactive analogies</p>
        </div>
        <div className="flex gap-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
          {(['en', 'hi', 'ta', 'kn', 'mr'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setCurrentLang(lang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentLang === lang ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {lang === 'en' ? '🇬🇧 EN' : lang === 'hi' ? '🇮🇳 हिन्दी' : lang === 'ta' ? '🇮🇳 தமிழ்' : lang === 'kn' ? '🇮🇳 ಕನ್ನಡ' : '🇮🇳 मराठी'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">
        {/* Sidebar Level Navigator */}
        <div className="lg:col-span-3 space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Chapters</h3>
          {CODING_CHALLENGES.map((challenge, idx) => {
            const isUnlocked = challenge.level <= unlockedLevel;
            const isActive = idx === activeChallengeIndex;
            return (
              <button
                key={challenge.id}
                disabled={!isUnlocked}
                onClick={() => setActiveChallengeIndex(idx)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 font-bold shadow-lg'
                    : isUnlocked
                    ? 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                    : 'bg-slate-900/30 border-slate-900 text-slate-600 cursor-not-allowed'
                }`}
              >
                <span className="truncate text-sm">
                  {challenge.title[currentLang]}
                </span>
                <span className="text-xs">
                  {isActive ? '👉' : isUnlocked ? '✅' : '🔒'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Coding Workspace Area */}
        <div className="lg:col-span-9 grid md:grid-cols-12 gap-6">
          {/* Problem Statement and Analogy */}
          <div className="md:col-span-6 flex flex-col gap-6">
            {/* Instructions Card */}
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 flex-1 shadow-md">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-emerald-900/50 text-emerald-400 rounded-full text-xs font-bold border border-emerald-800">
                  Level {currentChallenge.level}
                </span>
                <VoiceNarrator text={currentChallenge.description[currentLang]} label="Listen" />
              </div>

              <h2 className="text-xl font-bold mt-3 text-slate-100">
                {currentChallenge.title[currentLang]}
              </h2>
              <p className="text-slate-300 mt-2 text-sm leading-relaxed">
                {currentChallenge.description[currentLang]}
              </p>

              <div className="mt-5 p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-xl">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Goal:</h4>
                <p className="text-slate-200 text-sm font-medium leading-relaxed">
                  {currentChallenge.instructions[currentLang]}
                </p>
              </div>
            </div>

            {/* Analogy & Mentor Box */}
            <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-emerald-400 font-bold text-sm">🌟 AI Mentor Analogy</span>
                <VoiceNarrator text={currentChallenge.analogy[currentLang]} label="Listen Analogy" />
              </div>
              <p className="text-emerald-200/90 text-xs sm:text-sm leading-relaxed">
                {currentChallenge.analogy[currentLang]}
              </p>
            </div>
          </div>

          {/* Code Editor and Test Console */}
          <div className="md:col-span-6 flex flex-col gap-4">
            {/* Code Input Card */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex-1 flex flex-col min-h-[280px]">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span>index.js</span>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                  <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full" />
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                </div>
              </div>
              
              <textarea
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                className="w-full flex-1 p-5 bg-slate-950 text-emerald-300 font-mono text-sm focus:outline-none focus:ring-0 resize-none leading-relaxed"
                placeholder="Type your javascript code here..."
                spellCheck={false}
              />

              <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center">
                <button
                  onClick={() => setStudentCode(currentChallenge.initialCode)}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium cursor-pointer"
                >
                  Reset Template
                </button>
                <button
                  onClick={handleRunTest}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-emerald-500/20 active:scale-95 cursor-pointer"
                >
                  ⚡ Run Test &amp; Submit
                </button>
              </div>
            </div>

            {/* Result Console Card */}
            <div className={`p-4 rounded-xl border shadow-xs transition-all ${
              testResult.status === 'success'
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                : testResult.status === 'error'
                ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                : 'bg-slate-950/50 border-slate-800 text-slate-500'
            }`}>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-1">
                {testResult.status === 'success' ? '✔ SUCCESS' : testResult.status === 'error' ? '✘ ERROR' : '⌨ CONSOLE OUT'}
              </h4>
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                {testResult.status === 'idle' ? 'Write code and click Run Test to see if your solution compiles and passes validation.' : testResult.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
