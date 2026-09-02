"use client";

import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';
import SystemStatusIndicator from '@/components/SystemStatus';
import { useTranslation } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useTranslation();

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
              <span className="font-extrabold text-white text-lg tracking-tight">{t('brand')}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              {t('footerAbout')}
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> {t('taxExemptionRegistered')}
            </div>
          </div>

          {/* Col 2: Programs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">{t('programsTitle')}</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/courses" className="hover:text-white transition-colors">{t('AI Micro Degree for Young Innovators')}</Link></li>
              <li><Link href="/courses" className="hover:text-white transition-colors">{t('IBM SkillsBuild Tech Foundations')}</Link></li>
              <li><Link href="/courses" className="hover:text-white transition-colors">{t('AI & Data Careers for Women')}</Link></li>
              <li><Link href="/courses" className="hover:text-white transition-colors">{t('Full-Stack Web & Creative Coding')}</Link></li>
            </ul>
          </div>

          {/* Col 3: Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">{t('rolePortalsTitle')}</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/student" className="hover:text-white transition-colors">{t('roleStudentPortal')}</Link></li>
              <li><Link href="/trainer" className="hover:text-white transition-colors">{t('roleTrainerStudio')}</Link></li>
              <li><Link href="/donor" className="hover:text-white transition-colors">{t('roleDonorHub')}</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">{t('roleAdminCenter')}</Link></li>
            </ul>
          </div>

          {/* Col 4: Community & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">{t('getInvolvedTitle')}</h4>
            <p className="text-xs text-slate-400 mb-3">
              {t('getInvolvedDesc')}
            </p>
            <Link
              href="/donate"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <Heart className="w-3.5 h-3.5 text-rose-300" />
              {t('supportMission')}
            </Link>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {t('copyrightNotice')}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Link href="/api/health" className="hover:text-white font-mono text-[11px] text-slate-300">
                {t('apiHealth')}
              </Link>
              <SystemStatusIndicator compact className="bg-slate-800/80 border-slate-700 text-slate-200" />
            </div>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" /> {t('builtForImpact')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
