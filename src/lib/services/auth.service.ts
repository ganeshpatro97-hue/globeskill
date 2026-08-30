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

  if (isSupabaseConfigured && supabase) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: password || 'GlobeSkillPass@2026',
      options: {
        data: {
          full_name: fullName,
          user_role: role,
        },
      },
    });

    if (authError) {
      throw new Error(authError.message);
    }

    const userId = authData.user?.id || `user_${Date.now()}`;
    const newProfile: UserProfile = {
      id: userId,
      email,
      full_name: fullName,
      user_role: role,
      location: location || '',
      education_background: educationBackground || '',
      skill_interests: skillInterests || [],
      created_at: new Date().toISOString(),
    };

    // Save to database profiles table
    await supabase.from('profiles').upsert(newProfile);
    return newProfile;
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
