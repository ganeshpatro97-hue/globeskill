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

      const newProf: UserProfile = {
        id: data.user?.id || `user_${Date.now()}`,
        email: data.user?.email || email,
        full_name: data.user?.fullName || fullName,
        user_role: data.user?.role || role,
        location: location || 'India',
        education_background: educationBackground || 'High School',
        skill_interests: skillInterests || [],
        created_at: new Date().toISOString(),
      };

      const profiles = MockDatabaseStore.getProfiles();
      const existingIdx = profiles.findIndex((p) => p.email.toLowerCase() === email.toLowerCase());
      if (existingIdx >= 0) {
        profiles[existingIdx] = { ...profiles[existingIdx], ...newProf };
      } else {
        profiles.push(newProf);
      }
      MockDatabaseStore.saveProfiles(profiles);

      return newProf;
    } catch (err: unknown) {
      if (err instanceof Error && !err.message.includes('fetch')) {
        throw err;
      }
    }
  }

  // Local Mock Store fallback
  const profiles = MockDatabaseStore.getProfiles();
  const existing = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    existing.user_role = role;
    existing.full_name = fullName;
    MockDatabaseStore.saveProfiles(profiles);
    return existing;
  }

  const newProfile: UserProfile = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    email,
    full_name: fullName,
    user_role: role,
    location: location || 'India',
    education_background: educationBackground || 'High School',
    skill_interests: skillInterests || [],
    created_at: new Date().toISOString(),
  };

  profiles.push(newProfile);
  MockDatabaseStore.saveProfiles(profiles);
  return newProfile;
}

export async function loginUser(email: string, _password?: string): Promise<UserProfile> {
  const cleanEmail = email.trim().toLowerCase();

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: _password || 'GlobeSkillPass@2026',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      const userProfile: UserProfile = {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.fullName,
        user_role: data.user.role,
        location: data.user.profile?.location || 'India',
        education_background: data.user.profile?.education_background || 'High School',
        skill_interests: data.user.profile?.skill_interests || [],
        created_at: data.user.profile?.created_at || new Date().toISOString(),
      };

      // Sync with local profiles store
      const profiles = MockDatabaseStore.getProfiles();
      const idx = profiles.findIndex((p) => p.email.toLowerCase() === cleanEmail);
      if (idx >= 0) {
        profiles[idx] = { ...profiles[idx], ...userProfile };
      } else {
        profiles.push(userProfile);
      }
      MockDatabaseStore.saveProfiles(profiles);

      return userProfile;
    } catch (err: unknown) {
      if (err instanceof Error && !err.message.includes('fetch')) {
        throw err;
      }
    }
  }

  const profiles = MockDatabaseStore.getProfiles();
  const found = profiles.find((p) => p.email.toLowerCase() === cleanEmail);
  if (!found) {
    throw new Error('No user found with this email address. Please register or choose a demo account.');
  }

  return found;
}

export async function updateUserProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data as UserProfile;
    } catch {
      // Non-blocking fallback
    }
  }

  const profiles = MockDatabaseStore.getProfiles();
  const index = profiles.findIndex((p) => p.id === id);
  if (index === -1) {
    // If not found by ID, look by email if present in updates
    const updated: UserProfile = {
      id,
      email: updates.email || 'user@globeskill.org',
      full_name: updates.full_name || 'GlobeSkill User',
      user_role: updates.user_role || 'student',
      ...updates,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    profiles.push(updated);
    MockDatabaseStore.saveProfiles(profiles);
    return updated;
  }

  const updated: UserProfile = {
    ...profiles[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  profiles[index] = updated;
  MockDatabaseStore.saveProfiles(profiles);
  return updated;
}

