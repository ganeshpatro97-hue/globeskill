"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlatformStatus } from "@/types/platform";
import { 
  GraduationCap, 
  BookOpen, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Bot, 
  CheckCircle2, 
  Award,
  Layers,
  Code2
} from "lucide-react";

export default function Home() {
  // Exploration feedback state
  const [exploreMessage, setExploreMessage] = useState<string | null>(null);

  // System status states
  const [statusData, setStatusData] = useState<PlatformStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState<boolean>(true);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  // Query /api/health with cancellation safety for initial load
  useEffect(() => {
    let isCancelled = false;

    async function loadInitialStatus() {
      try {
        const response = await fetch("/api/health", {
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
        }

        const data: PlatformStatus = await response.json();
        if (!isCancelled) {
          setStatusData(data);
          setLastChecked(new Date().toLocaleTimeString());
          setStatusLoading(false);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const errorMessage = err instanceof Error ? err.message : "Unable to reach the platform backend service.";
          setStatusError(errorMessage);
          setStatusLoading(false);
        }
      }
    }

    loadInitialStatus();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Manual refresh trigger
  const handleRefresh = async () => {
    setStatusLoading(true);
    setStatusError(null);
    try {
      const response = await fetch("/api/health", {
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
      }

      const data: PlatformStatus = await response.json();
      setStatusData(data);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unable to reach the platform backend service.";
      setStatusError(errorMessage);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleExploreClick = () => {
    setExploreMessage("GlobeSkill platform is successfully running. Welcome to the future of AI & Digital Education!");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-100/90 via-white to-slate-50 border-b border-slate-200/80 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
            {/* Top Tag & Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true"></span>
              Global Education &amp; Equal Opportunity Initiative
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              GlobeSkill
            </h1>

            {/* Tagline */}
            <p className="mt-4 text-xl sm:text-2xl font-semibold text-emerald-700 max-w-2xl mx-auto leading-snug">
              Technology &amp; AI Education for Every Child
            </p>

            {/* Core Description Text */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              GlobeSkill is an initiative to help underserved learners gain access to digital skills, technology education and AI-enabled career opportunities.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="explore-button"
                onClick={handleExploreClick}
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
                aria-label="Explore GlobeSkill Platform"
              >
                Explore GlobeSkill
              </button>

              <Link
                href="/courses"
                className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-sm font-bold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Browse Course Catalog
              </Link>
            </div>

            {/* Feedback Message upon clicking Explore */}
            {exploreMessage && (
              <div
                role="status"
                aria-live="polite"
                className="mt-6 max-w-md mx-auto p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-left text-xs text-emerald-900 shadow-sm flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{exploreMessage}</p>
                </div>
                <button
                  onClick={() => setExploreMessage(null)}
                  className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold underline ml-2 cursor-pointer"
                  aria-label="Dismiss message"
                >
                  Dismiss
                </button>
              </div>
            )}

          </div>
        </section>

        {/* 4 Role Portal Hubs Showcase */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Interactive Multi-Role Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                Built for Every Stakeholder
              </h2>
              <p className="mt-2 text-slate-600 text-xs sm:text-sm">
                Seamless role-based portals for students, educators, philanthropists, and NGO administrators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Student Portal */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-emerald-50/40 hover:border-emerald-300 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Student Portal</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Learn AI, Python, &amp; Web Dev with interactive milestone tracking and 24/7 AI mentor guidance.
                  </p>
                </div>
                <Link
                  href="/student"
                  className="text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  Open Learning Portal <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Card 2: Trainer Studio */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-teal-50/40 hover:border-teal-300 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Trainer Studio</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Author technical syllabi, upload course PDF materials, and inspect live student rosters.
                  </p>
                </div>
                <Link
                  href="/trainer"
                  className="text-xs font-bold text-teal-700 flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  Launch Trainer Studio <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Card 3: Donor Hub */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-rose-50/40 hover:border-rose-300 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                    <Heart className="w-6 h-6 fill-rose-500" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Support &amp; Donor Hub</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Sponsor rural student cohorts, track funding milestones, and download 80G tax receipts.
                  </p>
                </div>
                <Link
                  href="/donate"
                  className="text-xs font-bold text-rose-700 flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  Donate &amp; View Impact <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Card 4: NGO Admin Command */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-indigo-50/40 hover:border-indigo-300 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">NGO Admin Center</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Real-time enrollment velocity analytics, user role administration, and CSV compliance export.
                  </p>
                </div>
                <Link
                  href="/admin"
                  className="text-xs font-bold text-indigo-700 flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  Admin Governance <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* Mission & Focus Pillars */}
        <section id="mission" className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Empowering the Next Generation of Technologists
              </h2>
              <p className="mt-3 text-slate-600 text-xs sm:text-sm">
                Building inclusive bridges from basic digital literacy to applied artificial intelligence competencies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-base mb-4">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Digital Literacy</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Equipping children and youth in underserved communities with essential computing foundations and safe online practices.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base mb-4">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Applied AI Curriculum</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Interactive, age-appropriate AI and machine learning concepts designed to inspire curiosity and critical thinking.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base mb-4">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Career &amp; Mentorship</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Connecting passionate students with tech mentors, hands-on project workshops, and future employment pathways.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* System Status Section */}
        <section id="status" className="py-14 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              
              {/* Card Header */}
              <div className="px-6 py-4 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">System Status</h2>
                  <p className="text-xs text-slate-500">Live health verification from backend API (<code className="font-mono text-slate-700">/api/health</code>)</p>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={statusLoading}
                  className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
                  aria-label="Refresh system status"
                >
                  {statusLoading ? "Checking..." : "Refresh"}
                </button>
              </div>

              {/* Card Body */}
              <div className="p-6">
                
                {/* 1. Loading State */}
                {statusLoading && (
                  <div className="flex items-center gap-3 py-6 justify-center text-slate-600 text-xs" role="status">
                    <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                    <span>Checking platform connection...</span>
                  </div>
                )}

                {/* 2. Error State */}
                {!statusLoading && statusError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">Platform Status: Offline / Error</p>
                      <p className="text-[11px] text-red-700 mt-1">{statusError}</p>
                    </div>
                    <button
                      onClick={handleRefresh}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* 3. Success State */}
                {!statusLoading && !statusError && statusData && (
                  <div className="space-y-4">
                    {/* Main Status Pill */}
                    <div className="flex items-center justify-between flex-wrap gap-2 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl">
                      <div className="flex items-center gap-2.5">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                        </span>
                        <span className="font-bold text-emerald-950 text-sm sm:text-base">
                          Platform Status: {statusData.platformStatus}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        HTTP 200 OK
                      </span>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pt-1">
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <span className="font-semibold text-slate-500 block text-[11px]">Project Name:</span>
                        <span className="font-bold text-slate-900">{statusData.project}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <span className="font-semibold text-slate-500 block text-[11px]">Current Phase:</span>
                        <span className="font-bold text-slate-900">{statusData.currentPhase}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <span className="font-semibold text-slate-500 block text-[11px]">Backend Message:</span>
                        <span className="font-bold text-slate-900">{statusData.message}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <span className="font-semibold text-slate-500 block text-[11px]">Last Verified:</span>
                        <span className="font-bold text-slate-900">{lastChecked || "Just now"}</span>
                      </div>
                    </div>

                    {/* Architectural Flow Demonstration */}
                    <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                      <p className="font-semibold text-slate-700 mb-1">Architecture Flow Demonstration:</p>
                      <p className="font-mono bg-slate-100 p-2.5 rounded-lg text-slate-700 text-[11px] overflow-x-auto">
                        Frontend (UI) &rarr; API Route (/api/health) &rarr; Business Logic (getPlatformStatus) &rarr; Response JSON
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
