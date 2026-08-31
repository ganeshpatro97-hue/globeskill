// GlobeSkill Phase 5: AI Learning Assistant API Route (Next.js App Router / TypeScript)
// This file implements a secure Next.js route handler at /api/ai/chat
// It provides kid-friendly, encouraging coding mentorship and logs chat sessions to the Supabase database.

import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase-client';
import { askAiMentor } from '@/lib/services/ai.service';

import { LanguageCode } from '@/context/LanguageContext';

interface ChatRequest {
  message?: string;
  prompt?: string;
  userId?: string;
  sessionId?: string;
  language?: LanguageCode;
  lang?: LanguageCode;
}

export async function POST(request: Request) {
  try {
    const body: ChatRequest = await request.json();
    const message = body.message || body.prompt || '';
    const userId = body.userId;
    const sessionId = body.sessionId;
    const language: LanguageCode = body.language || body.lang || 'en';

    if (!message || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message content cannot be empty.' },
        { status: 400 }
      );
    }

    const activeSessionId = sessionId || `session_${Date.now()}`;

    // Get response from our AI mentor service with dynamic vernacular language prompting
    const aiResponseText = await askAiMentor(message, [], language);

    // Log the interaction to Supabase in the background (if user is authenticated and Supabase is configured)
    if (userId && isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('ai_sessions')
          .insert([
            {
              user_id: userId,
              session_id: activeSessionId,
              user_message: message,
              ai_response: aiResponseText,
            }
          ]);
      } catch {
        // Non-blocking log failure
      }
    }

    return NextResponse.json({
      success: true,
      reply: aiResponseText,
      response: aiResponseText,
      sessionId: activeSessionId,
      timestamp: new Date().toISOString(),
      mentor: 'Sparky (GlobeSkill AI Kids Mentor)'
    });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to process AI chat.';
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
