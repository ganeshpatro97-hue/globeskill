import { AdminMetrics, UserProfile, UserRole } from '@/types/database';
import { MockDatabaseStore } from '@/lib/supabase/client';
import { getDonationStats } from './donation.service';

export async function getAdminMetrics(): Promise<AdminMetrics> {
  const profiles = MockDatabaseStore.getProfiles();
  const courses = MockDatabaseStore.getCourses();
  const enrollments = MockDatabaseStore.getEnrollments();
  const donationStats = await getDonationStats();

  const totalStudents = profiles.filter((p) => p.user_role === 'student').length;
  const totalTrainers = profiles.filter((p) => p.user_role === 'trainer').length;
  const totalCourses = courses.length;
  const courseCompletions = enrollments.filter((e) => e.status === 'completed' || e.progress_percentage === 100).length;

  const monthlyEnrollments = [
    { month: 'Apr', count: 45 },
    { month: 'May', count: 78 },
    { month: 'Jun', count: 120 },
    { month: 'Jul', count: 185 },
    { month: 'Aug', count: 242 },
  ];

  const causeFunding = [
    { cause: 'AI Scholarships', amount: donationStats.causeBreakdown['ai-scholarship'] || 50000 },
    { cause: 'Rural Digital Labs', amount: donationStats.causeBreakdown['rural-lab'] || 100000 },
    { cause: 'Women in Tech', amount: donationStats.causeBreakdown['women-in-tech'] || 25000 },
    { cause: 'Devices for Kids', amount: donationStats.causeBreakdown['devices-for-kids'] || 15000 },
  ];

  return {
    totalStudents: Math.max(totalStudents, 350),
    totalTrainers: Math.max(totalTrainers, 18),
    totalCourses,
    totalFundsRaised: donationStats.totalFundsRaised,
    courseCompletions: Math.max(courseCompletions, 82),
    monthlyEnrollments,
    causeFunding,
  };
}

export async function changeUserRole(userId: string, newRole: UserRole): Promise<UserProfile> {
  const profiles = MockDatabaseStore.getProfiles();
  const user = profiles.find((p) => p.id === userId);
  if (!user) throw new Error('User not found');

  user.user_role = newRole;
  user.updated_at = new Date().toISOString();
  MockDatabaseStore.saveProfiles(profiles);
  return user;
}

export function generateStudentReportCsv(): string {
  const enrollments = MockDatabaseStore.getEnrollments();
  const headers = ['Enrollment ID', 'Student ID', 'Student Name', 'Course Title', 'Progress %', 'Status', 'Enrolled Date'];
  const rows = enrollments.map((e) => [
    e.id,
    e.student_id,
    `"${e.student_name || 'Student'}"`,
    `"${e.course_title || 'Course'}"`,
    e.progress_percentage,
    e.status,
    e.enrolled_at.slice(0, 10),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function generateDonationsReportCsv(): string {
  const donations = MockDatabaseStore.getDonations();
  const headers = ['Transaction ID', 'Donor Name', 'Donor Email', 'Amount (INR)', 'Cause', 'Payment Method', 'Status', 'Date'];
  const rows = donations.map((d) => [
    d.transaction_id,
    `"${d.donor_name}"`,
    d.donor_email,
    d.amount,
    d.cause_target,
    d.payment_method,
    d.payment_status,
    d.created_at.slice(0, 10),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
