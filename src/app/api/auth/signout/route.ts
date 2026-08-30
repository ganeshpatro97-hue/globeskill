import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase-client';

/**
 * USER SIGNOUT ROUTE (app/api/auth/signout/route.ts)
 * Handles logging out the user and destroying the session.
 */
export async function POST() {
  try {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      { message: 'Logged out successfully. Session destroyed.' },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Sign out error';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMsg }, { status: 500 });
  }
}
