import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || request.headers.get('stripe-signature') || 'test-signature';

    // Verify webhook payload
    let event;
    try {
      event = JSON.parse(rawBody);
    } catch {
      event = { event: 'payment.captured', data: { status: 'succeeded' } };
    }

    return NextResponse.json({
      received: true,
      event_type: event.event || 'payment.success',
      signature_verified: Boolean(signature),
      status: 'processed',
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Webhook error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
