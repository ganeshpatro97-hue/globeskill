"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useAuth } from '@/context/AuthContext';
import RoleGate from '@/components/RoleGate';
import { Course, Enrollment } from '@/types/database';
import { getCourseById } from '@/lib/services/course.service';
import { enrollStudentInCourse, toggleChapterProgress, getStudentEnrollments } from '@/lib/services/enrollment.service';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Trophy, 
  Sparkles, 
  Clock, 
  Bot 
} from 'lucide-react';

export default function CoursePlayerPage() {
  const params = useParams();
  const { profile } = useAuth();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    async function load() {
      if (!courseId) return;
      const studentId = profile?.id || '00000000-0000-0000-0000-000000000003';
      const c = await getCourseById(courseId);
      setCourse(c);

      if (c) {
        // Ensure student is enrolled
        const enr = await enrollStudentInCourse(studentId, c.id, profile?.full_name, profile?.email);
        const allEnrs = await getStudentEnrollments(studentId);
        const active = allEnrs.find((e) => e.enrollment.course_id === c.id);
        setEnrollment(active?.enrollment || enr);
      }
      setLoading(false);
    }
    load();
  }, [courseId, profile]);

  const handleToggleChapter = async (chapterId: string) => {
    if (!enrollment || toggling) return;
    setToggling(true);
    try {
      const updated = await toggleChapterProgress(enrollment.id, chapterId);
      setEnrollment({ ...updated });

      // If just reached 100%, trigger celebration confetti!
      if (updated.progress_percentage === 100) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#059669', '#10b981', '#34d399', '#f59e0b', '#3b82f6'],
        });
      }
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-slate-500">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium">Launching interactive course player...</p>
      </div>
    );
  }

  if (!course || !enrollment) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Course Unavailable</h2>
        <Link href="/student" className="text-xs font-bold text-emerald-700 hover:underline">
          Return to Student Dashboard
        </Link>
      </div>
    );
  }

  const activeChapter = course.syllabus[activeChapterIndex] || course.syllabus[0];
  const isCurrentChapterCompleted = enrollment.completed_chapters.includes(activeChapter.id);

  return (
    <RoleGate allowedRoles={['student']} portalName="Interactive Learning Player">
      <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        
        {/* Top Navbar Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <Link
              href="/student"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                Interactive Learning Player
              </span>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 truncate max-w-md">
                {course.title}
              </h1>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Course Progress</span>
              <span className="text-sm font-black text-emerald-700">{enrollment.progress_percentage}% Complete</span>
            </div>
            <div className="w-32 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${enrollment.progress_percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 100% Completion Celebration Banner */}
        {enrollment.progress_percentage === 100 && (
          <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-md flex items-center justify-between flex-wrap gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <Trophy className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-base">Congratulations, Young Innovator! 🎓</h3>
                <p className="text-xs text-emerald-100">
                  You have successfully finished all curriculum modules and earned your GlobeSkill Certificate!
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
                alert("Official GlobeSkill Certificate generated and added to your achievements!");
              }}
              className="px-4 py-2 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              Download Verified Certificate
            </button>
          </div>
        )}

        {/* Main Learning Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chapter Content & Interactive Practice (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Chapter Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-emerald-700">Module {activeChapterIndex + 1} of {course.syllabus.length}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {activeChapter.duration_minutes} mins estimated
                  </span>
                </div>

                <button
                  onClick={() => handleToggleChapter(activeChapter.id)}
                  disabled={toggling}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isCurrentChapterCompleted
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-2xs'
                  }`}
                >
                  {isCurrentChapterCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Completed
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 text-slate-400" /> Mark as Done
                    </>
                  )}
                </button>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {activeChapter.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {activeChapter.description}
                </p>
              </div>

              {/* Guided Interactive Coding Demonstration */}
              <div className="p-5 bg-slate-900 rounded-2xl text-slate-100 space-y-3 font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 text-[11px]">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" /> Hands-On Code Sandbox Exercise
                  </span>
                  <span>Python 3.12</span>
                </div>

                <div className="text-slate-300 text-xs leading-relaxed">
                  <span className="text-slate-500"># Step 1: Let&apos;s build an interactive AI decision model</span>
                  <br />
                  <span className="text-emerald-400">def</span> <span className="text-yellow-300">evaluate_ai_accuracy</span>(correct_predictions, total_samples):
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;accuracy = (correct_predictions / total_samples) * 100
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-emerald-400">return</span> f&quot;Model Accuracy: &#123;accuracy:.1f&#125;%&quot;
                  <br /><br />
                  <span className="text-slate-500"># Step 2: Test on our test dataset</span>
                  <br />
                  result = evaluate_ai_accuracy(95, 100)
                  <br />
                  <span className="text-cyan-400">print</span>(result)
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-emerald-400 flex items-center justify-between">
                  <span>Output: Model Accuracy: 95.0% (Verified!)</span>
                  <span className="text-slate-500 text-[10px]">Execution: 12ms</span>
                </div>
              </div>

              {/* Navigation Between Chapters */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  disabled={activeChapterIndex === 0}
                  onClick={() => setActiveChapterIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  &larr; Previous Module
                </button>

                <button
                  disabled={activeChapterIndex === course.syllabus.length - 1}
                  onClick={() => setActiveChapterIndex((prev) => Math.min(course.syllabus.length - 1, prev + 1))}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Next Module &rarr;
                </button>
              </div>

            </div>

          </div>

          {/* Chapter Checklist Sidebar (1 Col) */}
          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center justify-between">
                <span>Course Modules ({course.syllabus.length})</span>
                <span className="text-emerald-700 font-mono text-xs">
                  {enrollment.completed_chapters.length}/{course.syllabus.length} Done
                </span>
              </h3>

              <div className="space-y-2">
                {course.syllabus.map((ch, idx) => {
                  const isDone = enrollment.completed_chapters.includes(ch.id);
                  const isSelected = activeChapterIndex === idx;

                  return (
                    <div
                      key={ch.id}
                      onClick={() => setActiveChapterIndex(idx)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-600 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleChapter(ch.id);
                          }}
                          className="shrink-0 p-1 cursor-pointer"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                          )}
                        </button>
                        <span className={`text-xs truncate ${isSelected ? 'font-bold text-emerald-950' : 'text-slate-700 font-medium'}`}>
                          {idx + 1}. {ch.title.split(':')[0]}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                        {ch.duration_minutes}m
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mentor Assistance Helper */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-950">
                <Bot className="w-4 h-4 text-emerald-600" /> Learning Support
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Have a question about this chapter? Click the floating **&quot;Ask AI Mentor&quot;** button in the bottom right corner anytime to get instant help.
              </p>
            </div>

          </div>

        </div>

      </div>
    </RoleGate>
  );
}
