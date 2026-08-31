/**
 * GlobeSkill Multilingual WhatsApp & SMS Notification Engine for Rural Parents & Learning Hubs
 * Delivers transparent progress alerts in native languages (Hindi, Tamil, Kannada, Marathi, English).
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
  lang: LanguageCode = 'hi'
): string {
  const course = meta.courseName || 'AI Micro Degree';
  const sponsor = meta.sponsorName || 'Edunet CSR Foundation';
  const company = meta.companyName || 'TechMahindra CSR';

  // Hindi Templates
  if (lang === 'hi') {
    switch (trigger) {
      case 'COURSE_COMPLETED':
        return `🌟 बधाई हो! आपके बच्चे ${studentName} ने ग्लोबस्किल (GlobeSkill) पर "${course}" सफलतापूर्वक पूरा कर लिया है! उनका सर्टिफिकेट ऑनलाइन जारी हो चुका है।`;
      case 'SCHOLARSHIP_AWARDED':
        return `🎉 खुशखबरी! ${studentName} को ${sponsor} की ओर से 100% नि:शुल्क कंप्यूटर व AI स्कॉलरशिप प्रदान की गई है।`;
      case 'INTERVIEW_SCHEDULED':
        return `💼 महत्वपूर्ण सूचना: ${company} ने ${studentName} के लिए वोकेशनल इंटर्नशिप इंटरव्यू का अनुरोध किया है। कृपया ट्रेनर से संपर्क करें।`;
      case 'STREAK_ACHIEVED':
        return `⭐ शानदार! ${studentName} ने इस सप्ताह लगातार 5 दिन डिजिटल लैब में कोडिंग पूरी की है। पढ़ाई जारी रखें!`;
    }
  }

  // Tamil Templates
  if (lang === 'ta') {
    switch (trigger) {
      case 'COURSE_COMPLETED':
        return `🌟 வாழ்த்துகள்! உங்கள் குழந்தை ${studentName}, GlobeSkill-ல் "${course}" படிப்பை வெற்றிகரமாக முடித்துள்ளார்!`;
      case 'SCHOLARSHIP_AWARDED':
        return `🎉 நற்செய்தி! ${studentName}-க்கு ${sponsor} மூலம் 100% இலவச AI கல்வி உதவித்தொகை கிடைத்துள்ளது.`;
      case 'INTERVIEW_SCHEDULED':
        return `💼 தகவல்: ${company} நிறுவனம் ${studentName}-க்கு இன்டர்ன்ஷிப் நேர்காணல் அழைப்பு விடுத்துள்ளது.`;
      case 'STREAK_ACHIEVED':
        return `⭐ அருமை! ${studentName} தொடர்ந்து இந்த வாரம் சிறப்பாக பயின்று வருகிறார்!`;
    }
  }

  // Kannada Templates
  if (lang === 'kn') {
    switch (trigger) {
      case 'COURSE_COMPLETED':
        return `🌟 ಅಭಿನಂದನೆಗಳು! ನಿಮ್ಮ ಮಗು ${studentName} GlobeSkill ನಲ್ಲಿ "${course}" ಕೋರ್ಸ್ ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದೆ!`;
      case 'SCHOLARSHIP_AWARDED':
        return `🎉 ಒಳ್ಳೆಯ ಸುದ್ದಿ! ${studentName} ಗೆ ${sponsor} ವತಿಯಿಂದ ಉಚಿತ AI ಸ್ಕಾಲರ್‌ಶಿಪ್ ಮಂಜೂರಾಗಿದೆ.`;
      default:
        return `🌟 GlobeSkill: ${studentName} ಅವರ ಶೈಕ್ಷಣಿಕ ಪ್ರಗತಿ ಉತ್ತಮವಾಗಿದೆ!`;
    }
  }

  // Marathi Templates
  if (lang === 'mr') {
    switch (trigger) {
      case 'COURSE_COMPLETED':
        return `🌟 अभिनंदन! आपल्या पाल्याने ${studentName} ने ग्लोबस्किलवर "${course}" अभ्यासक्रम यशस्वीरीत्या पूर्ण केला आहे!`;
      case 'SCHOLARSHIP_AWARDED':
        return `🎉 आनंदाची बातमी! ${studentName} ला ${sponsor} कडून १००% मोफत तंत्रज्ञान शिष्यवृत्ती मिळाली आहे.`;
      default:
        return `🌟 ग्लोबस्किल: ${studentName} ची प्रगती खूप छान आहे!`;
    }
  }

  // Default English Templates
  switch (trigger) {
    case 'COURSE_COMPLETED':
      return `🌟 Congratulations! Your child ${studentName} has successfully completed the "${course}" on GlobeSkill! Verified certificate issued.`;
    case 'SCHOLARSHIP_AWARDED':
      return `🎉 Great News! ${studentName} has been awarded a 100% free AI & Tech Scholarship sponsored by ${sponsor}.`;
    case 'INTERVIEW_SCHEDULED':
      return `💼 Placement Notice: ${company} has invited ${studentName} for an upcoming vocational internship interview.`;
    case 'STREAK_ACHIEVED':
      return `⭐ Wonderful! ${studentName} has maintained a consistent 5-day coding streak at the local digital learning hub!`;
  }
}

export async function dispatchParentNotification(params: {
  studentName: string;
  parentPhone: string;
  channel: 'whatsapp' | 'sms';
  trigger: NotificationTrigger;
  language: LanguageCode;
  meta?: Record<string, any>;
}): Promise<ParentNotification> {
  const messageText = formatParentMessage(params.trigger, params.studentName, params.meta, params.language);

  const notification: ParentNotification = {
    id: `notif_${Date.now()}`,
    studentName: params.studentName,
    parentPhone: params.parentPhone,
    channel: params.channel,
    trigger: params.trigger,
    language: params.language,
    messageText,
    status: 'delivered',
    sentAt: new Date().toISOString(),
  };

  return notification;
}
