"use client";

import React from 'react';
import Link from 'next/link';
import InteractiveSandbox from '@/components/InteractiveSandbox';
import RoleGate from '@/components/RoleGate';
import { ChevronLeft, Sparkles, Terminal } from 'lucide-react';
import { useTranslation } from '@/context/LanguageContext';

export default function StudentSandboxPage() {
  const { t } = useTranslation();

  return (
    <RoleGate allowedRoles={['student', 'trainer', 'admin', 'recruiter']}>
      <div className="min-h-screen bg-slate-950 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/student"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Student Dashboard
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Interactive Sandbox Active
              </span>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-emerald-900/60 via-slate-900 to-teal-950/80 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Terminal className="w-4 h-4" /> Live Web &amp; HTML/CSS/JS Coding Playground
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Interactive Code Sandbox &amp; Live Compiler
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Create real-world applications with real-time compilation, offline persistence, and automated line-by-line feedback from Sparky AI Mentor.
            </p>
          </div>

          {/* Interactive Sandbox UI */}
          <InteractiveSandbox />

        </div>
      </div>
    </RoleGate>
  );
}
