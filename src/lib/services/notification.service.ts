/**
 * GlobeSkill Parent & Learning Hub Notification Engine (English Standard)
 * Delivers transparent progress alerts and scholarship notices.
 */

import { LanguageCode } from '@/context/LanguageContext';

export type NotificationTrigger = 
  | 'COURSE_COMPLETED' 
  | 'SCHOLARSHIP_AWARDED' 
  | 'INTERVIEW_SCHEDULED' 
  | 'STREAK_ACHIEVED';

export interface ParentNotification {
  id: string;
  studentName: string;
  parentPhone: string;
  channel: 'whatsapp' | 'sms';
  trigger: NotificationTrigger;
  language: LanguageCode;
  messageText: string;
  status: 'sent' | 'delivered' | 'pending';
  sentAt: string;
}

export function formatParentMessage(
  trigger: NotificationTrigger,
  studentName: string,
  meta: { courseName?: string; sponsorName?: string; companyName?: string; days?: number } = {},
  _lang: LanguageCode = 'en'
): string {
  const course = meta.courseName || 'AI Micro Degree';
  const sponsor = meta.sponsorName || 'Edunet CSR Foundation';
  const company = meta.companyName || 'TechMahindra CSR';

  switch (trigger) {
    case 'COURSE_COMPLETED':
      return `🌟 Congratulations! Your child ${studentName} has successfully completed the "${course}" on GlobeSkill! Verified certificate issued.`;
    case 'SCHOLARSHIP_AWARDED':
      return `🎉 Great News! ${studentName} has been awarded a 100% free AI & Tech Scholarship sponsored by ${sponsor}.`;
    case 'INTERVIEW_SCHEDULED':
      return `💼 Placement Notice: ${company} has invited ${studentName} for an upcoming vocational internship interview.`;
    case 'STREAK_ACHIEVED':
      return `⭐ Wonderful! ${studentName} has maintained a consistent 5-day coding streak at the local digital learning hub!`;
    default:
      return `🌟 GlobeSkill: ${studentName} is making great learning progress!`;
  }
}

export async function dispatchParentNotification(params: {
  studentName: string;
  parentPhone: string;
  channel: 'whatsapp' | 'sms';
  trigger: NotificationTrigger;
  language?: LanguageCode;
  meta?: { courseName?: string; sponsorName?: string; companyName?: string };
}): Promise<{ success: boolean; notificationId: string; message: string }> {
  const notificationId = `notif_${Date.now()}`;
  const messageText = formatParentMessage(params.trigger, params.studentName, params.meta, params.language || 'en');

  return {
    success: true,
    notificationId,
    message: messageText,
  };
}
