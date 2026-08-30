export type UserRole = 'student' | 'trainer' | 'admin' | 'donor';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  user_role: UserRole;
  avatar_url?: string;
  location?: string;
  education_background?: string;
  skill_interests?: string[];
  created_at: string;
  updated_at?: string;
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseCategory = 'AI & Machine Learning' | 'Web & Cloud Development' | 'Digital Literacy' | 'Career & Mentorship';
export type CourseStatus = 'draft' | 'pending_approval' | 'published' | 'archived';

export interface SyllabusChapter {
  id: string;
  title: string;
  duration_minutes: number;
  description: string;
  video_or_content_url?: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  duration: string; // e.g. "6 Weeks"
  skill_level: SkillLevel;
  category: CourseCategory;
  image_url?: string;
  syllabus: SyllabusChapter[];
  trainer_id: string;
  trainer_name?: string;
  status: CourseStatus;
  enrolled_count: number;
  materials?: CourseMaterial[];
  created_at: string;
  updated_at?: string;
}

export interface CourseMaterial {
  id: string;
  course_id: string;
  title: string;
  file_url: string;
  file_type: 'pdf' | 'slide' | 'code' | 'doc';
  file_size_kb: number;
  uploaded_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  student_name?: string;
  student_email?: string;
  course_id: string;
  course_title?: string;
  progress_percentage: number;
  completed_chapters: string[];
  status: 'active' | 'completed' | 'dropped';
  enrolled_at: string;
  completed_at?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author_name: string;
  target_role: 'all' | 'student' | 'trainer';
  created_at: string;
}

export type DonationCause = 
  | 'general' 
  | 'ai-scholarship' 
  | 'rural-lab' 
  | 'women-in-tech' 
  | 'devices-for-kids';

export interface Donation {
  id: string;
  donor_id: string;
  donor_name: string;
  donor_email: string;
  amount: number;
  currency: string;
  payment_method: 'card' | 'upi' | 'netbanking';
  payment_status: 'succeeded' | 'pending' | 'failed';
  transaction_id: string;
  cause_target: DonationCause;
  sponsor_target_name?: string;
  receipt_url?: string;
  created_at: string;
}

export interface DonationStats {
  totalFundsRaised: number;
  targetGoal: number;
  totalDonors: number;
  averageDonation: number;
  studentsSponsored: number;
  causeBreakdown: Record<DonationCause, number>;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface AiSession {
  id: string;
  user_id: string;
  title: string;
  messages: AiChatMessage[];
  updated_at: string;
}

export interface AdminMetrics {
  totalStudents: number;
  totalTrainers: number;
  totalCourses: number;
  totalFundsRaised: number;
  courseCompletions: number;
  monthlyEnrollments: { month: string; count: number }[];
  causeFunding: { cause: string; amount: number }[];
}
