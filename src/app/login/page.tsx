"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/database';
import { 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Heart, 
  ArrowRight, 
  AlertCircle, 
  KeyRound 
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchDemoRole } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoAccounts = [
    {
      role: 'student' as UserRole,
      title: 'Demo Student',
      email: 'student.rohit@globeskill.org',
      icon: <GraduationCap className="w-4 h-4 text-emerald-600" />,
      targetPath: '/student',
    },
    {
      role: 'trainer' as UserRole,
      title: 'Demo Trainer',
      email: 'trainer.priya@globeskill.org',
      icon: <BookOpen className="w-4 h-4 text-teal-600" />,
      targetPath: '/trainer',
    },
    {
      role: 'admin' as UserRole,
      title: 'Demo NGO Admin',
      email: 'admin@globeskill.org',
      icon: <ShieldCheck className="w-4 h-4 text-blue-600" />,
      targetPath: '/admin',
    },
    {
      role: 'donor' as UserRole,
      title: 'Demo Donor',
      email: 'donor.vikram@techgives.org',
      icon: <Heart className="w-4 h-4 text-rose-500" />,
      targetPath: '/donor',
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      router.push('/student');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials. Try using one of the demo accounts below.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoQuickFill = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword('••••••••');
    switchDemoRole(acc.role);
    router.push(acc.targetPath);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl mx-auto mb-3 shadow-xs">
            G
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="mt-2 text-xs text-slate-600">
            Log in to access your GlobeSkill learning or management portal.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student.rohit@globeskill.org"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <span className="text-[11px] text-emerald-700 hover:underline cursor-pointer">Forgot password?</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Accounts */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            <KeyRound className="w-3.5 h-3.5 text-emerald-600" /> Or Instant 1-Click Demo Sign In:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => handleDemoQuickFill(acc)}
                className="p-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1">
                  {acc.icon}
                  <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                    {acc.title}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">{acc.email}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center pt-2 text-xs text-slate-600">
          Do not have an account yet?{' '}
          <Link href="/signup" className="text-emerald-700 font-bold hover:underline">
            Sign Up
          </Link>
        </div>

      </div>
    </div>
  );
}
