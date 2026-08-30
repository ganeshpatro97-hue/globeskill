import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Course, UserProfile, Enrollment, Announcement, Donation } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-project-id') &&
  !supabaseAnonKey.includes('your-supabase-anon-key')
);

// Create live Supabase client if configured, otherwise fallback gracefully
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================================================
// IN-MEMORY / LOCAL STORAGE HYBRID RESILIENT DATA STORE
// Enables zero-friction offline execution & testing for all GlobeSkill phases
// ============================================================================

const INITIAL_COURSES: Course[] = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    title: 'AI Micro Degree for Young Innovators',
    slug: 'ai-micro-degree',
    tagline: 'Master practical AI, Python programming, and build real-world machine learning models.',
    description: 'A transformative 8-week program tailored for young students to demystify artificial intelligence. Learn how computers recognize images, understand human language, and generate creative art using neural networks.',
    duration: '8 Weeks (48 Hours)',
    skill_level: 'Beginner',
    category: 'AI & Machine Learning',
    image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    syllabus: [
      { id: 'ch-101', title: '1. What is Artificial Intelligence? (Demystifying AI for Kids)', duration_minutes: 60, description: 'Understand how AI differs from ordinary code, with fun interactive examples.' },
      { id: 'ch-102', title: '2. Python Basics: Variables, Loops & Decision Making', duration_minutes: 90, description: 'Hands-on coding in Python creating smart number guessers and mini text games.' },
      { id: 'ch-103', title: '3. Teaching Computers to See: Intro to Computer Vision', duration_minutes: 120, description: 'Train a model to classify hand gestures, doodles, and webcam objects.' },
      { id: 'ch-104', title: '4. Natural Language Processing & Chatbots', duration_minutes: 120, description: 'Build your first friendly text assistant using simple transformer concepts.' },
      { id: 'ch-105', title: '5. Ethics & Responsible AI: Safe Tech for Society', duration_minutes: 90, description: 'Discuss fairness, privacy, and how AI can solve climate and healthcare challenges.' },
      { id: 'ch-106', title: '6. Capstone Project: Build & Deploy Your AI App', duration_minutes: 180, description: 'Final showcase project presented to global NGO mentors and industry evaluators.' }
    ],
    trainer_id: '00000000-0000-0000-0000-000000000002',
    trainer_name: 'Priya Patel (Lead AI Instructor)',
    status: 'published',
    enrolled_count: 142,
    materials: [
      { id: 'm-101', course_id: '10000000-0000-0000-0000-000000000001', title: 'AI Foundations Handbook (PDF)', file_url: '#', file_type: 'pdf', file_size_kb: 2450, uploaded_at: '2026-08-01' },
      { id: 'm-102', course_id: '10000000-0000-0000-0000-000000000001', title: 'Python Starter Notebooks (.ipynb)', file_url: '#', file_type: 'code', file_size_kb: 420, uploaded_at: '2026-08-05' }
    ],
    created_at: '2026-08-01T00:00:00Z'
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    title: 'IBM SkillsBuild Tech Basics',
    slug: 'ibm-skillsbuild-basics',
    tagline: 'Foundations of Cloud Computing, Cybersecurity, and Professional Digital Literacy.',
    description: 'Delivered in partnership with global tech standards, this course covers fundamental computing architecture, safe digital hygiene, cloud storage models, and collaborative workplace software skills.',
    duration: '4 Weeks (24 Hours)',
    skill_level: 'Beginner',
    category: 'Digital Literacy',
    image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    syllabus: [
      { id: 'ch-201', title: '1. Digital Citizenship & Cyber Safety Fundamentals', duration_minutes: 45, description: 'Protecting personal identity and recognizing online vulnerabilities.' },
      { id: 'ch-202', title: '2. Understanding Cloud Infrastructure & Internet Protocols', duration_minutes: 60, description: 'How the modern web works, servers, DNS, and remote computing.' },
      { id: 'ch-203', title: '3. Data Fundamentals & Spreadsheets for Analytics', duration_minutes: 75, description: 'Working with data, basic formulas, and visualization charts.' },
      { id: 'ch-204', title: '4. Industry Micro-Credential Assessment', duration_minutes: 60, description: 'Complete the official knowledge quiz to earn your recognized digital certificate.' }
    ],
    trainer_id: '00000000-0000-0000-0000-000000000002',
    trainer_name: 'Priya Patel (Lead AI Instructor)',
    status: 'published',
    enrolled_count: 215,
    materials: [
      { id: 'm-201', course_id: '10000000-0000-0000-0000-000000000002', title: 'Cyber Hygiene Checklist (PDF)', file_url: '#', file_type: 'pdf', file_size_kb: 1200, uploaded_at: '2026-08-03' }
    ],
    created_at: '2026-08-03T00:00:00Z'
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    title: 'AI & Data Careers for Women',
    slug: 'ai-careers-for-women',
    tagline: 'Empowering female students and youth with high-impact data science and career mentorship.',
    description: 'An intensive accelerator designed to close the gender gap in tech. Features dedicated female industry mentors, real-world case studies, data visualization workshops, and portfolio building.',
    duration: '6 Weeks (36 Hours)',
    skill_level: 'Intermediate',
    category: 'Career & Mentorship',
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    syllabus: [
      { id: 'ch-301', title: '1. Introduction to Data Science with Pandas & Matplotlib', duration_minutes: 90, description: 'Cleaning, filtering, and plotting real datasets.' },
      { id: 'ch-302', title: '2. Exploratory Data Analysis & Statistical Intuition', duration_minutes: 90, description: 'Uncovering insights from social and community impact datasets.' },
      { id: 'ch-303', title: '3. Machine Learning Algorithms (Regression & Classification)', duration_minutes: 120, description: 'Building predictive models using Scikit-Learn.' },
      { id: 'ch-304', title: '4. Portfolio Storytelling & Mentorship Roundtables', duration_minutes: 90, description: 'Resume reviews, mock interviews, and direct mentor matching.' }
    ],
    trainer_id: '00000000-0000-0000-0000-000000000002',
    trainer_name: 'Priya Patel (Lead AI Instructor)',
    status: 'published',
    enrolled_count: 98,
    materials: [
      { id: 'm-301', course_id: '10000000-0000-0000-0000-000000000003', title: 'Data Science Guidebook', file_url: '#', file_type: 'pdf', file_size_kb: 3100, uploaded_at: '2026-08-08' }
    ],
    created_at: '2026-08-08T00:00:00Z'
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    title: 'Full-Stack Web Development & Creative Coding',
    slug: 'web-dev-creative-coding',
    tagline: 'Build websites, interactive apps, and creative games with HTML, CSS, JavaScript & React.',
    description: 'From zero coding experience to deploying your own live applications on the web. Learn responsive design, modern JavaScript frameworks, and how to publish projects to the world.',
    duration: '6 Weeks (40 Hours)',
    skill_level: 'Beginner',
    category: 'Web & Cloud Development',
    image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    syllabus: [
      { id: 'ch-401', title: '1. HTML5 Structure & Semantic Layouts', duration_minutes: 60, description: 'Creating clean web pages with accessible tags.' },
      { id: 'ch-402', title: '2. Modern CSS & Responsive Flexbox / Grid', duration_minutes: 90, description: 'Styling mobile-friendly web pages that look stunning.' },
      { id: 'ch-403', title: '3. JavaScript Magic: Interactivity & Logic', duration_minutes: 120, description: 'Building interactive quizzes, calculator, and sound boards.' },
      { id: 'ch-404', title: '4. Intro to React & Next.js Components', duration_minutes: 120, description: 'State management, component reusability, and deploying online.' }
    ],
    trainer_id: '00000000-0000-0000-0000-000000000002',
    trainer_name: 'Priya Patel (Lead AI Instructor)',
    status: 'published',
    enrolled_count: 188,
    materials: [],
    created_at: '2026-08-10T00:00:00Z'
  }
];

const INITIAL_PROFILES: UserProfile[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'admin@globeskill.org',
    full_name: 'Aarav Sharma (Admin)',
    user_role: 'admin',
    location: 'New Delhi, India',
    education_background: 'M.Tech Computer Science',
    skill_interests: ['AI Systems', 'Curriculum Design'],
    created_at: '2026-08-01T00:00:00Z'
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'trainer.priya@globeskill.org',
    full_name: 'Priya Patel (Lead Trainer)',
    user_role: 'trainer',
    location: 'Bengaluru, India',
    education_background: 'Senior AI Engineer & Educator',
    skill_interests: ['Python', 'Machine Learning', 'Computer Vision'],
    created_at: '2026-08-01T00:00:00Z'
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'student.rohit@globeskill.org',
    full_name: 'Rohit Kumar (Student)',
    user_role: 'student',
    location: 'Patna, Bihar',
    education_background: 'High School (Class 10)',
    skill_interests: ['Python Basics', 'Web Dev', 'Robotics'],
    created_at: '2026-08-10T00:00:00Z'
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    email: 'donor.vikram@techgives.org',
    full_name: 'Vikram Malhotra (Global Funder)',
    user_role: 'donor',
    location: 'Mumbai, India',
    education_background: 'Tech Philanthropist',
    skill_interests: ['Rural Digital Labs', 'AI for Kids'],
    created_at: '2026-08-12T00:00:00Z'
  }
];

const INITIAL_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enr-001',
    student_id: '00000000-0000-0000-0000-000000000003',
    student_name: 'Rohit Kumar (Student)',
    student_email: 'student.rohit@globeskill.org',
    course_id: '10000000-0000-0000-0000-000000000001',
    course_title: 'AI Micro Degree for Young Innovators',
    progress_percentage: 50,
    completed_chapters: ['ch-101', 'ch-102', 'ch-103'],
    status: 'active',
    enrolled_at: '2026-08-15T00:00:00Z'
  },
  {
    id: 'enr-002',
    student_id: '00000000-0000-0000-0000-000000000003',
    student_name: 'Rohit Kumar (Student)',
    student_email: 'student.rohit@globeskill.org',
    course_id: '10000000-0000-0000-0000-000000000002',
    course_title: 'IBM SkillsBuild Tech Basics',
    progress_percentage: 25,
    completed_chapters: ['ch-201'],
    status: 'active',
    enrolled_at: '2026-08-18T00:00:00Z'
  }
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-001',
    title: '🎉 New Weekend Batch for AI Micro Degree starting this Saturday!',
    content: 'Welcome all new students! Orientation starts live at 10:00 AM IST with live coding exercises and mentor breakouts.',
    author_name: 'Aarav Sharma (Admin)',
    target_role: 'all',
    created_at: '2026-08-25T10:00:00Z'
  },
  {
    id: 'ann-002',
    title: '📢 Trainer Workshop: Upgraded AI Curriculum Tools',
    content: 'Trainers can now upload custom Jupyter notebooks and downloadable PDFs directly from their course studio dashboard.',
    author_name: 'Priya Patel (Lead Trainer)',
    target_role: 'trainer',
    created_at: '2026-08-27T14:30:00Z'
  },
  {
    id: 'ann-003',
    title: '💡 Hackathon Announcement: AI for Community Challenge',
    content: 'Students can team up to build an AI project solving a local community problem. Winners receive sponsored laptops and mentorship.',
    author_name: 'GlobeSkill Academic Team',
    target_role: 'student',
    created_at: '2026-08-29T09:15:00Z'
  }
];

const INITIAL_DONATIONS: Donation[] = [
  {
    id: 'don-001',
    donor_id: '00000000-0000-0000-0000-000000000004',
    donor_name: 'Vikram Malhotra',
    donor_email: 'donor.vikram@techgives.org',
    amount: 50000,
    currency: 'INR',
    payment_method: 'card',
    payment_status: 'succeeded',
    transaction_id: 'GS-TXN-20260815-9821',
    cause_target: 'ai-scholarship',
    sponsor_target_name: 'Bihar AI Youth Cohort',
    receipt_url: '/api/donations/receipt?id=don-001',
    created_at: '2026-08-15T12:00:00Z'
  },
  {
    id: 'don-002',
    donor_id: '00000000-0000-0000-0000-000000000004',
    donor_name: 'Ananya Deshmukh',
    donor_email: 'ananya.deshmukh@impactfund.org',
    amount: 25000,
    currency: 'INR',
    payment_method: 'upi',
    payment_status: 'succeeded',
    transaction_id: 'GS-TXN-20260820-4412',
    cause_target: 'women-in-tech',
    sponsor_target_name: 'Women in Tech Fellowship',
    receipt_url: '/api/donations/receipt?id=don-002',
    created_at: '2026-08-20T16:30:00Z'
  },
  {
    id: 'don-003',
    donor_id: '00000000-0000-0000-0000-000000000004',
    donor_name: 'Sunil Rao Foundation',
    donor_email: 'contact@sunilraofoundation.org',
    amount: 100000,
    currency: 'INR',
    payment_method: 'netbanking',
    payment_status: 'succeeded',
    transaction_id: 'GS-TXN-20260824-7719',
    cause_target: 'rural-lab',
    sponsor_target_name: 'Rajasthan Digital Literacy Center',
    receipt_url: '/api/donations/receipt?id=don-003',
    created_at: '2026-08-24T11:45:00Z'
  }
];

// Helper to get or initialize LocalStorage / in-memory store in client browser
export class MockDatabaseStore {
  private static getKey(key: string): string {
    return `globeskill_db_${key}`;
  }

  static getProfiles(): UserProfile[] {
    if (typeof window === 'undefined') return INITIAL_PROFILES;
    const stored = localStorage.getItem(this.getKey('profiles'));
    if (!stored) {
      localStorage.setItem(this.getKey('profiles'), JSON.stringify(INITIAL_PROFILES));
      return INITIAL_PROFILES;
    }
    return JSON.parse(stored);
  }

  static saveProfiles(profiles: UserProfile[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getKey('profiles'), JSON.stringify(profiles));
    }
  }

  static getCourses(): Course[] {
    if (typeof window === 'undefined') return INITIAL_COURSES;
    const stored = localStorage.getItem(this.getKey('courses'));
    if (!stored) {
      localStorage.setItem(this.getKey('courses'), JSON.stringify(INITIAL_COURSES));
      return INITIAL_COURSES;
    }
    return JSON.parse(stored);
  }

  static saveCourses(courses: Course[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getKey('courses'), JSON.stringify(courses));
    }
  }

  static getEnrollments(): Enrollment[] {
    if (typeof window === 'undefined') return INITIAL_ENROLLMENTS;
    const stored = localStorage.getItem(this.getKey('enrollments'));
    if (!stored) {
      localStorage.setItem(this.getKey('enrollments'), JSON.stringify(INITIAL_ENROLLMENTS));
      return INITIAL_ENROLLMENTS;
    }
    return JSON.parse(stored);
  }

  static saveEnrollments(enrollments: Enrollment[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getKey('enrollments'), JSON.stringify(enrollments));
    }
  }

  static getAnnouncements(): Announcement[] {
    if (typeof window === 'undefined') return INITIAL_ANNOUNCEMENTS;
    const stored = localStorage.getItem(this.getKey('announcements'));
    if (!stored) {
      localStorage.setItem(this.getKey('announcements'), JSON.stringify(INITIAL_ANNOUNCEMENTS));
      return INITIAL_ANNOUNCEMENTS;
    }
    return JSON.parse(stored);
  }

  static saveAnnouncements(announcements: Announcement[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getKey('announcements'), JSON.stringify(announcements));
    }
  }

  static getDonations(): Donation[] {
    if (typeof window === 'undefined') return INITIAL_DONATIONS;
    const stored = localStorage.getItem(this.getKey('donations'));
    if (!stored) {
      localStorage.setItem(this.getKey('donations'), JSON.stringify(INITIAL_DONATIONS));
      return INITIAL_DONATIONS;
    }
    return JSON.parse(stored);
  }

  static saveDonations(donations: Donation[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getKey('donations'), JSON.stringify(donations));
    }
  }
}
