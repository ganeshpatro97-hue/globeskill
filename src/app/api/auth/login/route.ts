import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase-client';
import { loginUser } from '@/lib/services/auth.service';

/**
 * USER LOGIN ROUTE (app/api/auth/login/route.ts)
 * Handles verifying user credentials, logging in, and returning user profile and role.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Inputs Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing credentials. Email and password are required.' },
        { status: 400 }
      );
    }

    // 2. Authenticate using Supabase Auth when configured
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status || 401 });
      }

      // Fetch user profile role from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_role, full_name')
        .eq('id', data.user.id)
        .single();

      return NextResponse.json(
        {
          message: 'Login successful!',
          session: {
            access_token: data.session?.access_token,
            refresh_token: data.session?.refresh_token,
            expires_at: data.session?.expires_at,
          },
          user: {
            id: data.user.id,
            email: data.user.email,
            fullName: profile?.full_name || data.user.user_metadata?.full_name || 'User',
            role: profile?.user_role || data.user.user_metadata?.user_role || 'student',
          },
        },
        { status: 200 }
      );
    }

    // Fallback domain service login for local development
    const profile = await loginUser(email, password);
    return NextResponse.json(
      {
        message: 'Login successful!',
        session: {
          access_token: `mock_jwt_token_${Date.now()}`,
          refresh_token: `mock_refresh_${Date.now()}`,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
        },
        user: {
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          role: profile.user_role,
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Invalid credentials';
    return NextResponse.json({ error: errorMsg }, { status: 401 });
  }
}
