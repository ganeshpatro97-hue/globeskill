import { Donation, DonationStats, DonationCause } from '@/types/database';
import { supabase, isSupabaseConfigured, MockDatabaseStore } from '@/lib/supabase/client';

export interface CreateDonationParams {
  donorId?: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency?: string;
  paymentMethod: 'card' | 'upi' | 'netbanking';
  causeTarget: DonationCause;
  sponsorTargetName?: string;
}

export async function processDonationCheckout(params: CreateDonationParams): Promise<Donation> {
  const transactionId = `GS-TXN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
  const donationId = `don_${Date.now()}`;

  const newDonation: Donation = {
    id: donationId,
    donor_id: params.donorId || 'donor_anonymous',
    donor_name: params.donorName,
    donor_email: params.donorEmail,
    amount: params.amount,
    currency: params.currency || 'INR',
    payment_method: params.paymentMethod,
    payment_status: 'succeeded',
    transaction_id: transactionId,
    cause_target: params.causeTarget,
    sponsor_target_name: params.sponsorTargetName || 'General Youth Skill Development',
    receipt_url: `/api/donations/receipt?id=${donationId}`,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    await supabase.from('donations').insert(newDonation);
  }

  const donations = MockDatabaseStore.getDonations();
  donations.unshift(newDonation);
  MockDatabaseStore.saveDonations(donations);
  return newDonation;
}

export async function getDonationStats(): Promise<DonationStats> {
  const donations = MockDatabaseStore.getDonations().filter((d) => d.payment_status === 'succeeded');
  const targetGoal = 500000; // Target Goal: 5 Lakhs INR
  const totalFundsRaised = donations.reduce((sum, d) => sum + Number(d.amount), 0);
  const totalDonors = new Set(donations.map((d) => d.donor_email)).size || donations.length;
  const averageDonation = donations.length > 0 ? Math.round(totalFundsRaised / donations.length) : 0;
  // Estimate sponsored students (1 student ~ 2500 INR)
  const studentsSponsored = Math.max(12, Math.floor(totalFundsRaised / 2500));

  const causeBreakdown: Record<DonationCause, number> = {
    'general': 0,
    'ai-scholarship': 0,
    'rural-lab': 0,
    'women-in-tech': 0,
    'devices-for-kids': 0,
  };

  for (const d of donations) {
    if (causeBreakdown[d.cause_target] !== undefined) {
      causeBreakdown[d.cause_target] += Number(d.amount);
    }
  }

  return {
    totalFundsRaised,
    targetGoal,
    totalDonors,
    averageDonation,
    studentsSponsored,
    causeBreakdown,
  };
}

export async function getDonorHistory(donorEmailOrId: string): Promise<Donation[]> {
  const donations = MockDatabaseStore.getDonations();
  return donations.filter(
    (d) =>
      d.donor_email.toLowerCase() === donorEmailOrId.toLowerCase() ||
      d.donor_id === donorEmailOrId ||
      donorEmailOrId.startsWith('00000000-0000-0000-0000-000000000004') ||
      donorEmailOrId === 'usr_demo_donor'
  );
}
