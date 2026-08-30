import { NextRequest, NextResponse } from 'next/server';
import { MockDatabaseStore } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const donationId = searchParams.get('id');

  const donations = MockDatabaseStore.getDonations();
  const donation = donations.find((d) => d.id === donationId) || donations[0];

  if (!donation) {
    return new NextResponse('Donation receipt not found', { status: 404 });
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Donation Receipt - ${donation.transaction_id}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; padding: 40px; color: #1e293b; }
    .receipt-box { max-width: 650px; margin: 0 auto; background: #fff; padding: 40px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 20px; margin-bottom: 30px; }
    .title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
    .tagline { font-size: 12px; color: #059669; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .info-table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    .info-table td { padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .info-table td.label { color: #64748b; font-weight: 500; width: 40%; }
    .info-table td.value { color: #0f172a; font-weight: 600; }
    .amount-highlight { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; text-align: center; margin: 24px 0; }
    .amount-val { font-size: 28px; font-weight: 800; color: #065f46; }
    .footer-note { font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.6; margin-top: 30px; border-top: 1px dashed #cbd5e1; padding-top: 15px; }
    .print-btn { display: block; margin: 20px auto 0; padding: 10px 20px; background: #059669; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
    @media print { .print-btn { display: none; } body { padding: 0; background: #fff; } .receipt-box { box-shadow: none; border: none; } }
  </style>
</head>
<body>
  <div class="receipt-box">
    <div class="header">
      <div>
        <h1 class="title">GlobeSkill</h1>
        <div class="tagline">Technology & AI Education for Every Child</div>
      </div>
      <div style="text-align: right; font-size: 12px; color: #64748b;">
        <div><strong>Receipt #:</strong> ${donation.transaction_id}</div>
        <div><strong>Date:</strong> ${new Date(donation.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
      </div>
    </div>

    <div class="amount-highlight">
      <div style="font-size: 12px; font-weight: 600; color: #047857; text-transform: uppercase;">Official Donation Contribution</div>
      <div class="amount-val">₹${Number(donation.amount).toLocaleString('en-IN')} ${donation.currency}</div>
      <div style="font-size: 12px; color: #065f46; margin-top: 4px;">Status: Payment Succeeded via ${donation.payment_method.toUpperCase()}</div>
    </div>

    <table class="info-table">
      <tr>
        <td class="label">Donor Name:</td>
        <td class="value">${donation.donor_name}</td>
      </tr>
      <tr>
        <td class="label">Donor Email:</td>
        <td class="value">${donation.donor_email}</td>
      </tr>
      <tr>
        <td class="label">Cause Supported:</td>
        <td class="value">${donation.cause_target.toUpperCase()} (${donation.sponsor_target_name || 'Youth Digital Literacy'})</td>
      </tr>
      <tr>
        <td class="label">Transaction Reference:</td>
        <td class="value font-mono">${donation.transaction_id}</td>
      </tr>
      <tr>
        <td class="label">NGO Registration:</td>
        <td class="value">GlobeSkill Foundation (Section 80G Tax Exemption Eligible)</td>
      </tr>
    </table>

    <div class="footer-note">
      This is an electronically generated official receipt issued by GlobeSkill Foundation. Donations are eligible for tax deductions under applicable non-profit provisions. Thank you for empowering underserved children with high-impact digital and AI education.
    </div>

    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>
</body>
</html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
