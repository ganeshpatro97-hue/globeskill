"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import RoleGate from '@/components/RoleGate';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';
import VoiceNarrator from '@/components/VoiceNarrator';
import { 
  Trophy, 
  Flame, 
  Award, 
  Sparkles, 
  ChevronLeft, 
  Terminal, 
  ShieldCheck, 
  TrendingUp, 
  Medal,
  Users
} from 'lucide-react';
import { GamificationStats } from '@/app/api/gamification/xp/route';

export default function LeaderboardPage() {
  const { profile } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGamificationData();
  }, []);

  const fetchGamificationData = async () => {
    try {
      const res = await fetch('/api/gamification/xp');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const currentXp = stats?.xp || 420;
  const nextXp = stats?.nextLevelXp || 600;
  const progressPercent = Math.min(100, Math.round((currentXp / nextXp) * 100));

  return (
    <RoleGate allowedRoles={['student', 'trainer', 'admin', 'recruiter']}>
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
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
              <Trophy className="w-3.5 h-3.5 text-amber-500" /> Phase 9: Gamification &amp; SDG Badges
            </span>
          </div>

          {/* User Level & XP Hero Card */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-900 flex items-center justify-center font-black text-2xl shadow-lg border-2 border-amber-300">
                  {stats?.level || 3}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-200 bg-emerald-500/30 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                    Level {stats?.level || 3} Tier
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {stats?.levelTitle || 'Rising AI Builder'}
                  </h1>
                  <p className="text-emerald-100/80 text-xs">
                    {profile?.full_name || 'Karan Kumar'} • Varanasi Rural Learning Lab
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center">
                  <div className="flex items-center justify-center gap-1 text-amber-300 font-extrabold text-lg">
                    <Flame className="w-5 h-5 text-amber-400 fill-current animate-pulse" />
                    <span>{stats?.streak || 7} Days</span>
                  </div>
                  <span className="text-[10px] text-emerald-200 font-bold uppercase">Learning Streak</span>
                </div>

                <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center">
                  <p className="text-lg font-black text-white">{currentXp} XP</p>
                  <span className="text-[10px] text-emerald-200 font-bold uppercase">Total Points</span>
                </div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-emerald-200">
                <span>XP Progress to Level {(stats?.level || 3) + 1}</span>
                <span>{currentXp} / {nextXp} XP ({progressPercent}%)</span>
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Unlocked Badges Section */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    Unlocked UN SDG Achievement Badges
                  </h2>
                  <p className="text-xs text-slate-500">
                    Earn verified digital badges by completing sandbox challenges, quizzes, and capstones.
                  </p>
                </div>
                <VoiceNarrator text="Unlocked United Nations SDG achievement badges you have earned." label="Listen" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stats?.unlockedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-all flex items-start gap-3.5 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-xs shrink-0 group-hover:scale-110 transition-transform">
                      {badge.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-xs text-slate-900 leading-snug">{badge.name}</h3>
                      <span className="inline-block text-[10px] font-bold font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {badge.sdg}
                      </span>
                      <p className="text-[11px] text-slate-500 leading-tight">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-emerald-900">
                    Next Badge: <strong>CSR Corporate Apprenticeship Ready</strong> (+100 XP)
                  </span>
                </div>
                <Link
                  href="/sandbox"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Practice in Sandbox (+25 XP)
                </Link>
              </div>

            </div>

            {/* Regional Community Leaderboard */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 space-y-4">
              
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Regional Center Rankings
                </h2>
                <p className="text-[11px] text-slate-500">Top rural digital students this month</p>
              </div>

              <div className="space-y-2.5">
                {stats?.leaderboard.map((user) => (
                  <div
                    key={user.rank}
                    className={`p-3 rounded-2xl flex items-center justify-between transition-all ${
                      user.rank === 1
                        ? 'bg-amber-50/80 border border-amber-200'
                        : user.rank === 2
                        ? 'bg-slate-100 border border-slate-200'
                        : 'bg-slate-50 border border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                        user.rank === 1 ? 'bg-amber-400 text-slate-900 font-black' :
                        user.rank === 2 ? 'bg-slate-300 text-slate-900' :
                        user.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {user.rank <= 3 ? <Medal className="w-3.5 h-3.5" /> : user.rank}
                      </div>

                      <div>
                        <p className="font-bold text-xs text-slate-900 leading-tight">{user.name}</p>
                        <p className="text-[10px] text-slate-500">{user.center}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-xs text-emerald-700">{user.xp} XP</span>
                      <span className="block text-[9px] text-slate-400 font-semibold">{user.badgesCount} Badges</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </div>
    </RoleGate>
  );
}
