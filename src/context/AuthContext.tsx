"use client";

import React, { createContext, useContext, useState } from 'react';
import { UserProfile, UserRole } from '@/types/database';
import { signUpUser, loginUser, updateUserProfile, SignUpParams } from '@/lib/services/auth.service';
import { MockDatabaseStore } from '@/lib/supabase/client';

interface AuthContextType {
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (params: SignUpParams) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ACCOUNTS: Record<UserRole, Partial<UserProfile>> = {
  student: {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'student.rohit@globeskill.org',
    full_name: 'Rohit Kumar (Student)',
    user_role: 'student',
    location: 'Patna, Bihar',
    education_background: 'High School (Class 10)',
    skill_interests: ['Python Basics', 'Web Dev', 'Robotics'],
  },
  trainer: {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'trainer.priya@globeskill.org',
    full_name: 'Priya Patel (Lead Instructor)',
    user_role: 'trainer',
    location: 'Bengaluru, India',
    education_background: 'Senior AI Engineer & Educator',
    skill_interests: ['Python', 'Machine Learning', 'Computer Vision'],
  },
  admin: {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'admin@globeskill.org',
    full_name: 'Aarav Sharma (Admin)',
    user_role: 'admin',
    location: 'New Delhi, India',
    education_background: 'M.Tech Computer Science',
    skill_interests: ['AI Systems', 'Curriculum Design'],
  },
  donor: {
    id: '00000000-0000-0000-0000-000000000004',
    email: 'donor.vikram@techgives.org',
    full_name: 'Vikram Malhotra (Global Funder)',
    user_role: 'donor',
    location: 'Mumbai, India',
    education_background: 'Tech Philanthropist',
    skill_interests: ['Rural Digital Labs', 'AI for Kids'],
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return DEMO_ACCOUNTS.student as UserProfile;
    try {
      const stored = localStorage.getItem('globeskill_active_user');
      if (stored) return JSON.parse(stored);
      const defaultStudent = DEMO_ACCOUNTS.student as UserProfile;
      localStorage.setItem('globeskill_active_user', JSON.stringify(defaultStudent));
      return defaultStudent;
    } catch {
      return DEMO_ACCOUNTS.student as UserProfile;
    }
  });

  const [loading, setLoading] = useState<boolean>(false);

  const login = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      setProfile(user);
      localStorage.setItem('globeskill_active_user', JSON.stringify(user));
    } finally {
      setLoading(false);
    }
  };

  const signup = async (params: SignUpParams) => {
    setLoading(true);
    try {
      const newUser = await signUpUser(params);
      setProfile(newUser);
      localStorage.setItem('globeskill_active_user', JSON.stringify(newUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setProfile(null);
    localStorage.removeItem('globeskill_active_user');
  };

  const switchDemoRole = (role: UserRole) => {
    const demo = DEMO_ACCOUNTS[role] as UserProfile;
    const profiles = MockDatabaseStore.getProfiles();
    const existing = profiles.find((p) => p.user_role === role) || demo;
    setProfile(existing);
    localStorage.setItem('globeskill_active_user', JSON.stringify(existing));
  };

  const updateUser = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = await updateUserProfile(profile.id, updates);
    setProfile(updated);
    localStorage.setItem('globeskill_active_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        profile,
        role: profile?.user_role || null,
        loading,
        login,
        signup,
        logout,
        switchDemoRole,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
