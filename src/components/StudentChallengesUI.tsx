"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Play, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Award, 
  ChevronLeft,
  Lightbulb, 
  Sparkles,
  Lock,
  Code2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Challenge {
  id: string;
  level: number;
  title: string;
  description: string;
  instructions: string;
  initialCode: string;
  validationRegex: RegExp;
  expectedKeyword: string;
  analogy: string;
}

const CODING_CHALLENGES: Challenge[] = [
  {
    id: 'challenge-1',
    level: 1,
    title: 'Level 1: The Magic Toy Box (Variables)',
    description: 'Learn how to create a variable to store a secret number.',
    instructions: 'Declare a variable named "toyBox" and set its value to 10.',
    initialCode: '// Write your code below!\nlet toyBox = ',
    validationRegex: /let\s+toyBox\s*=\s*10\s*;?/i,
    expectedKeyword: 'let toyBox = 10',
    analogy: 'A variable is like a toy box. You label the box ("toyBox") and put a toy inside (the number 10) so the computer remembers it!'
  },
  {
    id: 'challenge-2',
    level: 2,
    title: 'Level 2: The Infinite Carousel (Loops)',
    description: 'Learn how to make the computer repeat actions automatically using loops.',
    instructions: 'Create a "for" loop that runs 5 times to spin the carousel.',
    initialCode: 'for (let count = 0; count < 5; count++) {\n  console.log("Carousel Spin!");\n}',
    validationRegex: /for\s*\(\s*let\s+\w+\s*=\s*0\s*;\s*\w+\s*<\s*5\s*;\s*\w+\s*\+\+\s*\)/i,
    expectedKeyword: 'for (let count = 0; count < 5; count++)',
    analogy: 'A loop is like a bicycle wheel spinning or a musical carousel. Instead of writing code 5 times, a loop tells the computer to repeat it 5 times in a circle!'
  },
  {
    id: 'challenge-3',
    level: 3,
    title: 'Level 3: The Helpful Waiter (APIs)',
    description: 'Fetch dynamic data from another computer using API calls.',
    instructions: 'Fetch data from the url "/api/courses" using the dynamic fetch() command.',
    initialCode: 'fetch("/api/courses")\n  .then(response => response.json())\n  .then(data => console.log(data));',
    validationRegex: /fetch\s*\(\s*["']\/api\/courses["']\s*\)/i,
    expectedKeyword: 'fetch("/api/courses")',
    analogy: 'An API is like a restaurant waiter. You (the client) tell the waiter your order, the waiter carries it to the kitchen (the server), and brings back your delicious food (the data)!'
  }
];

export default function StudentChallengesUI() {
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
        message: '🎉 Fantastic job! Your code passed all validation checks successfully!'
      });

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      if (currentChallenge.level === unlockedLevel && unlockedLevel < CODING_CHALLENGES.length) {
        setUnlockedLevel(prev => prev + 1);
      }
    } else {
      setTestResult({
        status: 'error',
        message: `❌ Code test failed. Double check your typing! Did you include "${currentChallenge.expectedKeyword}" correctly?`
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      {/* Top Header */}
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
        
        <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-400">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Interactive Coding Mode</span>
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
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isActive ? 'bg-emerald-500 text-slate-950' : isUnlocked ? 'bg-slate-700 text-slate-300' : 'bg-slate-800 text-slate-600'
                  }`}>
                    {challenge.level}
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{challenge.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {isUnlocked ? 'Unlocked' : 'Locked'}
                    </div>
                  </div>
                </div>
                {!isUnlocked && <Lock className="w-3.5 h-3.5 text-slate-600" />}
              </button>
            );
          })}
        </div>

        {/* Coding Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Challenge Description Card */}
          <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
                  Level {currentChallenge.level}
                </span>
                <span className="text-xs text-slate-400">Micro-Challenge</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                {currentChallenge.title}
              </h2>
              <p className="text-slate-300 text-sm mt-1">
                {currentChallenge.description}
              </p>
            </div>

            {/* Analogy Callout */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 flex gap-3.5 items-start">
              <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                  💡 Real-World Analogy
                </div>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  {currentChallenge.analogy}
                </p>
              </div>
            </div>

            {/* Instruction Callout */}
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                🎯 Task Instruction
              </div>
              <p className="text-sm font-semibold text-white">
                {currentChallenge.instructions}
              </p>
            </div>
          </div>

          {/* Interactive Code Editor Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-300">JavaScript Editor</span>
              </div>
              <button
                onClick={() => setStudentCode(currentChallenge.initialCode)}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="p-4">
              <textarea
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                rows={6}
                spellCheck={false}
                className="w-full bg-transparent font-mono text-xs sm:text-sm text-emerald-300 focus:outline-none resize-none leading-relaxed"
                placeholder="// Write your code here..."
              />
            </div>

            <div className="bg-slate-900/70 border-t border-slate-800/80 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex-1">
                {testResult.status === 'success' && (
                  <div className="text-xs text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{testResult.message}</span>
                  </div>
                )}
                {testResult.status === 'error' && (
                  <div className="text-xs text-rose-400 font-semibold flex items-center gap-2">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>{testResult.message}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleRunTest}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                Run Code & Verify
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
