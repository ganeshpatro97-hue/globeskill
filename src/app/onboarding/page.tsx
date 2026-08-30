"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Sparkles, 
  MapPin, 
  GraduationCap, 
  Check, 
  ArrowRight, 
  BookMarked 
} from 'lucide-react';

const SKILL_OPTIONS = [
  'Python Programming',
  'Artificial Intelligence & ML',
  'Generative AI & Prompting',
  'Web Development (HTML/CSS/JS)',
  'Cybersecurity & Safe Internet',
  'Data Science & Spreadsheets',
  'Cloud Computing Foundations',
  'Robotics & Hardware Tinkering',
];

export default function OnboardingWizard() {
  const router = useRouter();
  const { profile, updateUser, role } = useAuth();

  const [location, setLocation] = useState(profile?.location || 'New Delhi, India');
  const [education, setEducation] = useState(profile?.education_background || 'High School / Class 10');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(profile?.skill_interests || ['Python Programming', 'Artificial Intelligence & ML']);
  const [saving, setSaving] = useState(false);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser({
        location,
        education_background: education,
        skill_interests: selectedSkills,
      });

      if (role === 'trainer') router.push('/trainer');
      else if (role === 'admin') router.push('/admin');
      else if (role === 'donor') router.push('/donor');
      else router.push('/student');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Progress Step Bar */}
        <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200">
          <span className="font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" /> Step 2 of 2: Profile Personalization
          </span>
          <span className="font-semibold text-emerald-900">90% Complete</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Tell us about your learning goals
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            We tailor course recommendations and mentor matchings based on your profile.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Location / City
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Patna, Bihar, India"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Educational Background */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-teal-600" /> Educational Background / Grade
            </label>
            <select
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Middle School (Class 6-8)">Middle School (Class 6-8)</option>
              <option value="High School (Class 9-10)">High School (Class 9-10)</option>
              <option value="Senior Secondary (Class 11-12)">Senior Secondary (Class 11-12)</option>
              <option value="Undergraduate / College Student">Undergraduate / College Student</option>
              <option value="Educator / Teacher">Educator / Teacher</option>
              <option value="Self-Taught / Vocational Learner">Self-Taught / Vocational Learner</option>
            </select>
          </div>

          {/* Digital Skill Interests */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <BookMarked className="w-3.5 h-3.5 text-indigo-600" /> Skills You Want to Learn / Teach
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SKILL_OPTIONS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{skill}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Setting Up Your Portal...' : 'Complete Setup & Launch Portal'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
