"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';
import RoleGate from '@/components/RoleGate';
import { Enrollment, Course, Announcement } from '@/types/database';
import { getStudentEnrollments } from '@/lib/services/enrollment.service';
import { getAnnouncements } from '@/lib/services/announcement.service';
import { 
  GraduationCap, 
  BookOpen, 
  Trophy, 
  Clock, 
  PlayCircle, 
  BellRing, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Bot
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { profile } = useAuth();
  const { t } = useTranslation();
  const [enrollmentsWithCourses, setEnrollmentsWithCourses] = useState<{ enrollment: Enrollment; course: Course }[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const studentId = profile?.id || '00000000-0000-0000-0000-000000000003';
      const [enrList, annList] = await Promise.all([
        getStudentEnrollments(studentId),
        getAnnouncements('student'),
      ]);
      setEnrollmentsWithCourses(enrList);
      setAnnouncements(annList);
      setLoading(false);
    }
    load();
  }, [profile]);

  // Calculate learning metrics
  const activeCount = enrollmentsWithCourses.filter((e) => e.enrollment.status === 'active').length;
  const completedCount = enrollmentsWithCourses.filter((e) => e.enrollment.progress_percentage === 100 || e.enrollment.status === 'completed').length;
  const totalChaptersCompleted = enrollmentsWithCourses.reduce((sum, e) => sum + e.enrollment.completed_chapters.length, 0);
  const estimatedHours = totalChaptersCompleted * 1.5;

  return (
    <RoleGate allowedRoles={['student']} portalName="Student Learning Portal">
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-700/60 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" /> {t('Active Student Cohort', 'Active Student Cohort')}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('Welcome back,', 'Welcome back,')} {profile?.full_name || t('Young Innovator', 'Young Innovator')}! 👋
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-200">
              {t("Continue your AI and digital skills journey. Complete today's coding challenge!", "Continue your AI and digital skills journey. Complete today's coding challenge!")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/courses"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 shrink-0"
            >
              <BookOpen className="w-4 h-4" /> {t('Browse More Courses', 'Browse More Courses')}
            </Link>
          </div>
        </div>

        {/* Learning Stats Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">{t('Active Courses', 'Active Courses')}</span>
              <span className="text-2xl font-black text-slate-900">{activeCount}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">{t('Completed Chapters', 'Completed Chapters')}</span>
              <span className="text-2xl font-black text-slate-900">{totalChaptersCompleted}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">{t('Learning Time', 'Learning Time')}</span>
              <span className="text-2xl font-black text-slate-900">{estimatedHours} {t('hoursShort', 'hrs')}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">{t('Achievement Badges', 'Achievement Badges')}</span>
              <span className="text-2xl font-black text-slate-900">{completedCount}</span>
            </div>
          </div>

        </div>

        {/* Main Content Grid: Active Courses + Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Courses List (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-600" /> {t('My Learning Programs', 'My Learning Programs')}
                  </h2>
                  <p className="text-xs text-slate-500">{t('Pick up where you left off', 'Pick up where you left off')}</p>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-10 text-slate-500 text-xs">{t('Loading your enrollments...', 'Loading your enrollments...')}</div>
              ) : enrollmentsWithCourses.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800">{t('You are not enrolled in any courses yet', 'You are not enrolled in any courses yet')}</p>
                  <p className="text-xs text-slate-500 mt-1 mb-4">{t('Choose from free programs like AI Micro Degree and Web Dev.', 'Choose from free programs like AI Micro Degree and Web Dev.')}</p>
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                  >
                    {t('Browse Course Catalog')} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrollmentsWithCourses.map(({ enrollment, course }) => (
                    <div
                      key={enrollment.id}
                      className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            {t(course.category)}
                          </span>
                          <span className="text-xs text-slate-500">
                            {enrollment.completed_chapters.length} {t('of', 'of')} {course.syllabus.length} {t('Chapters Complete', 'Chapters Complete')}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900">
                          {t(course.title)}
                        </h3>

                        {/* Progress Bar */}
                        <div className="space-y-1 max-w-md">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                            <span>{t('Progress', 'Progress')}</span>
                            <span>{enrollment.progress_percentage}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${enrollment.progress_percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/student/courses/${course.id}`}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <PlayCircle className="w-4 h-4" />
                        {enrollment.progress_percentage === 100 ? t('Review Course', 'Review Course') : t('Resume Lesson', 'Resume Lesson')}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Announcements & Mentorship Noticeboard */}
          <div className="space-y-6">
            
            {/* Announcements Board */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                <BellRing className="w-4 h-4 text-amber-500" /> {t('Community Announcements', 'Community Announcements')}
              </h3>
              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs space-y-1">
                    <h4 className="font-bold text-amber-950">{t(ann.title)}</h4>
                    <p className="text-slate-700 leading-relaxed">{t(ann.content)}</p>
                    <span className="text-[10px] text-amber-800 font-semibold block pt-1">
                      {t('Posted by', 'Posted by')} {ann.author_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Assistant Callout */}
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl border border-emerald-200 p-6 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-emerald-950 mb-1">
                {t('Stuck on a coding question?', 'Stuck on a coding question?')}
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed mb-4">
                {t('Sparky, your friendly AI mentor, is available 24/7 in the bottom-right corner to explain coding concepts in simple analogies.', 'Sparky, your friendly AI mentor, is available 24/7 in the bottom-right corner to explain coding concepts in simple analogies.')}
              </p>
              <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> {t('Click the Ask AI Mentor button below!', "Click the 'Ask AI Mentor' button below!")}
              </div>
            </div>

          </div>

        </div>

      </div>
    </RoleGate>
  );
}
