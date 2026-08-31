import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = body.items || [];

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: 'No items to sync' }, { status: 200 });
    }

    let successCount = 0;

    // Process each queued progress item
    for (const item of items) {
      const { studentId, courseId, chapterId, progressPercentage } = item;

      if (studentId && courseId) {
        if (supabaseAdmin) {
          try {
            // Check existing enrollment
            const { data: enr } = await supabaseAdmin
              .from('enrollments')
              .select('*')
              .eq('student_id', studentId)
              .eq('course_id', courseId)
              .single();

            const completedChapters = new Set<string>(enr?.completed_chapters || []);
            if (chapterId) completedChapters.add(chapterId);

            const newProgress = Math.max(Number(enr?.progress_percentage || 0), Number(progressPercentage || 0));

            await supabaseAdmin.from('enrollments').upsert({
              student_id: studentId,
              course_id: courseId,
              progress_percentage: newProgress,
              completed_chapters: Array.from(completedChapters),
              status: newProgress >= 100 ? 'completed' : 'active',
              completed_at: newProgress >= 100 ? new Date().toISOString() : null,
            });

            successCount++;
          } catch (dbErr) {
            console.warn('Sync DB update error for item:', item, dbErr);
          }
        } else {
          successCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      syncedCount: successCount,
      totalCount: items.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Sync failed';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
