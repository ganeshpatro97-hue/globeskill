import { NextResponse } from 'next/server';
import { askAiMentor } from '@/lib/services/ai.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, history } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt string is required' }, { status: 400 });
    }

    const reply = await askAiMentor(prompt, history || []);
    return NextResponse.json({
      reply,
      timestamp: new Date().toISOString(),
      mentor: 'Sparky (GlobeSkill AI Kids Mentor)',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal AI Assistant error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
