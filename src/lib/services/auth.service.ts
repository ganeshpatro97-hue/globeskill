import { UserProfile, UserRole } from '@/types/database';
import { supabase, isSupabaseConfigured, MockDatabaseStore } from '@/lib/supabase/client';

export interface SignUpParams {
  email: string;
  password?: string;
  fullName: string;
  role: UserRole;
  location?: string;
  educationBackground?: string;
  skillInterests?: string[];
}

export async function signUpUser(params: SignUpParams): Promise<UserProfile> {
  const { email, password, fullName, role, location, educationBackground, skillInterests } = params;

  // 1. Try server-side API registration with auto-confirmation
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: password || 'GlobeSkillPass@2026',
          fullName,
          userRole: role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      // Automatically sign in the user to create client session
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.auth.signInWithPassword({
            email,
            password: password || 'GlobeSkillPass@2026',
          });
        } catch {
          // Non-blocking
        }
      }

      return {
        id: data.user.id || `user_${Date.now()}`,
        email: data.user.email,
        full_name: data.user.fullName || fullName,
        user_role: data.user.role || role,
        location: location || 'India',
        education_background: educationBackground || 'High School',
        skill_interests: skillInterests || [],
        created_at: new Date().toISOString(),
      };
    } catch (err: unknown) {
      if (err instanceof Error && !err.message.includes('fetch')) {
        throw err;
      }
    }
  }

  // Local Mock Store implementation
  const profiles = MockDatabaseStore.getProfiles();
  const existing = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return existing;
  }

  const newProfile: UserProfile = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    email,
    full_name: fullName,
    user_role: role,
    location: location || '',
    education_background: educationBackground || '',
    skill_interests: skillInterests || [],
    created_at: new Date().toISOString(),
  };

  profiles.push(newProfile);
  MockDatabaseStore.saveProfiles(profiles);
  return newProfile;
}

export async function loginUser(email: string, _password?: string): Promise<UserProfile> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: _password || 'GlobeSkillPass@2026',
    });
    if (error) throw new Error(error.message);

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profile) return profile as UserProfile;
  }

  const profiles = MockDatabaseStore.getProfiles();
  const found = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
  if (!found) {
    throw new Error('No user found with this email address. Please register or choose a demo account.');
  }

  return found;
}

export async function updateUserProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as UserProfile;
  }

  const profiles = MockDatabaseStore.getProfiles();
  const index = profiles.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Profile not found');

  const updated: UserProfile = {
    ...profiles[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  profiles[index] = updated;
  MockDatabaseStore.saveProfiles(profiles);
  return updated;
}
