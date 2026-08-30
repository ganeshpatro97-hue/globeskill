import { NextRequest, NextResponse } from 'next/server';
import { generateStudentReportCsv, generateDonationsReportCsv } from '@/lib/services/admin.service';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');

  if (type === 'students') {
    const csv = generateStudentReportCsv();
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="globeskill_students_progress.csv"',
      },
    });
  }

  if (type === 'donations') {
    const csv = generateDonationsReportCsv();
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="globeskill_donations_audit.csv"',
      },
    });
  }

  return NextResponse.json({ error: 'Specify type=students or type=donations' }, { status: 400 });
}
