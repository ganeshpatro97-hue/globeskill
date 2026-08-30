import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase-client';
import { signUpUser } from '@/lib/services/auth.service';

/**
 * USER SIGNUP ROUTE (app/api/auth/signup/route.ts)
 * Handles creating a new user account with Email, Password, Full Name, and Role.
 * Automatically confirms user email for immediate, frictionless login.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, userRole } = body;

    // 1. Inputs Validation
    if (!email || !password || !fullName || !userRole) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, fullName, and userRole are mandatory.' },
        { status: 400 }
      );
    }

    if (userRole !== 'student' && userRole !== 'trainer' && userRole !== 'admin' && userRole !== 'donor') {
      return NextResponse.json(
        { error: "Invalid role. Role must be 'student', 'trainer', 'donor', or 'admin'." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // 2. Register user via Supabase Admin (auto-confirm email) or standard client
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          user_role: userRole,
        },
      });

      if (error) {
        // If user already registered, try standard signup
        if (error.message.includes('already been registered') && supabase) {
          const { data: stdData, error: stdError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName, user_role: userRole },
            },
          });
          if (stdError) {
            return NextResponse.json({ error: stdError.message }, { status: 400 });
          }
          return NextResponse.json(
            {
              message: 'Registration successful! Profile created.',
              user: {
                id: stdData.user?.id,
                email: stdData.user?.email,
                role: userRole,
                fullName: fullName,
              },
            },
            { status: 201 }
          );
        }
        return NextResponse.json({ error: error.message }, { status: error.status || 400 });
      }

      return NextResponse.json(
        {
          message: 'Registration successful! Profile created.',
          user: {
            id: data.user?.id,
            email: data.user?.email,
            role: userRole,
            fullName: fullName,
          },
        },
        { status: 201 }
      );
    } else if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_role: userRole,
          },
        },
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: error.status || 400 });
      }

      return NextResponse.json(
        {
          message: 'Registration successful! Profile created.',
          user: {
            id: data.user?.id,
            email: data.user?.email,
            role: userRole,
            fullName: fullName,
          },
        },
        { status: 201 }
      );
    }

    // Fallback domain service registration for local development & testing
    const newProfile = await signUpUser({
      email,
      password,
      fullName,
      role: userRole,
    });

    return NextResponse.json(
      {
        message: 'Registration successful! Profile created.',
        user: {
          id: newProfile.id,
          email: newProfile.email,
          role: newProfile.user_role,
          fullName: newProfile.full_name,
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMsg }, { status: 500 });
  }
}
