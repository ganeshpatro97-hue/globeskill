import { NextResponse } from 'next/server';
import { dispatchParentNotification } from '@/lib/services/notification.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentName, parentPhone, channel = 'whatsapp', trigger = 'COURSE_COMPLETED', language = 'hi', meta } = body;

    if (!studentName || !parentPhone) {
      return NextResponse.json({ error: 'Student name and parent phone number are required.' }, { status: 400 });
    }

    const result = await dispatchParentNotification({
      studentName,
      parentPhone,
      channel,
      trigger,
      language,
      meta,
    });

    return NextResponse.json({
      success: true,
      notification: result,
      message: `Alert successfully dispatched via ${channel.toUpperCase()} to ${parentPhone}!`,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Dispatch failure';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
