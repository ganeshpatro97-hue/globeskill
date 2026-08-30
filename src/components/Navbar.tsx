"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/database';
import { 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  Heart, 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  Menu, 
  X,
  Compass
} from 'lucide-react';

export default function Navbar() {
  const { profile, role, switchDemoRole, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const getPortalLink = () => {
    if (role === 'trainer') return '/trainer';
    if (role === 'admin') return '/admin';
    if (role === 'donor') return '/donor';
    return '/student';
  };

  const getPortalLabel = () => {
    if (role === 'trainer') return 'Trainer Studio';
    if (role === 'admin') return 'Admin Portal';
    if (role === 'donor') return 'Donor Hub';
    return 'Student Portal';
  };

  const rolesList: { id: UserRole; label: string; icon: React.ReactNode }[] = [
    { id: 'student', label: 'Student', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'trainer', label: 'Trainer', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'admin', label: 'Admin', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'donor', label: 'Donor', icon: <Heart className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
              G
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight group-hover:text-emerald-700 transition-colors">
                GlobeSkill
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                AI &amp; Tech Education
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link 
            href="/courses" 
            className={`flex items-center gap-1.5 hover:text-emerald-700 transition-colors ${pathname === '/courses' ? 'text-emerald-700 font-semibold' : ''}`}
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            Courses
          </Link>
          <Link 
            href="/donate" 
            className={`flex items-center gap-1.5 hover:text-emerald-700 transition-colors ${pathname === '/donate' ? 'text-emerald-700 font-semibold' : ''}`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            Support Us
          </Link>
          <Link 
            href="/#status" 
            className="hover:text-slate-900 transition-colors text-xs text-slate-500 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md"
          >
            API Status
          </Link>
        </nav>

        {/* Right Section: Role Switcher & User Profile */}
        <div className="hidden lg:flex items-center gap-3">
          
          {/* Quick Demo Role Switcher */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-lg border border-slate-200 text-xs">
            <span className="text-[11px] font-medium text-slate-500 px-2 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-slate-600" /> Demo Role:
            </span>
            {rolesList.map((r) => (
              <button
                key={r.id}
                onClick={() => switchDemoRole(r.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  role === r.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {r.icon}
                {r.label}
              </button>
            ))}
          </div>

          {/* Active User Portal Link */}
          {profile ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <Link
                href={getPortalLink()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-all shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {getPortalLabel()}
              </Link>
              <button
                onClick={logout}
                title="Sign out"
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs"
              >
                Sign Up
              </Link>
            </div>
          )}

        </div>

        {/* Mobile menu toggle */}
        <div className="flex lg:hidden items-center gap-2">
          {profile && (
            <Link
              href={getPortalLink()}
              className="px-3 py-1 bg-emerald-600 text-white rounded-md text-xs font-bold"
            >
              {role?.toUpperCase()}
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4">
          <div className="flex flex-col space-y-2">
            <Link 
              href="/courses" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-md"
            >
              Browse Courses
            </Link>
            <Link 
              href="/donate" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-md flex items-center justify-between"
            >
              <span>Support Us (Donate)</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </Link>
            <Link 
              href={getPortalLink()} 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-sm font-semibold text-emerald-800 bg-emerald-50 rounded-md"
            >
              Open {getPortalLabel()} ({role})
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Switch Demo Role</p>
            <div className="grid grid-cols-2 gap-2">
              {rolesList.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    switchDemoRole(r.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 border ${
                    role === r.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {r.icon}
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
