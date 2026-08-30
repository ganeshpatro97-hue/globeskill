"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Course } from '@/types/database';
import { getCourseById } from '@/lib/services/course.service';
import { enrollStudentInCourse } from '@/lib/services/enrollment.service';
import { useAuth } from '@/context/AuthContext';
import { 
  Clock, 
  BookOpen, 
  Award, 
  FileText, 
  CheckCircle2, 
  PlayCircle, 
  Download, 
  ArrowLeft,
  Sparkles,
  Share2
} from 'lucide-react';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { profile } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolledSuccess, setEnrolledSuccess] = useState(false);

  const courseId = params.id as string;

  useEffect(() => {
    async function load() {
      if (!courseId) return;
      const data = await getCourseById(courseId);
      setCourse(data);
      setLoading(false);
    }
    load();
  }, [courseId]);

  const handleEnroll = async () => {
    if (!course) return;
    setEnrolling(true);
    try {
      const studentId = profile?.id || '00000000-0000-0000-0000-000000000003';
      await enrollStudentInCourse(studentId, course.id, profile?.full_name, profile?.email);
      setEnrolledSuccess(true);
      setTimeout(() => {
        router.push(`/student/courses/${course.id}`);
      }, 1000);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-slate-500">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium">Loading course curriculum...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Course Not Found</h2>
        <p className="text-xs text-slate-600 mb-6">The requested course could not be located or has been archived.</p>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Course Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Programs
        </Link>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xs mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            {course.category}
          </span>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-500" /> {course.skill_level}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {course.title}
        </h1>
        <p className="text-sm sm:text-base text-emerald-700 font-semibold mt-2">
          {course.tagline}
        </p>

        <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed max-w-3xl">
          {course.description}
        </p>

        {/* Quick Stats & Action Button */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 block font-medium">Duration</span>
              <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> {course.duration}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Enrolled Students</span>
              <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-500" /> {course.enrolled_count} Active
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Lead Instructor</span>
              <span className="font-bold text-slate-900 mt-0.5 block">
                {course.trainer_name || 'GlobeSkill Faculty'}
              </span>
            </div>
          </div>

          <button
            onClick={handleEnroll}
            disabled={enrolling || enrolledSuccess}
            className={`px-8 py-3.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
              enrolledSuccess
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {enrolledSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Enrolled! Launching Player...
              </>
            ) : enrolling ? (
              'Enrolling in Course...'
            ) : (
              <>
                <PlayCircle className="w-4 h-4" /> Start Learning Now (Free)
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Syllabus / Curriculum (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" /> Course Syllabus &amp; Modules
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Complete each hands-on chapter and test your skills with guided code exercises.
            </p>

            <div className="space-y-4">
              {course.syllabus.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {chapter.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {chapter.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap bg-white px-2 py-1 rounded border border-slate-200 shrink-0">
                      {chapter.duration_minutes} mins
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Course Materials & Certification */}
        <div className="space-y-6">
          
          {/* Downloadable Materials */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" /> Study Materials &amp; Slides
            </h3>
            {course.materials && course.materials.length > 0 ? (
              <div className="space-y-2">
                {course.materials.map((mat) => (
                  <div
                    key={mat.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 block truncate max-w-[170px]">{mat.title}</span>
                      <span className="text-[10px] text-slate-500 uppercase">{mat.file_type} • {mat.file_size_kb} KB</span>
                    </div>
                    <button
                      onClick={() => alert(`Downloading study resource: ${mat.title}`)}
                      className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                      title="Download Resource"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Course slides and code notebooks are unlocked automatically when you start the first module.
              </p>
            )}
          </div>

          {/* Certificate Badge info */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-3">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1">
              Verified Completion Certificate
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Upon finishing 100% of the chapters and presenting your final project, you will receive a digital certificate backed by GlobeSkill and community partners.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
