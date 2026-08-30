"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Course, CourseCategory, SkillLevel } from '@/types/database';
import { getAllCourses } from '@/lib/services/course.service';
import { enrollStudentInCourse } from '@/lib/services/enrollment.service';
import { useAuth } from '@/context/AuthContext';
import { 
  Compass, 
  Search, 
  Clock, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Filter
} from 'lucide-react';

export default function CourseCatalogPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [enrolledSuccessId, setEnrolledSuccessId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getAllCourses();
      setCourses(data);
    }
    load();
  }, []);

  const categories = ['All', 'AI & Machine Learning', 'Web & Cloud Development', 'Digital Literacy', 'Career & Mentorship'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = courses.filter((c) => {
    const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchLvl = selectedLevel === 'All' || c.skill_level === selectedLevel;
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchLvl && matchSearch;
  });

  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    try {
      const studentId = profile?.id || '00000000-0000-0000-0000-000000000003';
      await enrollStudentInCourse(studentId, courseId, profile?.full_name, profile?.email);
      setEnrolledSuccessId(courseId);
      setTimeout(() => {
        router.push(`/student/courses/${courseId}`);
      }, 1200);
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-md mb-10 relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" /> Free Open NGO Tech Curriculum
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Skill Development Programs &amp; AI Courses
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed">
            High-impact technical courses designed for young minds and underserved learners. From foundational digital literacy to applied machine learning models.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses, skills, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9.5 pr-4 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full shrink-0 font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Skill Level Filter */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <span className="font-semibold text-slate-500">Skill Level:</span>
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-emerald-100 text-emerald-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No courses match your filter</h3>
          <p className="text-xs text-slate-500 mt-1">Try selecting a different category or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredCourses.map((course) => {
            const isEnrolledSuccess = enrolledSuccessId === course.id;
            const isEnrolling = enrollingId === course.id;

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6">
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {course.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      {course.skill_level}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    <Link href={`/courses/${course.id}`}>{course.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {course.tagline}
                  </p>

                  {/* Syllabus chapters highlights */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Course Curriculum ({course.syllabus.length} Chapters):
                    </span>
                    <ul className="space-y-1">
                      {course.syllabus.slice(0, 3).map((ch) => (
                        <li key={ch.id} className="text-xs text-slate-600 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{ch.title}</span>
                        </li>
                      ))}
                      {course.syllabus.length > 3 && (
                        <li className="text-[11px] text-emerald-700 font-semibold pl-5">
                          + {course.syllabus.length - 3} more hands-on modules
                        </li>
                      )}
                    </ul>
                  </div>

                </div>

                {/* Footer / Actions */}
                <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {course.duration}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" /> {course.enrolled_count} Learners
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/courses/${course.id}`}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Details
                    </Link>

                    <button
                      onClick={() => handleEnroll(course.id)}
                      disabled={isEnrolling || isEnrolledSuccess}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                        isEnrolledSuccess
                          ? 'bg-emerald-700 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isEnrolledSuccess ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled! Launching...
                        </>
                      ) : isEnrolling ? (
                        'Enrolling...'
                      ) : (
                        <>
                          Enroll Now <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
