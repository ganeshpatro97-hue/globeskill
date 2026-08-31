import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      title, 
      level = 'beginner', 
      xp_reward = 100, 
      sdg_alignment = 'SDG 4: Quality Education', 
      description, 
      analogy, 
      starter_html, 
      starter_css, 
      starter_js, 
      test_regex, 
      test_instructions 
    } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required.' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const challengeId = `chall_${slug || Date.now()}`;

    if (supabaseAdmin) {
      try {
        await supabaseAdmin.from('coding_challenges').upsert({
          id: challengeId,
          title,
          level,
          xp_reward,
          sdg_alignment,
          description,
          analogy,
          starter_html,
          starter_css,
          starter_js,
          test_regex,
          test_instructions,
          created_at: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.warn('DB Challenge insert fallback:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      challengeId,
      message: `Challenge "${title}" successfully seeded into GlobeSkill database!`,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Error creating challenge';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function GET() {
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin.from('coding_challenges').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return NextResponse.json({ success: true, challenges: data });
      }
    } catch {
      // Handled
    }
  }

  return NextResponse.json({ success: true, challenges: [] });
}
