"use client";

// GlobeSkill Phase 5: NGO Administration Dashboard (Next.js / React / TypeScript)
// This dashboard provides NGO Administrators with comprehensive analytics,
// donor tracking, user management, and course approval workflows.

import React, { useState } from 'react';
import RoleGate from '@/components/RoleGate';

// Interfaces aligned with our Supabase schemas (profiles, courses, donations)
interface AdminStat {
  label: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  color: string;
}

interface UserManagementRow {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'trainer' | 'admin';
  location: string;
  status: 'active' | 'pending' | 'inactive';
}

interface PendingCourseApproval {
  id: string;
  title: string;
  trainerName: string;
  duration: string;
  skillLevel: string;
  submittedAt: string;
}

interface RecentDonation {
  id: string;
  donorName: string;
  amount: number;
  cause: string;
  date: string;
  panStatus: 'verified' | 'pending' | 'not_applicable';
}

export default function NGOAdminDashboard() {
  // Local active tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'approvals' | 'donations'>('overview');
  
  // Simulated database states
  const [users, setUsers] = useState<UserManagementRow[]>([
    { id: '1', name: 'Aarav Sharma', email: 'aarav@globeskill.org', role: 'student', location: 'Delhi', status: 'active' },
    { id: '2', name: 'Priya Patel', email: 'priya@globeskill.org', role: 'trainer', location: 'Mumbai', status: 'active' },
    { id: '3', name: 'Rohan Verma', email: 'rohan@globeskill.org', role: 'student', location: 'Bangalore', status: 'active' },
    { id: '4', name: 'Ananya Rao', email: 'ananya@globeskill.org', role: 'trainer', location: 'Hyderabad', status: 'pending' },
    { id: '5', name: 'Vikram Singh', email: 'vikram@globeskill.org', role: 'admin', location: 'Delhi', status: 'active' },
    { id: '6', name: 'Sneha Reddy', email: 'sneha@globeskill.org', role: 'student', location: 'Pune', status: 'inactive' },
  ]);

  const [pendingApprovals, setPendingApprovals] = useState<PendingCourseApproval[]>([
    {
      id: 'c1',
      title: 'Advanced AI and Prompt Engineering for Rural Educators',
      trainerName: 'Priya Patel',
      duration: '4 Weeks',
      skillLevel: 'Intermediate',
      submittedAt: '2026-08-28',
    },
    {
      id: 'c2',
      title: 'Cloud Security and Infrastructure Best Practices',
      trainerName: 'Rajesh Kumar',
      duration: '8 Weeks',
      skillLevel: 'Advanced',
      submittedAt: '2026-08-29',
    },
  ]);

  const [donations] = useState<RecentDonation[]>([
    { id: 'tx101', donorName: 'TechPower Corp', amount: 500000, cause: 'AI Careers for Women Cohort', date: '2026-08-29', panStatus: 'verified' },
    { id: 'tx102', donorName: 'Aditya Birla CSR', amount: 350000, cause: 'Sponsor 100 students for AI training', date: '2026-08-28', panStatus: 'verified' },
    { id: 'tx103', donorName: 'Amit Mehra (Individual)', amount: 15000, cause: 'General Fund', date: '2026-08-27', panStatus: 'verified' },
    { id: 'tx104', donorName: 'Sanjana Sen (Individual)', amount: 25000, cause: 'IBM SkillsBuild Support', date: '2026-08-26', panStatus: 'pending' },
  ]);

  const [systemAlert, setSystemAlert] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const triggerAlert = (message: string, type: 'success' | 'info') => {
    setSystemAlert({ message, type });
    setTimeout(() => setSystemAlert(null), 5000);
  };

  // Administrative actions
  const handleUserStatusChange = (userId: string, newStatus: 'active' | 'pending' | 'inactive') => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    triggerAlert(`User status updated to ${newStatus.toUpperCase()}`, 'success');
  };

  const handleRoleChange = (userId: string, newRole: 'student' | 'trainer' | 'admin') => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    triggerAlert(`User role upgraded to ${newRole.toUpperCase()}`, 'success');
  };

  const handleApproveCourse = (courseId: string, title: string) => {
    setPendingApprovals(pendingApprovals.filter(c => c.id !== courseId));
    triggerAlert(`Course "${title}" has been successfully approved and added to the GlobeSkill curriculum!`, 'success');
  };

  const handleRejectCourse = (courseId: string, title: string) => {
    setPendingApprovals(pendingApprovals.filter(c => c.id !== courseId));
    triggerAlert(`Course "${title}" has been declined. Feedback form sent to the trainer.`, 'info');
  };

  // KPI Dashboard Statistics
  const adminStats: AdminStat[] = [
    { label: 'Total Enrolled Learners', value: '12,450', change: '+18% MoM', changeType: 'increase', color: 'indigo' },
    { label: 'Certified NGO Trainers', value: '84', change: '+6 new this month', changeType: 'increase', color: 'blue' },
    { label: 'Funds Mobilized (INR)', value: '₹48,25,000', change: '80% of Q3 Target', changeType: 'neutral', color: 'emerald' },
    { label: 'Active Learning Cohorts', value: '14 Centers', change: '100% active state', changeType: 'neutral', color: 'purple' },
  ];

  return (
    <RoleGate allowedRoles={['admin']} portalName="NGO Admin Control Center">
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
        
        {/* Top Admin Header */}
        <header className="bg-slate-950 text-white shadow-md px-6 py-4 flex flex-col md:flex-row justify-between items-center border-b border-slate-800">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="bg-emerald-500 text-slate-950 font-bold p-2.5 rounded-lg text-lg tracking-wider">GS</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">GlobeSkill Control Center</h1>
              <p className="text-xs text-slate-400">NGO Administration Dashboard • UN ECOSOC Consultative Status</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              Database Live Connect
            </span>
            <div className="text-right text-xs">
              <p className="font-semibold text-slate-200">Super Administrator</p>
              <p className="text-slate-400">admin@globeskill.org</p>
            </div>
          </div>
        </header>

        {/* Main Admin Workspace */}
        <div className="flex-1 flex flex-col md:flex-row">
          
          {/* Navigation Sidebar */}
          <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 border-r border-slate-800">
            <div className="p-4 border-b border-slate-800">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Main Dashboard</p>
            </div>
            <nav className="p-2 space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                <span>Analytics Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  activeTab === 'users' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                <span>User Profiles</span>
              </button>
              <button
                onClick={() => setActiveTab('approvals')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  activeTab === 'approvals' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Course Approvals</span>
                {pendingApprovals.length > 0 && (
                  <span className="ml-auto bg-amber-500 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full animate-bounce">
                    {pendingApprovals.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('donations')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  activeTab === 'donations' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span>Donations &amp; CSR Logs</span>
              </button>
            </nav>

            <div className="p-4 mt-8 border-t border-slate-800">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">NGO Compliances</p>
              <div className="bg-slate-800/50 p-3 rounded-lg space-y-1.5 text-[11px] text-slate-400">
                <p>• 12A Status: <span className="text-emerald-400 font-semibold">Active</span></p>
                <p>• 80G Status: <span className="text-emerald-400 font-semibold">Verified</span></p>
                <p>• CSR Form 1: <span className="text-teal-400">Reg: CSR000302</span></p>
              </div>
            </div>
          </aside>

          {/* Dynamic Admin Body Workspace */}
          <main className="flex-1 p-6 overflow-y-auto">
            
            {/* Dynamic Interactive Notifications */}
            {systemAlert && (
              <div className={`mb-6 p-4 rounded-xl border flex items-center justify-between shadow-sm animate-in fade-in ${
                systemAlert.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-sm font-medium">{systemAlert.message}</p>
                </div>
                <button onClick={() => setSystemAlert(null)} className="text-xs font-bold hover:underline cursor-pointer">Dismiss</button>
              </div>
            )}

            {/* TAB 1: OVERVIEW & ANALYTICS */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h2>
                  <p className="text-sm text-slate-500">Real-time indicators across active learning centers and upskilling campaigns.</p>
                </div>

                {/* KPI Badges Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {adminStats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                        <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{stat.value}</h3>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                        <span className={`font-semibold ${
                          stat.changeType === 'increase' ? 'text-emerald-600' : 'text-emerald-700'
                        }`}>{stat.change}</span>
                        <span className="text-slate-400">Latest Live Sync</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts & Impact Framework Info Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Visual Chart: Campaign Engagement */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">Student Engagement by Course Track</h4>
                        <p className="text-xs text-slate-400">Total verified enrollments distributed dynamically across major modules.</p>
                      </div>
                      <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded">Active Q3</span>
                    </div>
                    
                    {/* Visual Chart Bars */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span className="font-semibold">AI Micro Degree &amp; Full-Stack Coding</span>
                          <span>4,820 Learners (39%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: '39%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span className="font-semibold">IBM SkillsBuild Technology Fundamentals</span>
                          <span>5,180 Learners (41%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
                          <div className="bg-teal-500 h-full rounded-full" style={{ width: '41%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span className="font-semibold">AI Careers for Women Cohorts</span>
                          <span>2,450 Learners (20%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
                          <div className="bg-rose-500 h-full rounded-full" style={{ width: '20%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SDG Targets Compliance Display */}
                  <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold tracking-widest px-2 py-0.5 rounded-full uppercase">UN SDG Impact</span>
                      <h4 className="font-bold text-lg mt-3">Target Metrics Alignment</h4>
                      <p className="text-xs text-slate-400 mt-2">
                        GlobeSkill directly satisfies UN SDGs through structured AI training programs.
                      </p>
                      
                      <div className="mt-5 space-y-3 text-xs">
                        <div className="flex items-center space-x-3 p-2 bg-slate-800/50 rounded-lg">
                          <span className="p-1.5 bg-orange-600 text-white font-bold rounded">04</span>
                          <div>
                            <p className="font-semibold">Quality Education (Goal 4)</p>
                            <p className="text-[10px] text-slate-400">10k+ free certifications</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-2 bg-slate-800/50 rounded-lg">
                          <span className="p-1.5 bg-rose-700 text-white font-bold rounded">08</span>
                          <div>
                            <p className="font-semibold">Decent Work &amp; Economy (Goal 8)</p>
                            <p className="text-[10px] text-slate-400">85% local career placements</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-800 text-center text-[10px] text-slate-500">
                      Edunet Joint Certification Framework Supported
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 2: USER PROFILE MANAGEMENT */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-2xl font-bold text-slate-900">User Profile Management</h2>
                  <p className="text-sm text-slate-500">Manage user authorization and verify trainer profiles on the unified database.</p>
                </div>

                {/* Database Table Users */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                      <thead className="bg-slate-50 text-slate-400 font-semibold uppercase text-xs">
                        <tr>
                          <th className="px-6 py-3.5">Name / Email</th>
                          <th className="px-6 py-3.5">Assigned Role</th>
                          <th className="px-6 py-3.5">Region</th>
                          <th className="px-6 py-3.5">Status</th>
                          <th className="px-6 py-3.5 text-right">Administrative Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-600">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">
                              <p className="font-bold text-slate-900">{user.name}</p>
                              <p className="text-xs text-slate-400">{user.email}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                                user.role === 'admin' ? 'bg-red-50 text-red-700' : user.role === 'trainer' ? 'bg-teal-50 text-teal-700' : 'bg-emerald-50 text-emerald-700'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs font-medium">{user.location}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                user.status === 'active' ? 'bg-emerald-100 text-emerald-800' : user.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                              }`}>
                                <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                                  user.status === 'active' ? 'bg-emerald-500' : user.status === 'pending' ? 'bg-amber-500' : 'bg-slate-400'
                                }`}></span>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-1.5">
                              {user.status === 'pending' && (
                                <button
                                  onClick={() => handleUserStatusChange(user.id, 'active')}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1 rounded font-bold transition-all cursor-pointer"
                                >
                                  Approve Account
                                </button>
                              )}
                              {user.role === 'student' && (
                                <button
                                  onClick={() => handleRoleChange(user.id, 'trainer')}
                                  className="border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs px-2.5 py-1 rounded font-bold transition-all cursor-pointer"
                                >
                                  Upgrade to Trainer
                                </button>
                              )}
                              {user.status === 'active' && (
                                <button
                                  onClick={() => handleUserStatusChange(user.id, 'inactive')}
                                  className="text-slate-400 hover:text-red-600 text-xs px-2.5 py-1 rounded font-semibold transition-all cursor-pointer"
                                >
                                  Deactivate
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: COURSE APPROVALS */}
            {activeTab === 'approvals' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-2xl font-bold text-slate-900">Course Verification &amp; Approvals</h2>
                  <p className="text-sm text-slate-500">Review technical materials and syllabus modules submitted by active trainers before listing them publicly.</p>
                </div>

                {pendingApprovals.length === 0 ? (
                  <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center shadow-sm">
                    <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    <p className="font-bold text-slate-700">No Pending Approvals</p>
                    <p className="text-xs text-slate-400 mt-1">All newly submitted technical programs are active and verified on the database.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingApprovals.map((course) => (
                      <div key={course.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-bold tracking-wider px-2 py-0.5 rounded-full uppercase">Pending Validation</span>
                            <span className="text-xs text-slate-400">Submitted: {course.submittedAt}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-lg mb-2">{course.title}</h4>
                          <div className="space-y-2 text-xs text-slate-500">
                            <p>👤 <span className="font-semibold text-slate-700">Trainer:</span> {course.trainerName}</p>
                            <p>⏳ <span className="font-semibold text-slate-700">Duration:</span> {course.duration}</p>
                            <p>📈 <span className="font-semibold text-slate-700">Skill Level:</span> {course.skillLevel}</p>
                          </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-end space-x-3">
                          <button
                            onClick={() => handleRejectCourse(course.id, course.title)}
                            className="text-slate-400 hover:text-slate-600 text-xs px-3 py-1.5 font-bold transition-all cursor-pointer"
                          >
                            Decline &amp; Resubmit
                          </button>
                          <button
                            onClick={() => handleApproveCourse(course.id, course.title)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-1.5 rounded-lg font-bold transition-all shadow-sm cursor-pointer"
                          >
                            Verify &amp; Approve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: DONATIONS & TRANSACTIONS LOGS */}
            {activeTab === 'donations' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Donation &amp; CSR Mobilization Ledger</h2>
                    <p className="text-sm text-slate-500">Transaction records matching CSR funding logs to registered technical courses.</p>
                  </div>
                  <div className="mt-3 sm:mt-0 flex space-x-2">
                    <span className="inline-flex px-3 py-1 rounded bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                      FCRA Compliant Account
                    </span>
                  </div>
                </div>

                {/* Transactions Ledger Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                      <thead className="bg-slate-50 text-slate-400 font-semibold uppercase text-xs">
                        <tr>
                          <th className="px-6 py-3.5">Transaction ID</th>
                          <th className="px-6 py-3.5">Donor Name</th>
                          <th className="px-6 py-3.5">Amount (INR)</th>
                          <th className="px-6 py-3.5">Allocated Program / Campaign</th>
                          <th className="px-6 py-3.5">Receipt Date</th>
                          <th className="px-6 py-3.5">80G Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-600">
                        {donations.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{tx.id}</td>
                            <td className="px-6 py-4 font-bold text-slate-900">{tx.donorName}</td>
                            <td className="px-6 py-4 text-emerald-600 font-extrabold text-sm">₹{tx.amount.toLocaleString('en-IN')}</td>
                            <td className="px-6 py-4 text-xs font-semibold">{tx.cause}</td>
                            <td className="px-6 py-4 text-xs font-medium">{tx.date}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                tx.panStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {tx.panStatus === 'verified' ? '✓ Verified PAN' : '⏰ Pending Verification'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* Footer bar */}
        <footer className="bg-slate-100 border-t border-slate-200 py-3 text-center text-xs text-slate-400">
          GlobeSkill Multi-Tenant Admin Panel • Version 2.0.0 • UN ECOSOC Consultative Status
        </footer>

      </div>
    </RoleGate>
  );
}
