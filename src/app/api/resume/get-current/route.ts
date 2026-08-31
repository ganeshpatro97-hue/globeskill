import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-client';
import { getStudentPortfolio } from '@/lib/services/portfolio.service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || searchParams.get('studentId') || '00000000-0000-0000-0000-000000000003';

    let resumeData: any = null;

    if (supabaseAdmin) {
      try {
        const { data: port } = await supabaseAdmin
          .from('student_portfolios')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (port?.compiled_resume) {
          resumeData = port.compiled_resume;
        }
      } catch {
        // Fallback
      }
    }

    if (!resumeData) {
      const p = await getStudentPortfolio(userId);
      resumeData = {
        summary: p.summary,
        skills: p.technical_skills.concat(p.soft_skills),
        projects: p.projects.map((proj) => ({
          title: proj.title,
          description: proj.description,
        })),
        credentials: p.verified_certificates.map((cert) => ({
          course: cert,
          certifiedBy: 'GlobeSkill & UN SDG Partner Network',
          completionDate: '2026-08-28',
        })),
      };
    }

    return NextResponse.json({
      success: true,
      resume: resumeData,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Error fetching current resume';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
