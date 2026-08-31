import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-client';

export async function POST(req: Request) {
  try {
    const { userId, email, fullName, skills, education } = await req.json();

    if (!userId && !email) {
      return NextResponse.json({ error: 'User ID or Email is required' }, { status: 400 });
    }

    let profile: any = null;
    let completedCourses: string[] = [];

    // Fetch from Supabase if configured
    if (supabaseAdmin) {
      try {
        const query = userId 
          ? supabaseAdmin.from('profiles').select('*').eq('id', userId).single()
          : supabaseAdmin.from('profiles').select('*').eq('email', email).single();

        const { data: prof } = await query;
        if (prof) profile = prof;

        if (profile?.id) {
          const { data: enrollments } = await supabaseAdmin
            .from('enrollments')
            .select('*, courses(*)')
            .eq('student_id', profile.id)
            .eq('status', 'completed');

          if (enrollments && enrollments.length > 0) {
            completedCourses = enrollments.map((e: any) => e.courses?.title || e.course_title).filter(Boolean);
          }
        }
      } catch (dbErr) {
        console.warn('Database fetch error in compile resume:', dbErr);
      }
    }

    const studentName = profile?.full_name || fullName || 'GlobeSkill Graduate';
    const studentEmail = profile?.email || email || 'student@globeskill.org';
    const studentLocation = profile?.location || 'India';
    const skillsList = profile?.skill_interests || skills || ['Python Basics', 'Web Dev', 'Robotics'];
    const coursesList = completedCourses.length > 0 ? completedCourses : ['GlobeSkill AI Micro Degree', 'IBM SkillsBuild Tech Basics'];

    const apiKey = process.env.GEMINI_API_KEY;
    let compiledResume: any = null;

    if (apiKey && !apiKey.includes('your-')) {
      try {
        const prompt = `
You are the GlobeSkill AI Career Coach & Portfolio Architect.
Compile an industry-standard, professional technical resume for this student graduating from NGO digital education programs:

- Full Name: ${studentName}
- Email: ${studentEmail}
- Educational Background: ${profile?.education_background || education || 'High School & GlobeSkill Digital Hub'}
- Declared Skills/Interests: ${skillsList.join(', ')}
- Completed Certifications: ${coursesList.join(', ')}
- Location: ${studentLocation}

Output a clean JSON object ONLY (without markdown fences):
{
  "headline": "Professional Tech Headline",
  "professional_summary": "2-3 sentence executive profile emphasizing technical readiness, work ethic, and community-minded problem solving.",
  "key_skills": {
    "frontend": ["HTML5/CSS", "JavaScript/React"],
    "ai_and_data": ["Python 3", "Computer Vision Basics", "Prompt Engineering"],
    "productivity": ["Git", "Cloud Literacy", "Digital Citizenship"]
  },
  "certified_credentials": ["Edunet Aligned AI Micro Degree", "IBM SkillsBuild Tech Basics"],
  "sample_projects": [
    {
      "title": "Smart Community Alert System",
      "description": "Python application designed to broadcast weather and healthcare notifications to village centers.",
      "technologies": ["Python", "JSON APIs"]
    }
  ],
  "career_outlook": "Ready for junior software apprenticeships, data annotation internships, and CSR corporate training tracks."
}
`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            compiledResume = JSON.parse(cleaned);
          }
        }
      } catch (aiErr) {
        console.warn('Gemini compile fallback:', aiErr);
      }
    }

    if (!compiledResume) {
      // Resilient Domain Fallback
      compiledResume = {
        headline: `Junior AI & Software Developer | ${studentLocation}`,
        professional_summary: `Dedicated young technology learner trained in computer science foundations, Python programming, and practical AI applications through GlobeSkill. Passionate about building impactful software solutions.`,
        key_skills: {
          frontend: ['HTML5 & CSS Grid', 'React Basics', 'Tailwind CSS'],
          ai_and_data: ['Python 3', 'Computer Vision Basics', 'Pandas Analysis'],
          productivity: ['Git Version Control', 'Cloud Literacy', 'Digital Safety']
        },
        certified_credentials: coursesList,
        sample_projects: [
          {
            title: 'Rural Community Dashboard',
            description: 'Responsive web portal for village learning centers displaying weather advisories and government skill workshops.',
            technologies: ['React', 'Tailwind CSS', 'Python']
          }
        ],
        career_outlook: 'Ready for CSR vocational tech internships, apprentice developers, and junior AI annotation roles.'
      };
    }

    // Save to Supabase if database available
    if (supabaseAdmin && profile?.id) {
      try {
        await supabaseAdmin.from('student_portfolios').upsert({
          user_id: profile.id,
          compiled_resume: compiledResume,
          search_tags: skillsList,
          match_score: 94,
          last_updated: new Date().toISOString(),
        });
      } catch (saveErr) {
        console.warn('Could not persist portfolio to student_portfolios table:', saveErr);
      }
    }

    return NextResponse.json({
      success: true,
      resume: compiledResume,
      studentName,
      email: studentEmail
    });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Resume compilation error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
