import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-client';
import { signUpUser } from '@/lib/services/auth.service';

/**
 * USER SIGNUP ROUTE (app/api/auth/signup/route.ts)
 * Handles creating or updating user accounts for Student, Trainer, Donor, and Admin roles.
 * Automatically confirms user email for immediate, frictionless login.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, userRole } = body;

    // 1. Inputs Validation
    if (!email || !fullName || !userRole) {
      return NextResponse.json(
        { error: 'Missing required fields: email, fullName, and userRole are mandatory.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const isSuperAdmin = cleanEmail === 'ganeshpatro97@gmail.com' || cleanEmail === 'admin@globeskill.org';
    const cleanRole = isSuperAdmin ? 'admin' : userRole.trim().toLowerCase();
    const cleanPassword = password || 'GlobeSkillPass@2026';

    if (cleanRole !== 'student' && cleanRole !== 'trainer' && cleanRole !== 'admin' && cleanRole !== 'donor') {
      return NextResponse.json(
        { error: "Invalid role. Role must be 'student', 'trainer', 'donor', or 'admin'." },
        { status: 400 }
      );
    }

    if (cleanPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // 2. Register / Update user via Supabase Admin (auto-confirm email)
    if (supabaseAdmin) {
      try {
        const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = listData?.users?.find(
          (u) => u.email?.toLowerCase() === cleanEmail
        );

        let userId = existingUser?.id;

        if (!existingUser) {
          const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: cleanEmail,
            password: cleanPassword,
            email_confirm: true,
            user_metadata: {
              full_name: fullName,
              user_role: cleanRole,
            },
          });

          if (createError) {
            return NextResponse.json({ error: createError.message }, { status: 400 });
          }
          userId = created.user.id;
        } else {
          // User already exists, update credentials and metadata
          await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
            password: cleanPassword,
            user_metadata: {
              full_name: fullName,
              user_role: cleanRole,
            },
          });
        }

        if (userId) {
          // Upsert the profile in the database profiles table
          await supabaseAdmin.from('profiles').upsert({
            id: userId,
            email: cleanEmail,
            full_name: fullName,
            user_role: cleanRole,
            location: 'India',
            education_background: 'High School',
            updated_at: new Date().toISOString(),
          });

          return NextResponse.json(
            {
              message: 'Registration successful! Profile created.',
              user: {
                id: userId,
                email: cleanEmail,
                role: cleanRole,
                fullName: fullName,
              },
            },
            { status: 201 }
          );
        }
      } catch (adminErr: unknown) {
        console.error('Supabase admin registration error:', adminErr);
      }
    }

    // Fallback domain service registration for local development & resilient fallback
    const newProfile = await signUpUser({
      email: cleanEmail,
      password: cleanPassword,
      fullName,
      role: cleanRole as any,
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
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

