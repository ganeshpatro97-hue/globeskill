import { NextResponse } from 'next/server';
import { processDonationCheckout } from '@/lib/services/donation.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { donorName, donorEmail, amount, paymentMethod, causeTarget, sponsorTargetName, donorId } = body;

    if (!donorName || !donorEmail || !amount || !paymentMethod || !causeTarget) {
      return NextResponse.json({ error: 'Missing required donation fields' }, { status: 400 });
    }

    if (Number(amount) <= 0) {
      return NextResponse.json({ error: 'Donation amount must be greater than 0' }, { status: 400 });
    }

    const donation = await processDonationCheckout({
      donorId,
      donorName,
      donorEmail,
      amount: Number(amount),
      paymentMethod,
      causeTarget,
      sponsorTargetName,
    });

    return NextResponse.json({
      success: true,
      donation,
      message: 'Donation received successfully! Thank you for empowering young learners.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to process donation';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
