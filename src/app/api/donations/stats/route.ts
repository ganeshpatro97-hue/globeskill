import { NextResponse } from 'next/server';
import { getDonationStats } from '@/lib/services/donation.service';

export async function GET() {
  try {
    const stats = await getDonationStats();
    return NextResponse.json(stats, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch donation statistics';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
