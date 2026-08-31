"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import RoleGate from '@/components/RoleGate';
import { 
  Briefcase, 
  Search, 
  Filter, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  MapPin, 
  Plus, 
  Users, 
  Building2, 
  ArrowRight,
  ExternalLink,
  Mail,
  X
} from 'lucide-react';
import { StudentPortfolio, JobOpportunity } from '@/types/database';
import { getRecruiterCandidates, getJobOpportunities, createJobOpportunity } from '@/lib/services/portfolio.service';

export default function RecruiterPortalPage() {
  const [candidates, setCandidates] = useState<StudentPortfolio[]>([]);
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState<StudentPortfolio | null>(null);
  
  // Post Job modal state
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    company_name: 'TechMahindra CSR Foundation',
    title: '',
    role_type: 'Internship' as const,
    location: 'Remote / India Hybrid',
    stipend_range: '₹12,000 - ₹18,000 / month',
    required_skills: 'Python, Machine Learning, Web Dev',
    description: '',
    openings_count: 3,
  });

  useEffect(() => {
    async function loadData() {
      const [candList, jobList] = await Promise.all([
        getRecruiterCandidates({ skill: selectedSkill, search: searchQuery }),
        getJobOpportunities()
      ]);
      setCandidates(candList);
      setJobs(jobList);
    }
    loadData();
  }, [selectedSkill, searchQuery]);

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title || !newJob.description) return;

    await createJobOpportunity({
      recruiter_id: 'rec_csr_01',
      company_name: newJob.company_name,
      title: newJob.title,
      role_type: newJob.role_type,
      location: newJob.location,
      stipend_range: newJob.stipend_range,
      required_skills: newJob.required_skills.split(',').map((s) => s.trim()),
      description: newJob.description,
      openings_count: Number(newJob.openings_count) || 1,
    });

    const updatedJobs = await getJobOpportunities();
    setJobs(updatedJobs);
    setIsPostJobOpen(false);
    setNewJob({
      company_name: 'TechMahindra CSR Foundation',
      title: '',
      role_type: 'Internship',
      location: 'Remote / India Hybrid',
      stipend_range: '₹12,000 - ₹18,000 / month',
      required_skills: 'Python, Machine Learning, Web Dev',
      description: '',
      openings_count: 3,
    });
  };

  return (
    <RoleGate allowedRoles={['recruiter', 'admin']}>
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-300" /> CSR &amp; Vocational Recruiter Hub
                </span>
                <span className="text-xs text-slate-300">Phase 8: Employment Matchmaking</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Discover Verified Youth Tech &amp; AI Talent
              </h1>
              <p className="text-slate-300 text-sm max-w-2xl">
                Directly connect with high-potential students trained through GlobeSkill and Edunet Foundation in Python, AI/ML, and web engineering.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsPostJobOpen(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Post CSR Internship / Job
              </button>
            </div>
          </div>

          {/* Recruiter Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                <span>Verified Candidates</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{candidates.length + 18}</p>
              <p className="text-[11px] text-emerald-700 mt-1 font-medium">100% UN SDG &amp; AI Micro-Degree Verified</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                <span>Active CSR Roles</span>
                <Briefcase className="w-4 h-4 text-teal-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{jobs.length}</p>
              <p className="text-[11px] text-teal-700 mt-1 font-medium">Across 12 corporate partners</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                <span>Placement Success Rate</span>
                <Award className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">89.4%</p>
              <p className="text-[11px] text-amber-700 mt-1 font-medium">Under Section 80G CSR framework</p>
            </div>
          </div>

          {/* Candidate Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, city, skill..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <span className="text-xs font-semibold text-slate-500 shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Skill Filter:
              </span>
              {['all', 'Python', 'Machine Learning', 'Web Dev', 'Data'].map((skill) => (
                <button
                  key={skill}
                  onClick={() => setSelectedSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                    selectedSkill === skill
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {skill === 'all' ? 'All Skills' : skill}
                </button>
              ))}
            </div>
          </div>

          {/* Candidate Talent Grid */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              AI-Matched Candidate Profiles ({candidates.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((cand) => (
                <div
                  key={cand.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                          Ready for Internship
                        </span>
                        <h3 className="font-extrabold text-base text-slate-900 mt-1 group-hover:text-emerald-700 transition-colors">
                          {cand.full_name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">
                          {cand.match_score || 92}% Match
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{cand.headline}</p>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{cand.location}</span>
                    </div>

                    {/* Skill Badges */}
                    <div className="flex flex-wrap gap-1">
                      {cand.technical_skills.slice(0, 4).map((s, idx) => (
                        <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedCandidate(cand)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                    >
                      View AI Portfolio <ArrowRight className="w-3 h-3" />
                    </button>
                    <Link
                      href="/student/portfolio"
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                      title="Open Full Resume"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Job Opportunities Section */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              Active CSR Internship &amp; Apprenticeship Listings ({jobs.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                        {job.role_type}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">{job.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">{job.company_name}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{job.description}</p>

                  <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    Stipend: {job.stipend_range}
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                    <span>{job.openings_count} Openings</span>
                    <span className="font-bold text-slate-700">{job.applicants_count} Applicants</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal: View Full AI Portfolio */}
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
              
              <button
                onClick={() => setSelectedCandidate(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Verified Candidate Profile
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedCandidate.full_name}</h3>
                <p className="text-xs text-slate-500">{selectedCandidate.headline}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Profile Summary</h4>
                <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {selectedCandidate.summary}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Technical Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.technical_skills.map((s, idx) => (
                    <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-1 rounded-lg font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Projects</h4>
                <div className="space-y-2">
                  {selectedCandidate.projects.map((p) => (
                    <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <p className="font-bold text-slate-900">{p.title}</p>
                      <p className="text-slate-600 mt-0.5">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedCandidate.email}
                </span>
                <button
                  onClick={() => {
                    alert(`Interview invitation requested for ${selectedCandidate.full_name}! GlobeSkill CSR coordinator will connect within 24 hours.`);
                    setSelectedCandidate(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Schedule CSR Interview
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Modal: Post New Job */}
        {isPostJobOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 relative">
              
              <button
                onClick={() => setIsPostJobOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="text-lg font-bold text-slate-900">Post CSR Internship / Job</h3>
                <p className="text-xs text-slate-500">Reach verified young innovators from GlobeSkill programs.</p>
              </div>

              <form onSubmit={handlePostJob} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company / Foundation Name</label>
                  <input
                    type="text"
                    required
                    value={newJob.company_name}
                    onChange={(e) => setNewJob({ ...newJob, company_name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Junior AI & Computer Vision Intern"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Role Type</label>
                    <select
                      value={newJob.role_type}
                      onChange={(e) => setNewJob({ ...newJob, role_type: e.target.value as any })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    >
                      <option value="Internship">Internship</option>
                      <option value="Apprenticeship">Apprenticeship</option>
                      <option value="CSR Trainee">CSR Trainee</option>
                      <option value="Entry Level Tech">Entry Level Tech</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Stipend Range</label>
                    <input
                      type="text"
                      value={newJob.stipend_range}
                      onChange={(e) => setNewJob({ ...newJob, stipend_range: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Required Skills (comma separated)</label>
                  <input
                    type="text"
                    value={newJob.required_skills}
                    onChange={(e) => setNewJob({ ...newJob, required_skills: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the learning outcomes, mentoring structure, and responsibilities..."
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPostJobOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs"
                  >
                    Publish Listing
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
