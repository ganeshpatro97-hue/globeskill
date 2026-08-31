"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export interface StudentRecord {
  id: string;
  name: string;
  lastActive: string;
  attendanceRate: number;
  completedChapters: number;
  codeSandboxLevel: number;
  offlineSyncCount: number;
  parentConfidenceScore: number;
  parentTestimonial: string;
}

const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: 'stud-01',
    name: 'Aarav Sharma',
    lastActive: '2026-08-31 10:15',
    attendanceRate: 96,
    completedChapters: 5,
    codeSandboxLevel: 3,
    offlineSyncCount: 0,
    parentConfidenceScore: 5,
    parentTestimonial: 'Aarav came home and explained variables to me using his toy box. He is so proud of himself!'
  },
  {
    id: 'stud-02',
    name: 'Priya Patel',
    lastActive: '2026-08-31 10:44',
    attendanceRate: 98,
    completedChapters: 6,
    codeSandboxLevel: 3,
    offlineSyncCount: 12,
    parentConfidenceScore: 5,
    parentTestimonial: 'Priya wants to be a web developer now. She taught me how CSS colors a website in Marathi.'
  },
  {
    id: 'stud-03',
    name: 'Aditya Kumar',
    lastActive: '2026-08-30 16:30',
    attendanceRate: 90,
    completedChapters: 4,
    codeSandboxLevel: 2,
    offlineSyncCount: 0,
    parentConfidenceScore: 4,
    parentTestimonial: 'My son is spending hours writing code. I never imagined a village child could do this.'
  },
  {
    id: 'stud-04',
    name: 'Ananya Rao',
    lastActive: '2026-08-31 09:12',
    attendanceRate: 94,
    completedChapters: 5,
    codeSandboxLevel: 3,
    offlineSyncCount: 4,
    parentConfidenceScore: 5,
    parentTestimonial: 'Ananya said her coding mentor is like a friendly robot. She feels supported even when offline.'
  },
  {
    id: 'stud-05',
    name: 'Rahul Deshmukh',
    lastActive: '2026-08-29 11:15',
    attendanceRate: 88,
    completedChapters: 3,
    codeSandboxLevel: 1,
    offlineSyncCount: 0,
    parentConfidenceScore: 3,
    parentTestimonial: 'Rahul is slowly getting interested. The regional language option helped us understand together.'
  }
];

export default function TeacherImpactDashboardUI() {
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [filterQuery, setFilterQuery] = useState('');
  const [syncInProgress, setSyncInProgress] = useState<string | null>(null);
  const [showParentModal, setShowParentModal] = useState<StudentRecord | null>(null);

  const averageAttendance = Math.round(students.reduce((acc, s) => acc + s.attendanceRate, 0) / students.length);
  const averageParentConfidence = (students.reduce((acc, s) => acc + s.parentConfidenceScore, 0) / students.length).toFixed(1);
  const totalPendingOfflineSyncs = students.reduce((acc, s) => acc + s.offlineSyncCount, 0);
  const totalGraduatingStudents = students.filter(s => s.codeSandboxLevel >= 3).length;

  const handleTriggerManualSync = (studentId: string) => {
    setSyncInProgress(studentId);
    setTimeout(() => {
      setStudents(prev => 
        prev.map(s => s.id === studentId ? { ...s, offlineSyncCount: 0 } : s)
      );
      setSyncInProgress(null);
    }, 1200);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10 font-sans">
      {/* Dashboard Top Navigation bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md text-xs font-bold border border-emerald-200">
              Edunet Program Hub
            </span>
            <span className="text-slate-400 text-sm">|</span>
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">UN SDG 4 Aligned</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">Trainer Impact Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Monitor rural digital literacy milestones, offline caches, and regional parent feedback</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search student..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm shadow-xs focus:outline-none focus:border-emerald-500 w-64"
          />
        </div>
      </div>

      {/* Aggregate Analytical Metrics (SDG-4 Cards) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Class Attendance</p>
            <h3 className="text-3xl font-black text-slate-950 mt-1">{averageAttendance}%</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">↑ 2.1% from last month</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xl font-bold">
            📅
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Parent Trust Score</p>
            <h3 className="text-3xl font-black text-slate-950 mt-1">{averageParentConfidence} <span className="text-slate-300 text-lg">/ 5</span></h3>
            <p className="text-xs text-emerald-700 font-semibold mt-1">Highly Supportive Engagement</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xl font-bold">
            🤝
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Sandbox Graduates</p>
            <h3 className="text-3xl font-black text-slate-950 mt-1">{totalGraduatingStudents} <span className="text-slate-300 text-lg">/ {students.length}</span></h3>
            <p className="text-xs text-slate-400 font-medium mt-1">AI Portfolios Completed</p>
          </div>
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center text-xl font-bold">
            🎓
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Sync Items</p>
            <h3 className="text-3xl font-black text-slate-950 mt-1">{totalPendingOfflineSyncs}</h3>
            <p className={`text-xs font-semibold mt-1 ${totalPendingOfflineSyncs > 0 ? 'text-amber-600 animate-pulse' : 'text-slate-400'}`}>
              {totalPendingOfflineSyncs > 0 ? '⚠️ Offline queues active' : '✔ Live databases synchronized'}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${totalPendingOfflineSyncs > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
            📡
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">
        {/* Student Classroom Roster & Sync Control */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-slate-900">Student Performance Roster</h2>
            <span className="text-xs font-medium text-slate-500">Showing {filteredStudents.length} entries</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/20">
                  <th className="p-4 pl-6">Student</th>
                  <th className="p-4">Attendance</th>
                  <th className="p-4">Sandbox Level</th>
                  <th className="p-4">Parent Rating</th>
                  <th className="p-4">Offline Queue</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStudents.map((stud) => (
                  <tr key={stud.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-slate-900">{stud.name}</div>
                      <div className="text-xs text-slate-400">Last active: {stud.lastActive}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{stud.attendanceRate}%</span>
                        <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${stud.attendanceRate}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        stud.codeSandboxLevel === 3 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        Level {stud.codeSandboxLevel} / 3
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-amber-400 text-sm font-semibold">
                        ⭐ {stud.parentConfidenceScore}.0
                      </div>
                    </td>
                    <td className="p-4">
                      {stud.offlineSyncCount > 0 ? (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-bold animate-pulse">
                          {stud.offlineSyncCount} pending
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Synced</span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setShowParentModal(stud)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          💬 View Parent Feedback
                        </button>
                        
                        {stud.offlineSyncCount > 0 && (
                          <button
                            disabled={syncInProgress === stud.id}
                            onClick={() => handleTriggerManualSync(stud.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all disabled:bg-emerald-400 flex items-center gap-1.5 cursor-pointer"
                          >
                            {syncInProgress === stud.id ? (
                              <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                            ) : '📡'}
                            {syncInProgress === stud.id ? 'Syncing...' : 'Force Sync'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* UN SDG 4 Classroom Insights */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            <h2 className="font-extrabold text-slate-950 mb-3">🌍 Community Impact Audit</h2>
            <p className="text-slate-500 text-xs leading-relaxed mb-4">
              Tracking real-world qualitative improvements aligned with sustainable development goals to assure donor accountability.
            </p>
            <div className="space-y-4">
              <div className="border-l-4 border-emerald-500 pl-4 py-1">
                <h4 className="font-bold text-slate-900 text-sm">Digital Equity Milestone</h4>
                <p className="text-xs text-slate-500 mt-0.5">96% of regional girls unlocked Level-3 sandbox models.</p>
              </div>
              <div className="border-l-4 border-teal-500 pl-4 py-1">
                <h4 className="font-bold text-slate-900 text-sm">Parental Onboarding</h4>
                <p className="text-xs text-slate-500 mt-0.5">Parental feedback logged in Hindi and Marathi with positive local sentiment.</p>
              </div>
              <div className="border-l-4 border-sky-500 pl-4 py-1">
                <h4 className="font-bold text-slate-900 text-sm">Connectivity Resiliency</h4>
                <p className="text-xs text-slate-500 mt-0.5">80% of student progress successfully cached during regional networks dropouts.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-md">
            <h3 className="font-extrabold text-lg">Interactive AI Recruiter Bridge</h3>
            <p className="text-slate-400 text-xs leading-relaxed mt-1.5">
              Directly match sandbox graduates with hiring firms such as our regional CSR business networks.
            </p>
            <Link
              href="/recruiter"
              className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              👉 Open Recruiter Match Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Parent Testimonial Modal */}
      {showParentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-100">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">💬 Parent Testimonial Details</h3>
              <button
                onClick={() => setShowParentModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Student Name</span>
                <h4 className="font-bold text-slate-900 text-base mt-0.5">{showParentModal.name}</h4>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tech Confidence Rating</span>
                <div className="flex items-center text-amber-400 text-sm mt-1">
                  {'★'.repeat(showParentModal.parentConfidenceScore)}
                  {'☆'.repeat(5 - showParentModal.parentConfidenceScore)}
                  <span className="text-slate-400 text-xs ml-2 font-normal">({showParentModal.parentConfidenceScore} out of 5)</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Localized Testimony</span>
                <p className="text-slate-700 italic text-sm mt-1.5 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                  &ldquo;{showParentModal.parentTestimonial}&rdquo;
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowParentModal(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-semibold rounded-lg text-xs transition-all cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
