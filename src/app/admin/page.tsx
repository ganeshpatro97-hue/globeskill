"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import RoleGate from '@/components/RoleGate';
import { AdminMetrics, UserProfile, UserRole, Course } from '@/types/database';
import { getAdminMetrics, changeUserRole } from '@/lib/services/admin.service';
import { getAllCourses, updateCourseStatus } from '@/lib/services/course.service';
import { MockDatabaseStore } from '@/lib/supabase/client';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Download, 
  Search, 
  BarChart3, 
  FileSpreadsheet,
  Layers,
  HeartHandshake
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'approvals' | 'exports'>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [roleUpdatingId, setRoleUpdatingId] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [m, c] = await Promise.all([
        getAdminMetrics(),
        getAllCourses(true),
      ]);
      setMetrics(m);
      setCourses(c);
      setProfiles(MockDatabaseStore.getProfiles());
    }
    load();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setRoleUpdatingId(userId);
    try {
      await changeUserRole(userId, newRole);
      setProfiles(MockDatabaseStore.getProfiles());
      const m = await getAdminMetrics();
      setMetrics(m);
    } finally {
      setRoleUpdatingId(null);
    }
  };

  const handleApproveCourse = async (courseId: string) => {
    setStatusUpdatingId(courseId);
    try {
      await updateCourseStatus(courseId, 'published');
      const updated = await getAllCourses(true);
      setCourses(updated);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const filteredProfiles = profiles.filter((p) => {
    return (
      p.full_name.toLowerCase().includes(userSearch.toLowerCase()) ||
      p.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      p.user_role.toLowerCase().includes(userSearch.toLowerCase())
    );
  });

  return (
    <RoleGate allowedRoles={['admin']} portalName="NGO Admin Command Center">
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        
        {/* Top Command Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-800/60 border border-indigo-500/40 px-3 py-1 rounded-full text-xs font-semibold text-indigo-200 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Supreme Admin Access
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              NGO Executive &amp; Governance Center
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              National-level learning analytics, user role administration, course moderation, and export audit logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/api/admin/export?type=students"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-4 h-4" /> Export Student CSV
            </a>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Learners</span>
                <span className="text-2xl font-black text-slate-900">{metrics.totalStudents}+</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Active Trainers</span>
                <span className="text-2xl font-black text-slate-900">{metrics.totalTrainers}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Course Completions</span>
                <span className="text-2xl font-black text-slate-900">{metrics.courseCompletions}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <HeartHandshake className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Funds Raised</span>
                <span className="text-2xl font-black text-slate-900">₹{metrics.totalFundsRaised.toLocaleString('en-IN')}</span>
              </div>
            </div>

          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
          {[
            { id: 'overview', label: 'Analytics & Growth Charts', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'users', label: 'User Role Management', icon: <Users className="w-4 h-4" /> },
            { id: 'approvals', label: 'Course Catalog Moderation', icon: <Layers className="w-4 h-4" /> },
            { id: 'exports', label: 'Data Export Center', icon: <FileSpreadsheet className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Analytics & Growth Charts */}
        {activeTab === 'overview' && metrics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Monthly Enrollment Velocity */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> Monthly Student Enrollment Growth
              </h3>
              <p className="text-xs text-slate-500">
                New students registered per calendar month across all state cohorts.
              </p>

              {/* Bar Chart Visualizer */}
              <div className="pt-6 pb-2 space-y-4">
                {metrics.monthlyEnrollments.map((item) => (
                  <div key={item.month} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{item.month} 2026</span>
                      <span className="font-mono">{item.count} Students</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (item.count / 300) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Funding Allocation by Cause */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-rose-500" /> Philanthropic Capital Allocation by Cause
              </h3>
              <p className="text-xs text-slate-500">
                Breakdown of active grant contributions and public sponsorships.
              </p>

              <div className="pt-6 pb-2 space-y-4">
                {metrics.causeFunding.map((item) => (
                  <div key={item.cause} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{item.cause}</span>
                      <span className="font-mono text-emerald-800 font-bold">₹{item.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (item.amount / 120000) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: User Role Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" /> User Role Management
                </h2>
                <p className="text-xs text-slate-500">
                  Assign administrative, trainer, or student access to verified community members.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email, or role..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 px-2">User Profile</th>
                    <th className="pb-3 px-2">Location / Org</th>
                    <th className="pb-3 px-2">Current Role</th>
                    <th className="pb-3 px-2 text-right">Modify Access Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProfiles.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-2">
                        <span className="font-bold text-slate-900 block">{user.full_name}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{user.email}</span>
                      </td>
                      <td className="py-3 px-2 text-slate-600">
                        {user.location || 'India (Verified)'}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          user.user_role === 'admin' ? 'bg-indigo-100 text-indigo-800' :
                          user.user_role === 'trainer' ? 'bg-teal-100 text-teal-800' :
                          user.user_role === 'donor' ? 'bg-rose-100 text-rose-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {user.user_role}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <select
                          value={user.user_role}
                          disabled={roleUpdatingId === user.id}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                          className="text-xs bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 font-semibold focus:bg-white cursor-pointer"
                        >
                          <option value="student">Student</option>
                          <option value="trainer">Trainer</option>
                          <option value="donor">Donor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Course Approvals */}
        {activeTab === 'approvals' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-600" /> Course Catalog Moderation
              </h2>
              <p className="text-xs text-slate-500">
                Review courses created by volunteer instructors and approve for public catalog listing.
              </p>
            </div>

            <div className="space-y-4">
              {courses.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {c.category}
                      </span>
                      <span className="text-xs text-slate-500">{c.duration}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{c.title}</h4>
                    <p className="text-xs text-slate-600">{c.syllabus.length} Chapters • Instructor: {c.trainer_name || 'Lead Trainer'}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                      {c.status}
                    </span>
                    <button
                      onClick={() => handleApproveCourse(c.id)}
                      disabled={statusUpdatingId === c.id || c.status === 'published'}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      {c.status === 'published' ? 'Verified' : 'Approve & Publish'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Data Export Center */}
        {activeTab === 'exports' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" /> Data Export &amp; Audit Logs
              </h2>
              <p className="text-xs text-slate-500">
                Download structured CSV reports for government compliance, stakeholder updates, and non-profit audits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm text-slate-900">Student Progress &amp; Enrollment Report</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Full records of student IDs, enrolled courses, completion rates, and active timestamps.
                </p>
                <a
                  href="/api/admin/export?type=students"
                  download="globeskill_students_progress.csv"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <Download className="w-4 h-4" /> Download Student CSV
                </a>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm text-slate-900">Philanthropy &amp; Donation Financial Audit</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Complete transaction logs, 80G tax exemptions, donor emails, payment modes, and target causes.
                </p>
                <a
                  href="/api/admin/export?type=donations"
                  download="globeskill_donations_audit.csv"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <Download className="w-4 h-4" /> Download Donations CSV
                </a>
              </div>

            </div>
          </div>
        )}

      </div>
    </RoleGate>
  );
}
