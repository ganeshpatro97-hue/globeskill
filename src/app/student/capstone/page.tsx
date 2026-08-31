"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import RoleGate from '@/components/RoleGate';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';
import VoiceNarrator from '@/components/VoiceNarrator';
import { 
  Award, 
  Upload, 
  Send, 
  CheckCircle2, 
  ChevronLeft, 
  ExternalLink, 
  GitBranch, 
  Globe, 
  Sparkles, 
  FileCode2,
  TrendingUp
} from 'lucide-react';

interface EvaluationReport {
  score: number;
  verdict: string;
  sdg_impact_summary: string;
  strengths: string[];
  badge_awarded: string;
  recruiter_note: string;
}

export default function CapstonePage() {
  const { profile } = useAuth();
  const { t, language } = useTranslation();

  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sdgTarget, setSdgTarget] = useState('SDG 8: Decent Work and Economic Growth');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationReport | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !description) return;

    setIsSubmitting(true);
    setEvaluation(null);

    try {
      const res = await fetch('/api/projects/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: profile?.id,
          studentName: profile?.full_name || 'Young Innovator',
          projectTitle,
          description,
          sdgTarget,
          githubUrl,
          liveDemoUrl,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setEvaluation(data.evaluation);
      }
    } catch {
      // Handled
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RoleGate allowedRoles={['student', 'trainer', 'admin', 'recruiter']}>
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/student"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Student Portal
            </Link>

            <span className="text-xs font-mono text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Capstone Graduation Hub
            </span>
          </div>

          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Final Capstone &amp; Hackathon Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Submit Your Practical Capstone Project
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Demonstrate your software engineering skills to global recruiters. AI instantly evaluates your project, awards UN SDG Badges, and publishes achievements directly to your portfolio.
            </p>
          </div>

          {/* Submission Form */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <FileCode2 className="w-5 h-5 text-emerald-600" />
                  Project Submission &amp; AI Jury Review
                </h2>
                <p className="text-xs text-slate-500">Provide details about your web app or Python program.</p>
              </div>
              <VoiceNarrator text="कृपया अपने अंतिम प्रोजेक्ट का शीर्षक और विवरण दर्ज करें ताकि एआई जूरी इसका मूल्यांकन कर सके।" label="आवाज में सुनें" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g., Rural Clean Water Tracker"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">UN SDG Target Alignment</label>
                  <select
                    value={sdgTarget}
                    onChange={(e) => setSdgTarget(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                  >
                    <option value="SDG 8: Decent Work and Economic Growth">SDG 8: Decent Work &amp; Economic Growth</option>
                    <option value="SDG 4: Quality Education">SDG 4: Quality Education &amp; Digital Literacy</option>
                    <option value="SDG 6: Clean Water and Sanitation">SDG 6: Clean Water &amp; Sanitation</option>
                    <option value="SDG 3: Good Health and Well-being">SDG 3: Good Health &amp; Well-being</option>
                    <option value="SDG 13: Climate Action">SDG 13: Climate Action &amp; Green Tech</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Project Description &amp; Technical Problem Solved
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what technologies you used (Python, HTML, React), what problem you addressed, and how your application helps your local community..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GitHub / Code Repository URL (Optional)</label>
                  <div className="relative">
                    <GitBranch className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/your-username/project"
                      className="w-full p-3 pl-9 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Live Demo Link (Optional)</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="url"
                      value={liveDemoUrl}
                      onChange={(e) => setLiveDemoUrl(e.target.value)}
                      placeholder="https://my-app.vercel.app"
                      className="w-full p-3 pl-9 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {isSubmitting ? 'AI Jury Evaluating Project...' : 'Submit for Gemini AI Jury Review'}
                </button>
              </div>

            </form>

            {/* AI Grading & SDG Badge Card */}
            {evaluation && (
              <div className="p-6 rounded-3xl bg-emerald-50/80 border border-emerald-200 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-200/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-lg font-bold shadow-xs">
                      🏆
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-emerald-950">{evaluation.verdict}</h3>
                      <p className="text-[11px] text-emerald-700 font-semibold">Awarded: {evaluation.badge_awarded}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-800">{evaluation.score}/100</span>
                    <span className="block text-[9px] font-bold text-emerald-600 uppercase">Jury Match Score</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {evaluation.sdg_impact_summary}
                  </p>

                  <div className="bg-white p-4 rounded-2xl border border-emerald-100 space-y-1.5">
                    <p className="font-bold text-slate-900">🌟 Jury Strengths:</p>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      {evaluation.strengths.map((str, idx) => (
                        <li key={idx}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-emerald-100/60 rounded-xl text-emerald-900 font-semibold text-[11px]">
                    💼 Recruiter Note: {evaluation.recruiter_note}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Link
                    href="/student/portfolio"
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                  >
                    <span>View in AI Portfolio</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </RoleGate>
  );
}
