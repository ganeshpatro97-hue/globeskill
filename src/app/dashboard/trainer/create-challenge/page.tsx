"use client";

import React from 'react';
import Link from 'next/link';
import ChallengeCreatorForm from '@/components/ChallengeCreatorForm';
import RoleGate from '@/components/RoleGate';
import { ChevronLeft } from 'lucide-react';

export default function CreateChallengePage() {
  return (
    <RoleGate allowedRoles={['trainer', 'admin']} portalName="Trainer Challenge Studio">
      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 pt-6">
          <Link
            href="/trainer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Trainer Dashboard
          </Link>
        </div>
        <ChallengeCreatorForm />
      </div>
    </RoleGate>
  );
}
