"use client";

import React from 'react';
import Link from 'next/link';
import CodeSandbox from '@/components/CodeSandbox';
import { Terminal, Sparkles, ChevronLeft, BookOpen, Award } from 'lucide-react';
import { useTranslation } from '@/context/LanguageContext';

export default function SandboxPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-950 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/student"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Student Portal
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Live Compiler Online
            </span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-900/60 via-slate-900 to-teal-950/80 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Terminal className="w-4 h-4" /> Interactive Code Sandbox &amp; Compiler
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Write, Run, and Test Code in Real-Time
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Practice Python 3 scripts, create responsive HTML web apps, and receive instant explanations from Sparky AI Mentor.
          </p>
        </div>

        {/* Sandbox Component */}
        <CodeSandbox />

      </div>
    </div>
  );
}
