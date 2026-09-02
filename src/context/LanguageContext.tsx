"use client";

/**
 * GlobeSkill Language & Translation Engine (English Standard)
 * Clean, standard English text across all components, portals, and UI elements.
 */

import React, { createContext, useContext, useEffect } from 'react';

export type LanguageCode = string;

export interface LanguageOption {
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
];

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (keyOrPhrase: string, fallback?: string) => string;
  isHindi: boolean;
}

const ENGLISH_DICTIONARY: Record<string, string> = {
  brand: 'GlobeSkill',
  subTagline: 'AI & Tech Education',
  coursesNav: 'Courses',
  sandboxNav: 'Sandbox',
  questsNav: 'Quests',
  badgesNav: 'Badges',
  interviewNav: 'Interview',
  communityNav: 'Community',
  portfolioNav: 'Portfolio',
  supportUsNav: 'Support Us',
  demoPrefix: 'Demo:',
  switchRole: 'Switch Demo Role',
  loginBtn: 'Log In',
  signupBtn: 'Sign Up',
  roleStudent: 'Student',
  roleTrainer: 'Trainer',
  roleAdmin: 'Administrator',
  roleDonor: 'Donor',
  roleRecruiter: 'CSR Recruiter Hub',

  // Hero Section
  heroBadge: 'Global Education & Equal Opportunity Initiative',
  heroTagline: 'Technology & AI Education for Every Child',
  heroDescription: 'GlobeSkill is an initiative to help underserved learners gain access to digital skills, technology education and AI-enabled career opportunities.',
  exploreBtn: 'Explore GlobeSkill',
  browseCoursesBtn: 'Browse Course Catalog',
  exploreSuccessMsg: 'GlobeSkill platform is successfully running. Welcome to the future of AI & Digital Education!',
  dismissBtn: 'Dismiss',

  // Floating AI Mentor Button
  askMentor: 'Ask AI Mentor',

  // Role Hubs
  roleHubBadge: 'Interactive Multi-Role Architecture',
  roleHubTitle: 'Built for Every Stakeholder',
  roleHubSubtitle: 'Seamless role-based portals for students, educators, philanthropists, and NGO administrators.',
  studentPortalTitle: 'Student Portal',
  studentPortalDesc: 'Learn AI, Python, & Web Dev with interactive milestone tracking and 24/7 AI mentor guidance.',
  openStudentPortal: 'Open Learning Portal',
  trainerStudioTitle: 'Trainer Studio',
  trainerStudioDesc: 'Author technical syllabi, upload course PDF materials, and inspect live student rosters.',
  launchTrainerStudio: 'Launch Trainer Studio',
  donorHubTitle: 'Support & Donor Hub',
  donorHubDesc: 'Sponsor rural student cohorts, track funding milestones, and download 80G tax receipts.',
  donateImpact: 'Donate & View Impact',
  adminCenterTitle: 'NGO Admin Center',
  adminCenterDesc: 'Real-time enrollment velocity analytics, user role administration, and CSV compliance export.',
  adminGovernance: 'Admin Governance',

  // Pillars
  pillarsTitle: 'Empowering the Next Generation of Technologists',
  pillarsSubtitle: 'Building inclusive bridges from basic digital literacy to applied artificial intelligence competencies.',
  pillar1Title: 'Digital Literacy',
  pillar1Desc: 'Equipping children and youth in underserved communities with essential computing foundations and safe online practices.',
  pillar2Title: 'Applied AI Curriculum',
  pillar2Desc: 'Interactive, age-appropriate AI and machine learning concepts designed to inspire curiosity and critical thinking.',
  pillar3Title: 'Career & Mentorship',
  pillar3Desc: 'Connecting passionate students with tech mentors, hands-on project workshops, and future employment pathways.',

  // System Status
  systemStatus: 'System Status',
  statusOnline: 'Platform Status: Online',
  statusLoading: 'Checking platform status...',
  statusOffline: 'Platform Status: Offline Mode',
  dbConnected: 'Database connected',
  dbDisconnected: 'Database disconnected',
  latencyMs: 'latency',
  uptime: 'uptime',

  // AI Assistant
  aiMentorTitle: 'AI Coding Mentor (Sparky)',
  aiMentorWelcome: "Hi there! I'm Sparky, your GlobeSkill AI Coding Mentor. 🌟 Ask me any programming or AI question, and I'll explain it simply with fun analogies!",
  suggestedQuery1: 'What is an API?',
  suggestedQuery2: 'What is a Variable?',
  suggestedQuery3: 'Why use a Database?',
  placeholderChat: 'Ask Sparky any coding question...',
  sendBtn: 'Send',
  voiceSpeak: 'Read aloud',
  voiceStop: 'Stop voice',
  aiErrorFallback: 'Oops! I ran into a tiny hiccup. But remember: in coding, mistakes are just learning opportunities! Try asking again.',

  // Offline Banner
  offlineModeActive: 'Offline Mode Active',
  lessonsCached: 'Lessons cached in IndexedDB. Updates queued for auto-sync.',
  backOnline: 'Back online! Ready to synchronize offline progress.',
  syncNow: 'Sync Now',
  syncing: 'Syncing...',
  syncedSuccess: 'Offline progress successfully synchronized with GlobeSkill cloud!',

  // Courses
  catalogBadge: 'Free Open NGO Tech Curriculum',
  catalogTitle: 'Skill Development Programs & AI Courses',
  catalogSubtitle: 'High-impact technical courses designed for young minds and underserved learners. From foundational digital literacy to applied machine learning models.',
  searchCoursesPlaceholder: 'Search courses by title, topic, or keyword...',
  filterCategory: 'Category',
  filterLevel: 'Level',
  allCategories: 'All Categories',
  allLevels: 'All Levels',
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  enrollNow: 'Enroll Now (Free)',
  enrolling: 'Enrolling...',
  enrolledSuccess: 'Enrolled! Redirecting...',
  viewCurriculum: 'View Curriculum',
  hoursShort: 'hrs',
  modulesCount: 'modules',

  // Donation
  supportMission: 'Support Our Mission',
  donationTagline: 'Empower 1,000+ Underserved Learners with Hands-on AI & Tech Education',
  taxExemption80G: 'Sec 80G Tax Exemption Registered',
  downloadReceipt: 'Download 80G Tax Receipt',
  enterPanNumber: 'Enter PAN for 80G Tax Exemption',
  proceedToDonate: 'Proceed to Secure Donation',
  sponsorOneStudent: 'Sponsor 1 Student (₹1,500)',
  sponsorCohort: 'Sponsor 1 Cohort of 10 (₹15,000)',
  customAmount: 'Custom Amount',
  donorThankYou: 'Thank you for empowering the next generation of technologists!',

  // Footer
  footerAbout: 'A grassroots technology non-profit bringing world-class AI, computing literacy, and career mentorship to underserved children worldwide.',
  programsTitle: 'Programs & Skills',
  rolePortalsTitle: 'Role Portals',
  getInvolvedTitle: 'Get Involved',
  getInvolvedDesc: 'Help us sponsor 1,000+ underserved learners with hands-on AI learning kits and mentor access.',
  taxExemptionRegistered: '80G Tax Exemption Registered',
  copyrightNotice: 'GlobeSkill Foundation. Empowering technology & AI education for every child.',
  builtForImpact: 'Built for Global Impact',
  apiHealth: 'API Health:',

  // Auth & Forms
  selectRoleLabel: 'Select Your Learning Role',
  fullNameLabel: 'Full Name',
  emailLabel: 'Email Address',
  passwordLabel: 'Password',
  alreadyHaveAccount: 'Already have an account?',
  dontHaveAccount: "Don't have an account?",
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Clear any previous translation cookies and ensure document lang is 'en'
    if (typeof document !== 'undefined') {
      document.documentElement.lang = 'en';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.vercel.app;';
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('globeskill_lang', 'en');
      localStorage.removeItem('googtrans');
    }
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('lang')) {
        url.searchParams.delete('lang');
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
      }
    }
  }, []);

  const t = (keyOrPhrase: string, fallback?: string): string => {
    if (!keyOrPhrase) return fallback || '';
    if (ENGLISH_DICTIONARY[keyOrPhrase]) {
      return ENGLISH_DICTIONARY[keyOrPhrase];
    }
    return fallback || keyOrPhrase;
  };

  return (
    <LanguageContext.Provider
      value={{
        language: 'en',
        setLanguage: () => {},
        t,
        isHindi: false,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    return {
      language: 'en',
      setLanguage: () => {},
      t: (k: string, fb?: string) => ENGLISH_DICTIONARY[k] || fb || k,
      isHindi: false,
    };
  }
  return context;
};

// No-op LanguageSwitcher component for backward compatibility
export const LanguageSwitcher: React.FC<{ className?: string }> = () => null;

export function getLocalizedSystemPrompt(_lang: string = 'en'): string {
  return `
Role: You are 'Sparky', the GlobeSkill AI Coding Mentor, an encouraging, patient, and friendly technical mentor helping young learners learn programming, AI, and digital skills.
Language: Formulate all your responses in clean, encouraging, kid-friendly English with simple analogies and runnable Python code snippets!
`;
}
