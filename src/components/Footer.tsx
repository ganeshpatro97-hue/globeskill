import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                G
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">GlobeSkill</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              A grassroots technology non-profit bringing world-class AI, computing literacy, and career mentorship to underserved children worldwide.
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> 80G Tax Exemption Registered
            </div>
          </div>

          {/* Col 2: Programs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Programs &amp; Skills</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/courses" className="hover:text-white transition-colors">AI Micro Degree for Young Innovators</Link></li>
              <li><Link href="/courses" className="hover:text-white transition-colors">IBM SkillsBuild Tech Foundations</Link></li>
              <li><Link href="/courses" className="hover:text-white transition-colors">AI &amp; Data Careers for Women</Link></li>
              <li><Link href="/courses" className="hover:text-white transition-colors">Full-Stack Web &amp; Creative Coding</Link></li>
            </ul>
          </div>

          {/* Col 3: Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Role Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/student" className="hover:text-white transition-colors">Student Learning Portal</Link></li>
              <li><Link href="/trainer" className="hover:text-white transition-colors">Trainer Course Studio</Link></li>
              <li><Link href="/donor" className="hover:text-white transition-colors">Donor Impact &amp; Receipts Hub</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">NGO Admin Command Center</Link></li>
            </ul>
          </div>

          {/* Col 4: Community & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Get Involved</h4>
            <p className="text-xs text-slate-400 mb-3">
              Help us sponsor 1,000+ underserved learners with hands-on AI learning kits and mentor access.
            </p>
            <Link
              href="/donate"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <Heart className="w-3.5 h-3.5 text-rose-300" />
              Support Our Mission
            </Link>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} GlobeSkill Foundation. Empowering technology &amp; AI education for every child.</p>
          <div className="flex items-center gap-4">
            <Link href="/api/health" className="hover:text-white font-mono text-[11px] text-slate-300">
              API Health Status: /api/health
            </Link>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" /> Built for Global Impact
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
