"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/database';
import { ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';

interface RoleGateProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  portalName: string;
}

export default function RoleGate({ allowedRoles, children, portalName }: RoleGateProps) {
  const { role, loading, switchDemoRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-slate-500">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium">Verifying authorization for {portalName}...</p>
      </div>
    );
  }

  const isAllowed = role && (allowedRoles.includes(role) || role === 'admin');

  if (!isAllowed) {
    return (
      <div className="max-w-xl mx-auto my-16 px-4">
        <div className="bg-white border border-amber-200 rounded-2xl p-8 shadow-sm text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Restricted</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            The <strong>{portalName}</strong> is reserved for authorized <strong>{allowedRoles.join(', ')}</strong> accounts. Your current active role is <code className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-800 text-xs font-semibold">{role || 'Unauthenticated'}</code>.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Switch Demo Role to Continue:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['student', 'trainer', 'admin', 'donor'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => switchDemoRole(r)}
                  className={`p-2 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer border ${
                    role === r
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Return to Homepage
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              Log in with Another Account <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
