// GlobeSkill Phase 2: Supabase Client Integration (Next.js / TypeScript)
// This file initializes and exports the Supabase client for use in frontend 
// components or backend API handlers, including strict type safety checks.

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder-') &&
  !supabaseUrl.includes('your-supabase-project')
);

// Validation check to prevent silent configuration failures during production deployment
if (!supabaseUrl || !supabaseAnonKey || !isSupabaseConfigured) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.warn(
      '⚠️ Supabase Connection Notice: Running with development defaults.\n' +
      'Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to connect to your live Supabase cloud database.'
    );
  }
}

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder-project-url.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

export const supabaseAdmin: SupabaseClient | null = (supabaseUrl && supabaseServiceKey && !supabaseServiceKey.includes('your-'))
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

// Helper TypeScript Interfaces for Database Entities
export type UserRole = 'student' | 'trainer' | 'admin' | 'donor';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  user_role: UserRole;
  location?: string;
  educational_background?: string;
  education_background?: string;
  skill_interests?: string[];
  created_at: string;
  updated_at?: string;
}

export interface TechnicalCourse {
  id: string;
  title: string;
  description: string;
  duration: string;
  skill_level: string;
  curriculum: string[];
  created_by?: string;
  created_at: string;
}

export { MockDatabaseStore } from './supabase/client';
