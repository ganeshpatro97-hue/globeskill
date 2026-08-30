"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import RoleGate from '@/components/RoleGate';
import { Course, Enrollment, CourseCategory, SkillLevel, SyllabusChapter } from '@/types/database';
import { getAllCourses, createCourse, addCourseMaterial } from '@/lib/services/course.service';
import { getCourseRoster } from '@/lib/services/enrollment.service';
import { 
  BookOpen, 
  PlusCircle, 
  Users, 
  Upload, 
  Sparkles, 
  Calendar,
  Layers
} from 'lucide-react';

export default function TrainerDashboardPage() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseForRoster, setSelectedCourseForRoster] = useState<string>('');
  const [roster, setRoster] = useState<Enrollment[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCourseForUpload, setSelectedCourseForUpload] = useState<string>('');
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialType, setMaterialType] = useState<'pdf' | 'slide' | 'code' | 'doc'>('pdf');

  // New course form states
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDuration, setNewDuration] = useState('6 Weeks (36 Hours)');
  const [newLevel, setNewLevel] = useState<SkillLevel>('Beginner');
  const [newCategory, setNewCategory] = useState<CourseCategory>('AI & Machine Learning');
  const [chapters, setChapters] = useState<SyllabusChapter[]>([
    { id: 'ch-1', title: '1. Introduction to the Topic', duration_minutes: 60, description: 'Foundational concepts and setup.' },
    { id: 'ch-2', title: '2. Hands-on Project & Practical Lab', duration_minutes: 90, description: 'Building the core component with guidance.' },
  ]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function load() {
      const all = await getAllCourses(true);
      setCourses(all);
      if (all.length > 0) {
        setSelectedCourseForRoster(all[0].id);
        setSelectedCourseForUpload(all[0].id);
        const r = await getCourseRoster(all[0].id);
        setRoster(r);
      }
    }
    load();
  }, []);

  const handleSelectCourseRoster = async (courseId: string) => {
    setSelectedCourseForRoster(courseId);
    const r = await getCourseRoster(courseId);
    setRoster(r);
  };

  const handleAddChapter = () => {
    const num = chapters.length + 1;
    setChapters([
      ...chapters,
      {
        id: `ch-${Date.now()}`,
        title: `${num}. New Hands-on Chapter`,
        duration_minutes: 60,
        description: 'Module explanation and live lab instructions.',
      },
    ]);
  };

  const handleUpdateChapter = (idx: number, field: keyof SyllabusChapter, val: string | number) => {
    const copy = [...chapters];
    copy[idx] = { ...copy[idx], [field]: val };
    setChapters(copy);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newTagline || !newDesc) return;
    setCreating(true);
    try {
      const created = await createCourse({
        title: newTitle,
        tagline: newTagline,
        description: newDesc,
        duration: newDuration,
        skill_level: newLevel,
        category: newCategory,
        trainer_id: profile?.id || '00000000-0000-0000-0000-000000000002',
        trainer_name: profile?.full_name || 'Priya Patel (Lead Instructor)',
        syllabus: chapters,
      });

      setCourses([created, ...courses]);
      setShowCreateModal(false);
      // Reset form
      setNewTitle('');
      setNewTagline('');
      setNewDesc('');
    } finally {
      setCreating(false);
    }
  };

  const handleUploadMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialTitle || !selectedCourseForUpload) return;
    await addCourseMaterial(selectedCourseForUpload, materialTitle, materialType);
    const updated = await getAllCourses(true);
    setCourses(updated);
    setShowUploadModal(false);
    setMaterialTitle('');
  };

  const totalStudents = courses.reduce((sum, c) => sum + (c.enrolled_count || 0), 0);

  return (
    <RoleGate allowedRoles={['trainer', 'admin']} portalName="Trainer Course Studio">
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-700/60 border border-teal-500/40 px-3 py-1 rounded-full text-xs font-semibold text-teal-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" /> Educator &amp; Mentor Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Trainer Studio &amp; Course Hub
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-200">
              Publish technical curriculum, review enrolled students, and manage course materials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-4 h-4" /> Upload Material
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Create New Course
            </button>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Programs Led</span>
              <span className="text-2xl font-black text-slate-900">{courses.length}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Learners Reached</span>
              <span className="text-2xl font-black text-slate-900">{totalStudents}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Upcoming Live Session</span>
              <span className="text-sm font-bold text-slate-900">Sat, 10:00 AM IST</span>
            </div>
          </div>
        </div>

        {/* Main 2-Col Layout: Courses List & Student Roster */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Courses Studio List (1 Col) */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-teal-600" /> Active Programs
                </h2>
                <span className="text-xs text-slate-500 font-mono">{courses.length} Courses</span>
              </div>

              <div className="space-y-3">
                {courses.map((course) => {
                  const isSelected = selectedCourseForRoster === course.id;
                  return (
                    <div
                      key={course.id}
                      onClick={() => handleSelectCourseRoster(course.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                          {course.category}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {course.enrolled_count} Learners
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{course.title}</h3>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{course.duration} • {course.skill_level}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Student Roster Table View (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" /> Student Roster &amp; Progress
                  </h2>
                  <p className="text-xs text-slate-500">
                    Live learning progress for {courses.find((c) => c.id === selectedCourseForRoster)?.title || 'Selected Course'}
                  </p>
                </div>

                <select
                  value={selectedCourseForRoster}
                  onChange={(e) => handleSelectCourseRoster(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-xs"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Roster Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                      <th className="pb-3 px-2">Student Name</th>
                      <th className="pb-3 px-2">Email</th>
                      <th className="pb-3 px-2">Enrolled Date</th>
                      <th className="pb-3 px-2">Progress</th>
                      <th className="pb-3 px-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {roster.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                          No enrollments yet for this course. Invite new learners!
                        </td>
                      </tr>
                    ) : (
                      roster.map((student) => (
                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-2 font-bold text-slate-900">
                            {student.student_name || 'Rohit Kumar (Student)'}
                          </td>
                          <td className="py-3 px-2 text-slate-600">
                            {student.student_email || 'student.rohit@globeskill.org'}
                          </td>
                          <td className="py-3 px-2 text-slate-500 font-mono text-[11px]">
                            {student.enrolled_at.slice(0, 10)}
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-emerald-600 h-full rounded-full"
                                  style={{ width: `${student.progress_percentage}%` }}
                                ></div>
                              </div>
                              <span className="font-bold text-emerald-800 text-[11px] font-mono">
                                {student.progress_percentage}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                student.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-teal-50 text-teal-800'
                              }`}
                            >
                              {student.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

        </div>

        {/* MODAL 1: Create Course */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-600" /> Create New Course Curriculum
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-lg"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Course Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Applied Robotics with Python & Microcontrollers"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    required
                    value={newTagline}
                    onChange={(e) => setNewTagline(e.target.value)}
                    placeholder="e.g. Build smart sensors, motors, and automated hardware."
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as CourseCategory)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                      <option value="Web & Cloud Development">Web & Cloud Development</option>
                      <option value="Digital Literacy">Digital Literacy</option>
                      <option value="Career & Mentorship">Career & Mentorship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Skill Level</label>
                    <select
                      value={newLevel}
                      onChange={(e) => setNewLevel(e.target.value as SkillLevel)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Comprehensive overview of what students will achieve..."
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Syllabus Chapter Builder */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-700">Course Syllabus Builder</label>
                    <button
                      type="button"
                      onClick={handleAddChapter}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Add Chapter
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                    {chapters.map((ch, idx) => (
                      <div key={ch.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={ch.title}
                            onChange={(e) => handleUpdateChapter(idx, 'title', e.target.value)}
                            placeholder="Chapter Title"
                            className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-semibold"
                          />
                          <input
                            type="number"
                            value={ch.duration_minutes}
                            onChange={(e) => handleUpdateChapter(idx, 'duration_minutes', Number(e.target.value))}
                            placeholder="Mins"
                            className="w-20 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                          />
                        </div>
                        <input
                          type="text"
                          value={ch.description}
                          onChange={(e) => handleUpdateChapter(idx, 'description', e.target.value)}
                          placeholder="Chapter description and activities..."
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    {creating ? 'Publishing Course...' : 'Publish Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: Upload Material */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-teal-600" /> Upload Course Material / PDF
                </h3>
                <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                  &times;
                </button>
              </div>

              <form onSubmit={handleUploadMaterial} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Target Course</label>
                  <select
                    value={selectedCourseForUpload}
                    onChange={(e) => setSelectedCourseForUpload(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Document / Resource Title</label>
                  <input
                    type="text"
                    required
                    value={materialTitle}
                    onChange={(e) => setMaterialTitle(e.target.value)}
                    placeholder="e.g. AI Robotics Lab Starter Guide (PDF)"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">File Type</label>
                  <select
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value as 'pdf' | 'slide' | 'code' | 'doc')}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white"
                  >
                    <option value="pdf">PDF Handbook / Worksheet</option>
                    <option value="slide">Presentation Slides</option>
                    <option value="code">Jupyter Notebook / Code (.ipynb, .py)</option>
                    <option value="doc">Text Document</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    Attach Material
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </RoleGate>
  );
}
