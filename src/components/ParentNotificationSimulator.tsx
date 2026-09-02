"use client";

import React, { useState } from 'react';
import { MessageSquare, Smartphone, Send, CheckCircle2, Globe, Sparkles } from 'lucide-react';
import { LanguageCode, SUPPORTED_LANGUAGES } from '@/context/LanguageContext';
import { NotificationTrigger, formatParentMessage } from '@/lib/services/notification.service';

export default function ParentNotificationSimulator() {
  const [studentName, setStudentName] = useState('Rohit Kumar');
  const [parentPhone, setParentPhone] = useState('+91 98765 43210');
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [trigger, setTrigger] = useState<NotificationTrigger>('COURSE_COMPLETED');
  const [lang, setLang] = useState<LanguageCode>('en');
  const [isSending, setIsSending] = useState(false);
  const [sentNotice, setSentNotice] = useState<string | null>(null);

  const previewMessage = formatParentMessage(
    trigger,
    studentName,
    { courseName: 'AI Micro Degree (Code Unnati)', sponsorName: 'Edunet Foundation', companyName: 'TechMahindra CSR' },
    lang
  );

  const handleDispatch = async () => {
    setIsSending(true);
    try {
      const res = await fetch('/api/notifications/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          parentPhone,
          channel,
          trigger,
          language: lang,
          meta: { courseName: 'AI Micro Degree (Code Unnati)' },
        }),
      });

      if (res.ok) {
        setSentNotice(`Message dispatched via ${channel.toUpperCase()} to ${parentPhone}!`);
        setTimeout(() => setSentNotice(null), 4000);
      }
    } catch {
      // Handled
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Rural Parent WhatsApp &amp; SMS Dispatcher
            </h3>
            <p className="text-xs text-slate-500">
              Send automatic progress milestones to parents in their regional mother tongue.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
          Auto-Localized
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Controls Column */}
        <div className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Student Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Parent Mobile</label>
              <input
                type="text"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dispatch Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              >
                <option value="whatsapp">WhatsApp Message 💬</option>
                <option value="sms">SMS Text Alert 📱</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alert Language</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.nativeLabel} ({l.label})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Milestone Trigger Event</label>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
            >
              <option value="COURSE_COMPLETED">Course &amp; AI Micro Degree Completed 🎓</option>
              <option value="SCHOLARSHIP_AWARDED">100% Free CSR Scholarship Awarded 🎁</option>
              <option value="INTERVIEW_SCHEDULED">Corporate Recruiter Interview Scheduled 💼</option>
              <option value="STREAK_ACHIEVED">Weekly Digital Lab Attendance Streak ⭐</option>
            </select>
          </div>

          <button
            onClick={handleDispatch}
            disabled={isSending}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {isSending ? 'Dispatching Message...' : `Send ${channel.toUpperCase()} Alert`}
          </button>

          {sentNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {sentNotice}
            </div>
          )}

        </div>

        {/* Mobile Phone Mockup Preview */}
        <div className="flex flex-col items-center justify-center bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="w-[280px] bg-slate-950 rounded-3xl border-4 border-slate-700 shadow-2xl p-3 space-y-3">
            
            {/* Phone Screen Header */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1.5 font-mono">
              <span>9:41 AM</span>
              <span>GlobeSkill {channel.toUpperCase()}</span>
            </div>

            {/* Simulated Chat Bubble */}
            <div className="space-y-2 py-4">
              <div className={`p-3 rounded-2xl text-xs shadow-md ${
                channel === 'whatsapp'
                  ? 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-100 rounded-tl-xs'
                  : 'bg-slate-800 text-slate-100 rounded-tl-xs'
              }`}>
                <p className="leading-relaxed">{previewMessage}</p>
                <div className="text-[9px] text-right mt-1 text-emerald-400 font-mono">Just now ✓✓</div>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-500">
              Delivered via GlobeSkill Rural Gateway
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
