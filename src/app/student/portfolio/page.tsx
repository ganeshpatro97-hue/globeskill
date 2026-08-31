"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import RoleGate from '@/components/RoleGate';
import { 
  Sparkles, 
  Download, 
  Share2, 
  CheckCircle2, 
  Award, 
  Briefcase, 
  Code2, 
  MapPin, 
  Mail, 
  ExternalLink,
  ChevronLeft,
  GraduationCap,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { StudentPortfolio } from '@/types/database';
import { getStudentPortfolio, generateAiPortfolio } from '@/lib/services/portfolio.service';

export default function StudentPortfolioPage() {
  const { profile } = useAuth();
  const [portfolio, setPortfolio] = useState<StudentPortfolio | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadPortfolio() {
      const data = await getStudentPortfolio(profile?.email || 'student.rohit@globeskill.org');
      setPortfolio(data);
    }
    loadPortfolio();
  }, [profile]);

  const handleGenerateAi = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: profile?.full_name || portfolio?.full_name || 'Young Innovator',
          email: profile?.email || portfolio?.email || 'student@globeskill.org',
          location: profile?.location || portfolio?.location || 'India',
          skills: portfolio?.technical_skills || ['Python', 'AI Foundations', 'Web Dev'],
          completedCourses: portfolio?.verified_certificates || ['GlobeSkill AI Micro Degree'],
          education: profile?.education_background || 'High School & GlobeSkill Digital Hub',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.portfolio) {
          setPortfolio(data.portfolio);
        }
      }
    } catch {
      // Local generation fallback
      if (portfolio) {
        const local = await generateAiPortfolio({
          fullName: portfolio.full_name,
          email: portfolio.email,
          location: portfolio.location,
        });
        setPortfolio(local);
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <RoleGate allowedRoles={['student', 'admin', 'recruiter']}>
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Top Bar Actions (Hidden in Print) */}
          <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
            <Link
              href="/student"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleGenerateAi}
                disabled={generating}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
                {generating ? 'Gemini AI Generating Portfolio...' : 'Generate with Gemini AI'}
              </button>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                {copied ? 'Link Copied!' : 'Share Portfolio'}
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export PDF / Print
              </button>
            </div>
          </div>

          {/* Main Verified Resume / Portfolio Document */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden print:shadow-none print:border-none">
            
            {/* Header Ribbon */}
            <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-8 text-white relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/30 text-emerald-200 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-300" /> UN SDG Verified Talent
                    </span>
                    <span className="bg-white/10 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      ID: {portfolio?.student_id?.slice(0, 12) || 'GS-2026-08'}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {portfolio?.full_name || profile?.full_name || 'Rohit Kumar'}
                  </h1>

                  <p className="text-emerald-100/95 font-medium text-sm max-w-2xl">
                    {portfolio?.headline || 'Junior AI & Full-Stack Developer | Young Innovator Cohort'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-100/80 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                      {portfolio?.location || 'India'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-emerald-300" />
                      {portfolio?.email || profile?.email}
                    </span>
                    <span className="flex items-center gap-1 bg-emerald-700/60 px-2 py-0.5 rounded text-white font-semibold">
                      Match Score: {portfolio?.match_score || 95}%
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center shrink-0 min-w-[140px]">
                  <Award className="w-8 h-8 text-amber-300 mb-1" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">Employability Status</span>
                  <span className="text-xs font-extrabold text-white mt-0.5">Ready for Internship</span>
                </div>
              </div>
            </div>

            {/* Document Body */}
            <div className="p-6 sm:p-8 space-y-8">
              
              {/* Executive Summary */}
              <section className="space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Executive Summary</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  {portfolio?.summary || 'Driven student trained through GlobeSkill in Python, AI foundations, and responsive web design.'}
                </p>
              </section>

              {/* Skills Matrix */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-slate-900">
                  <Code2 className="w-4 h-4 text-emerald-600" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Verified Skill Matrix</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <h3 className="text-xs font-bold text-emerald-900 mb-2">Technical Competencies</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {portfolio?.technical_skills?.map((skill, idx) => (
                        <span key={idx} className="bg-white border border-emerald-200 text-emerald-800 text-xs px-2.5 py-1 rounded-lg font-medium shadow-2xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="text-xs font-bold text-slate-800 mb-2">Soft Skills &amp; Communication</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {portfolio?.soft_skills?.map((skill, idx) => (
                        <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium shadow-2xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Capstone Projects */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-slate-900">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Capstone Projects &amp; Social Impact</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolio?.projects?.map((proj) => (
                    <div key={proj.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition-colors shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-900">{proj.title}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">{proj.completed_at}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.technologies.map((t, idx) => (
                          <span key={idx} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Verified Micro-Credentials */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-slate-900">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Issued Certifications &amp; Micro-Credentials</h2>
                </div>

                <div className="space-y-2">
                  {portfolio?.verified_certificates?.map((cert, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                          GS
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{cert}</p>
                          <p className="text-[10px] text-slate-500">Verified by GlobeSkill &amp; CSR Partner Network</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                        Verified
                      </span>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Footer Watermark */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 text-center text-xs text-slate-500 flex items-center justify-between">
              <span>GlobeSkill Youth Tech &amp; AI Employability Registry</span>
              <span className="font-mono text-[10px]">Sec 80G &amp; CSR Partnership Enabled</span>
            </div>

          </div>

        </div>
      </div>
    </RoleGate>
  );
}
