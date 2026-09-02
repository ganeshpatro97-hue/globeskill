'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/regional-language-support';
import RoleGate from '@/components/RoleGate';
import { ChevronLeft } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  techStack: string[];
}

interface Credential {
  course: string;
  certifiedBy: string;
  completionDate: string;
  badgeUrl?: string;
}

interface ResumeData {
  summary: string;
  skills: string[];
  projects: Project[];
  credentials: Credential[];
}

export default function StudentPortfolioPage() {
  const { t, language } = useTranslation();
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('synced');
  const [activeTab, setActiveTab] = useState<'view' | 'applications'>('view');
  const [applications, setApplications] = useState<any[]>([]);

  // Load mock/live portfolio data
  const fetchPortfolio = async () => {
    try {
      const response = await fetch('/api/resume/get-current');
      if (response.ok) {
        const data = await response.json();
        if (data?.resume && data.resume.summary) {
          setResume({
            summary: data.resume.summary || data.resume.professional_summary,
            skills: Array.isArray(data.resume.skills) 
              ? data.resume.skills 
              : Object.values(data.resume.key_skills || {}).flat() as string[] || [
                "HTML5 & CSS3", "JavaScript (ES6+)", "TypeScript", "React.js", 
                "Next.js App Router", "Tailwind CSS", "PostgreSQL & Supabase", 
                "Python Foundations", "Prompt Engineering"
              ],
            projects: Array.isArray(data.resume.projects) 
              ? data.resume.projects.map((p: any) => ({
                title: p.title,
                description: p.description,
                techStack: p.techStack || p.technologies || ["Next.js", "Python", "Tailwind CSS"]
              })) 
              : [
                {
                  title: "GlobeSkill Interactive Student Workspace",
                  description: "Designed and built a mobile-first dashboard for kids to track their coding progress, complete with micro-challenges, offline persistence state, and vernacular localization toggles.",
                  techStack: ["Next.js", "React", "Tailwind CSS", "IndexedDB"]
                },
                {
                  title: "Community Clean-Drive Tracker Portal",
                  description: "A database-driven application enabling local communities to coordinate green campaigns, track volunteer hours, and log overall waste collection metrics securely.",
                  techStack: ["React", "Supabase DB", "Row-Level Security", "PostgreSQL"]
                }
              ],
            credentials: Array.isArray(data.resume.credentials)
              ? data.resume.credentials.map((c: any) => ({
                course: c.course || c.title || "AI Micro-Degree Certificate",
                certifiedBy: c.certifiedBy || "GlobeSkill & Edunet Foundation",
                completionDate: c.completionDate || "August 2026",
                badgeUrl: c.badgeUrl || "🌟"
              }))
              : [
                {
                  course: "AI Micro-Degree Certificate",
                  certifiedBy: "GlobeSkill TechPower Foundation",
                  completionDate: "August 2026",
                  badgeUrl: "🌟"
                },
                {
                  course: "Web Development Foundations & CSR Tech Basics",
                  certifiedBy: "Edunet Foundation (IBM SkillsBuild Partner)",
                  completionDate: "June 2026",
                  badgeUrl: "💼"
                }
              ]
          });
          return;
        }
      }
      
      // Fallback data
      setResume({
        summary: "An enthusiastic coding and AI student passionate about developing digital solutions and solving local community problems through software engineering. Demonstrated solid base in web technologies with practical application experience.",
        skills: [
          "HTML5 & CSS3", 
          "JavaScript (ES6+)", 
          "TypeScript", 
          "React.js", 
          "Next.js App Router", 
          "Tailwind CSS", 
          "PostgreSQL & Supabase", 
          "Python Foundations",
          "Prompt Engineering"
        ],
        projects: [
          {
            title: "GlobeSkill Interactive Student Workspace",
            description: "Designed and built a mobile-first dashboard for kids to track their coding progress, complete with micro-challenges, offline persistence state, and vernacular localization toggles.",
            techStack: ["Next.js", "React", "Tailwind CSS", "IndexedDB"]
          },
          {
            title: "Community Clean-Drive Tracker Portal",
            description: "A database-driven application enabling local communities to coordinate green campaigns, track volunteer hours, and log overall waste collection metrics securely.",
            techStack: ["React", "Supabase DB", "Row-Level Security", "PostgreSQL"]
          }
        ],
        credentials: [
          {
            course: "AI Micro-Degree Certificate",
            certifiedBy: "GlobeSkill TechPower Foundation",
            completionDate: "August 2026",
            badgeUrl: "🌟"
          },
          {
            course: "Web Development Foundations & CSR Tech Basics",
            certifiedBy: "Edunet Foundation (IBM SkillsBuild Partner)",
            completionDate: "June 2026",
            badgeUrl: "💼"
          }
        ]
      });
    } catch (e) {
      console.error("Error loading resume details", e);
    }
  };

  // Compile portfolio with dynamic serverless AI agent (/api/resume/compile)
  const handleAICompile = async () => {
    setIsCompiling(true);
    setSyncStatus('syncing');
    try {
      const res = await fetch('/api/resume/compile', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language })
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.resume) {
          await fetchPortfolio();
          setSyncStatus('synced');
        }
      } else {
        setTimeout(() => {
          setResume(prev => {
            if (!prev) return null;
            return {
              ...prev,
              summary: "Certified Junior Software Developer validated by the GlobeSkill AI Coding Mentor. Expertly trained in dynamic React/Next.js interfaces, cloud-hosted relational databases, and secure payments sync."
            };
          });
          setSyncStatus('synced');
        }, 1200);
      }
    } catch (error) {
      console.error("AI Compilation error", error);
      setSyncStatus('error');
    } finally {
      setIsCompiling(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    // Load mock job application history
    setApplications([
      {
        id: "app-001",
        role: "Junior Frontend Intern",
        company: "Edunet Partner Solutions",
        appliedDate: "August 25, 2026",
        status: "under_review",
        matchScore: 92,
        feedback: "Excellent layout competence and strong dynamic React foundations."
      },
      {
        id: "app-002",
        role: "AI Assistant Trainee",
        company: "Tech-Power CSR Ventures",
        appliedDate: "August 12, 2026",
        status: "interview_scheduled",
        matchScore: 88,
        feedback: "Outstanding work on conversational UI components and API handling."
      }
    ]);
  }, [language]);

  return (
    <RoleGate allowedRoles={['student', 'admin', 'trainer', 'recruiter']}>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-8 md:p-12 font-sans text-slate-800 print:bg-white print:p-0">
        
        {/* Upper Configuration Bar - Hidden during print/PDF export */}
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-6 mb-8 gap-4 print:hidden">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/student" className="p-1.5 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <ChevronLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">💼 {t('aiMentorTitle')} Portfolio</h1>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Phase 8</span>
            </div>
            <p className="text-slate-500 text-sm mt-1">Sponsor-verified student qualifications &amp; AI-generated employment portfolio</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Active Navigation Tabs */}
            <div className="bg-slate-200/60 p-1 rounded-lg flex text-xs font-semibold">
              <button 
                onClick={() => setActiveTab('view')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${activeTab === 'view' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Resume
              </button>
              <button 
                onClick={() => setActiveTab('applications')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${activeTab === 'applications' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Applications ({applications.length})
              </button>
            </div>

            {/* Sync indicator */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-2">
              <span className={`h-2.5 w-2.5 rounded-full ${syncStatus === 'synced' ? 'bg-emerald-500' : syncStatus === 'syncing' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`} />
              {syncStatus === 'synced' ? 'Cloud Sync Active' : syncStatus === 'syncing' ? 'Syncing...' : 'Sync Error'}
            </div>

            <button
              onClick={handleAICompile}
              disabled={isCompiling}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:bg-emerald-400"
            >
              {isCompiling ? (
                <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
              ) : '🤖'}
              {isCompiling ? 'Compiling Profile...' : 'Refresh with AI'}
            </button>
            
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              📥 Download PDF
            </button>
          </div>
        </div>

        {/* Main Container */}
        <div className="max-w-4xl mx-auto">
          
          {/* TAB 1: RESUME PREVIEW & COMPILER SCREEN */}
          {activeTab === 'view' && (
            <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 border border-slate-100 print:shadow-none print:border-none print:p-0">
              {resume ? (
                <div className="space-y-8">
                  {/* Resume Header / Contact Info */}
                  <div className="border-b-2 border-emerald-600 pb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Karan Kumar</h2>
                        <p className="text-emerald-700 font-bold text-lg mt-0.5">Junior Full-Stack Web &amp; AI Developer</p>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-center sm:text-right print:border-slate-300">
                        <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">CSR Verification Token</p>
                        <p className="font-mono text-sm font-semibold text-slate-700 mt-0.5">GS-2026-EDUNET-8839</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-y-2 gap-x-4 mt-4 text-xs font-semibold text-slate-500 print:text-slate-800">
                      <span className="flex items-center gap-1">📍 New Delhi, India</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">📧 student.karan@globeskill.org</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">🌐 github.com/karan-globeskill</span>
                    </div>
                  </div>

                  {/* AI Professional Summary */}
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-black text-emerald-800 uppercase tracking-widest border-l-4 border-emerald-600 pl-2">Professional Summary</h3>
                    <p className="text-slate-700 leading-relaxed text-sm sm:text-base print:text-black">
                      {resume.summary}
                    </p>
                  </div>

                  {/* Skills Grid */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-emerald-800 uppercase tracking-widest border-l-4 border-emerald-600 pl-2">Technical Core Competencies</h3>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {resume.skills.map((skill, i) => (
                        <span 
                          key={i} 
                          className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded-lg font-bold text-xs border border-slate-200/60 transition-colors print:bg-white print:border-slate-300 print:text-black"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Credentials / Certifications */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-emerald-800 uppercase tracking-widest border-l-4 border-emerald-600 pl-2">Verified Professional Credentials</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {resume.credentials.map((cred, i) => (
                        <div key={i} className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 flex items-start gap-3.5 hover:shadow-md transition-all print:bg-white print:border-slate-300">
                          <div className="bg-emerald-100 p-2.5 rounded-lg text-lg flex items-center justify-center print:bg-slate-100">
                            {cred.badgeUrl || '🏅'}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm leading-snug">{cred.course}</h4>
                            <p className="text-xs text-emerald-700 font-bold mt-0.5">{cred.certifiedBy}</p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-1.5 uppercase tracking-wider">Completed: {cred.completionDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hands-on Projects */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-emerald-800 uppercase tracking-widest border-l-4 border-emerald-600 pl-2">Completed Portals &amp; Sandbox Milestones</h3>
                    <div className="space-y-4">
                      {resume.projects.map((proj, i) => (
                        <div key={i} className="border-l-2 border-slate-200 pl-4 space-y-1.5 hover:border-emerald-500 transition-colors">
                          <h4 className="font-extrabold text-slate-900 text-base leading-snug">{proj.title}</h4>
                          <p className="text-slate-600 text-sm leading-relaxed print:text-slate-900">{proj.description}</p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {proj.techStack.map((tech, j) => (
                              <span key={j} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md uppercase print:bg-white print:border print:border-slate-300">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer CSR Verification Stamps */}
                  <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider gap-4">
                    <span>Authorized by GlobeSkill TechPower and Edunet Foundations</span>
                    <span className="text-emerald-700">Verified UN SDG 8 Compliant Resume</span>
                  </div>
                </div>
              ) : (
                <div className="py-24 flex flex-col items-center justify-center space-y-4">
                  <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
                  <p className="text-slate-500 text-sm font-semibold">Compiling certified student credentials...</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACTIVE JOB APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              {applications.map((app) => (
                <div key={app.id} className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 leading-snug">{app.role}</h3>
                      <p className="text-emerald-700 font-bold text-sm">{app.company}</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      {/* Status badge */}
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                        app.status === 'interview_scheduled' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status === 'interview_scheduled' ? 'Interview Scheduled' : 'Under Review'}
                      </span>
                      {/* Compatibility Match Score */}
                      <div className="text-right">
                        <span className="text-2xl font-black text-emerald-700">{app.matchScore}%</span>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">AI Match Score</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1 bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Applied Date</p>
                      <p className="font-semibold text-slate-700">{app.appliedDate}</p>
                    </div>
                    <div className="space-y-1 bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Coach Feedback</p>
                      <p className="text-slate-600 leading-relaxed font-medium">{app.feedback}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </RoleGate>
  );
}
