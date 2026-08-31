"use client";

import React, { useState } from 'react';
import RoleGate from '@/components/RoleGate';
import TeacherImpactDashboardUI from '@/components/TeacherImpactDashboardUI';

// TypeScript Interfaces matching Phase 2 Database Schema
export interface Student {
  id: string;
  full_name: string;
  email: string;
  location: string;
  enrolled_date: string;
  progress: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  skill_level: 'Beginner' | 'Intermediate' | 'Advanced';
  syllabus: string[];
  studentsEnrolled: number;
  students: Student[];
}

const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'AI Micro Degree (Practical Foundations)',
    description: 'An introductory track focusing on practical AI tools, prompt engineering, and fundamental Python concepts for social impact initiatives.',
    duration: '8 Weeks',
    skill_level: 'Beginner',
    syllabus: [
      'Introduction to AI and Prompt Engineering',
      'Python Scripting Basics for Data Projects',
      'Building with Generative AI APIs',
      'Ethical AI Guidelines & Community Safety'
    ],
    studentsEnrolled: 4,
    students: [
      { id: 's1', full_name: 'Aarav Sharma', email: 'aarav@globeskill.org', location: 'Delhi Center', enrolled_date: '2026-08-10', progress: 85 },
      { id: 's2', full_name: 'Pooja Reddy', email: 'pooja@globeskill.org', location: 'Hyderabad Hub', enrolled_date: '2026-08-12', progress: 92 },
      { id: 's3', full_name: 'Rahul Sen', email: 'rahul.sen@gmail.com', location: 'Kolkata Center', enrolled_date: '2026-08-15', progress: 60 },
      { id: 's4', full_name: 'Farhan Akhtar', email: 'farhan@globeskill.org', location: 'Lucknow Hub', enrolled_date: '2026-08-18', progress: 45 }
    ]
  },
  {
    id: 'course-2',
    title: 'Full-Stack Web Development',
    description: 'Comprehensive track to design responsive modern web apps using Next.js, React, TypeScript, and database integrations.',
    duration: '12 Weeks',
    skill_level: 'Intermediate',
    syllabus: [
      'Git Version Control & Project Architecture',
      'React Components & State Hooks',
      'Next.js Routing & Backend API Routes',
      'Supabase Database Integration & RLS'
    ],
    studentsEnrolled: 3,
    students: [
      { id: 's2', full_name: 'Pooja Reddy', email: 'pooja@globeskill.org', location: 'Hyderabad Hub', enrolled_date: '2026-08-11', progress: 75 },
      { id: 's5', full_name: 'Meera Nair', email: 'meera.nair@gmail.com', location: 'Bengaluru West', enrolled_date: '2026-08-14', progress: 80 },
      { id: 's6', full_name: 'Amit Patel', email: 'amit.patel@yahoo.com', location: 'Mumbai Core', enrolled_date: '2026-08-20', progress: 30 }
    ]
  },
  {
    id: 'course-3',
    title: 'IBM SkillsBuild Tech Basics',
    description: 'Foundational digital literacy curriculum customized to build employability skills and digital confidence among school dropouts and marginalized communities.',
    duration: '4 Weeks',
    skill_level: 'Beginner',
    syllabus: [
      'Computer Fundamentals & Internet Essentials',
      'Word Processing and Document Collaborations',
      'Introduction to Modern Work Productivity Tools',
      'Cyber Security Awareness & Online Safety'
    ],
    studentsEnrolled: 2,
    students: [
      { id: 's7', full_name: 'Savitri Bai', email: 'savitri@globeskill.org', location: 'Pune Rural Hub', enrolled_date: '2026-08-22', progress: 100 },
      { id: 's8', full_name: 'Karan Singh', email: 'karan.s@outlook.com', location: 'Jaipur Outreach', enrolled_date: '2026-08-24', progress: 50 }
    ]
  }
];

export default function TrainerDashboard() {
  const [activeView, setActiveView] = useState<'impact' | 'courses'>('impact');
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<Course>(INITIAL_COURSES[0]);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states for creating a new course
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDuration, setNewDuration] = useState('6 Weeks');
  const [newLevel, setNewLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [newSyllabusItem, setNewSyllabusItem] = useState('');
  const [newSyllabusList, setNewSyllabusList] = useState<string[]>([]);

  const handleAddSyllabusItem = () => {
    if (newSyllabusItem.trim()) {
      setNewSyllabusList([...newSyllabusList, newSyllabusItem.trim()]);
      setNewSyllabusItem('');
    }
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim(),
      duration: newDuration,
      skill_level: newLevel,
      syllabus: newSyllabusList.length > 0 ? newSyllabusList : ['Foundational Core Concepts'],
      studentsEnrolled: 0,
      students: []
    };

    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    setSelectedCourse(newCourse);
    setIsAddingCourse(false);
    
    setNewTitle('');
    setNewDescription('');
    setNewDuration('6 Weeks');
    setNewLevel('Beginner');
    setNewSyllabusList([]);

    setSuccessMessage('Course published and successfully database synced!');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <RoleGate allowedRoles={['trainer', 'admin']} portalName="Trainer Management Hub">
      {activeView === 'impact' ? (
        <div>
          {/* Top Switcher Bar */}
          <div className="bg-slate-900 text-white px-6 py-2 flex items-center justify-between border-b border-slate-800 text-xs font-semibold">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Trainer View Mode: <strong>Impact Analytics &amp; Offline Sync</strong>
            </span>
            <button
              onClick={() => setActiveView('courses')}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer text-white font-bold"
            >
              Switch to Curriculum Studio →
            </button>
          </div>
          <TeacherImpactDashboardUI />
        </div>
      ) : (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
        {/* Navigation Banner */}
        <div className="bg-slate-950 text-white shadow-md border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-600 text-white font-extrabold px-3 py-1.5 rounded-lg text-lg tracking-wider">
                GS
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">GlobeSkill</h1>
                <p className="text-xs text-emerald-400">Curriculum Studio &amp; Student Tracks</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <button
                onClick={() => setActiveView('impact')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                ← Back to Impact Dashboard
              </button>
              <div className="h-8 w-8 bg-emerald-700 hover:bg-emerald-600 transition text-white font-semibold flex items-center justify-center rounded-full text-sm shadow cursor-pointer">
                T1
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Layout */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Success Alert Banner */}
          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center space-x-3 shadow-xs animate-in fade-in">
              <span className="text-lg">✔️</span>
              <span className="font-semibold text-sm">{successMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT PANEL: Course Navigator */}
            <div className="space-y-6 lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">My Class Tracks</h2>
                  <button
                    onClick={() => setIsAddingCourse(!isAddingCourse)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition shadow-sm cursor-pointer"
                  >
                    {isAddingCourse ? 'Cancel' : '+ New Course'}
                  </button>
                </div>

                {/* Course Navigation List */}
                <div className="space-y-3">
                  {courses.map((c) => {
                    const isSelected = selectedCourse.id === c.id && !isAddingCourse;
                    return (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedCourse(c);
                          setIsAddingCourse(false);
                        }}
                        className={`p-4 rounded-xl cursor-pointer transition border text-left ${
                          isSelected
                            ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300'
                            : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            c.skill_level === 'Beginner' ? 'bg-teal-100 text-teal-800' :
                            c.skill_level === 'Intermediate' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {c.skill_level}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">{c.duration}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{c.title}</h3>
                        <p className="text-xs text-slate-500 mt-1.5 flex items-center">
                          👤 {c.studentsEnrolled} Active Student{c.studentsEnrolled !== 1 && 's'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-sm font-semibold text-slate-400 mb-4">NGO Impact Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700">
                    <p className="text-2xl font-bold text-emerald-400">
                      {courses.reduce((acc, c) => acc + c.studentsEnrolled, 0)}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Enrolled Students</p>
                  </div>
                  <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700">
                    <p className="text-2xl font-bold text-teal-400">{courses.length}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Total Tech Tracks</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL: Dynamic View Area */}
            <div className="lg:col-span-2">
              
              {/* CONDITIONAL: New Course Form */}
              {isAddingCourse ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Publish New Course</h2>
                  <p className="text-xs text-slate-500 mb-6">Create a technical training track aligned with global tech employability standards for NGO deployment.</p>
                  
                  <form onSubmit={handleCreateCourse} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Course Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Cloud Associate Foundation"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Duration</label>
                        <select
                          value={newDuration}
                          onChange={(e) => setNewDuration(e.target.value)}
                          className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                        >
                          <option>4 Weeks</option>
                          <option>6 Weeks</option>
                          <option>8 Weeks</option>
                          <option>12 Weeks</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Description</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Briefly describe the career outcomes and technology tools students will practice..."
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Skill Level</label>
                        <select
                          value={newLevel}
                          onChange={(e) => setNewLevel(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                          className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                        >
                          <option value="Beginner">Beginner Level</option>
                          <option value="Intermediate">Intermediate Level</option>
                          <option value="Advanced">Advanced Level</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Curriculum / Syllabus</label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Add topic (e.g., Intro to HTML)"
                            value={newSyllabusItem}
                            onChange={(e) => setNewSyllabusItem(e.target.value)}
                            className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                          />
                          <button
                            type="button"
                            onClick={handleAddSyllabusItem}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 rounded-xl transition cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Syllabus Preview Tags */}
                    {newSyllabusList.length > 0 && (
                      <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Curriculum Flow Preview:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {newSyllabusList.map((item, index) => (
                            <span key={index} className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-lg font-medium border border-emerald-100">
                              {index + 1}. {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsAddingCourse(false)}
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition shadow cursor-pointer"
                      >
                        Publish to Portal
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* VIEW: Selected Course Details & Roster Management */
                <div className="space-y-6">
                  
                  {/* Course Header Summary */}
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-5 mb-5 gap-3">
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          selectedCourse.skill_level === 'Beginner' ? 'bg-teal-100 text-teal-800' :
                          selectedCourse.skill_level === 'Intermediate' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {selectedCourse.skill_level} Track
                        </span>
                        <h2 className="text-xl font-bold text-slate-900 mt-2 tracking-tight">{selectedCourse.title}</h2>
                      </div>
                      <div className="text-right">
                        <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-xl border border-emerald-100 block">
                          ⏱️ Duration: {selectedCourse.duration}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed text-slate-600 mb-6">{selectedCourse.description}</p>

                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Structured Curriculum:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedCourse.syllabus.map((topic, i) => (
                        <div key={i} className="flex items-start space-x-2 p-3 bg-slate-50/50 rounded-xl border border-slate-100 text-xs">
                          <span className="font-bold text-emerald-600">{String(i + 1).padStart(2, '0')}.</span>
                          <span className="font-medium text-slate-700">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enrolled Students Roster Card */}
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Enrolled Student Roster</h3>
                        <p className="text-xs text-slate-500">View real-time curriculum progress and learning performance logs.</p>
                      </div>
                      <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-semibold">
                        {selectedCourse.students.length} Students
                      </span>
                    </div>

                    {selectedCourse.students.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                        <p className="text-sm font-semibold text-slate-500">No students are currently enrolled in this track.</p>
                        <p className="text-xs text-slate-400 mt-1">Enrollments from local hubs will show up automatically once processed.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                              <th className="pb-3 font-semibold">Name</th>
                              <th className="pb-3 font-semibold">Center Location</th>
                              <th className="pb-3 font-semibold">Enrollment Date</th>
                              <th className="pb-3 font-semibold text-right">Course Progress</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {selectedCourse.students.map((student) => (
                              <tr key={student.id} className="text-xs">
                                <td className="py-4">
                                  <p className="font-bold text-slate-900">{student.full_name}</p>
                                  <p className="text-[10px] text-slate-400 font-medium">{student.email}</p>
                                </td>
                                <td className="py-4 font-medium text-slate-600">{student.location}</td>
                                <td className="py-4 font-medium text-slate-500">{student.enrolled_date}</td>
                                <td className="py-4 text-right">
                                  <div className="flex flex-col items-end">
                                    <span className={`font-bold ${
                                      student.progress >= 90 ? 'text-emerald-600' :
                                      student.progress >= 60 ? 'text-teal-600' : 'text-amber-600'
                                    }`}>
                                      {student.progress}%
                                    </span>
                                    {/* Minimal progress bar visual */}
                                    <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                      <div
                                        className={`h-full rounded-full ${
                                          student.progress >= 90 ? 'bg-emerald-500' :
                                          student.progress >= 60 ? 'bg-teal-500' : 'bg-amber-500'
                                        }`}
                                        style={{ width: `${student.progress}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>

          </div>
        </main>
      </div>
      )}
    </RoleGate>
  );
}
