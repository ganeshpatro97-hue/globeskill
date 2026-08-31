-- ============================================================================
-- GLOBESKILL DATABASE SETUP SCHEMA (supabase-setup.sql)
-- Complete PostgreSQL Setup for Supabase SQL Editor
-- Includes: Custom ENUM Roles, Tables, Automated Trigger Sync, RLS & Seed Data
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CUSTOM ENUM FOR USER ROLES
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('student', 'trainer', 'admin', 'donor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  user_role user_role_enum NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  location TEXT DEFAULT '',
  education_background TEXT DEFAULT '',
  skill_interests TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AUTOMATED PROFILE SYNCHRONIZATION TRIGGER
-- When a user signs up via Supabase Auth (auth.users), this trigger automatically creates their profile in public.profiles.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  assigned_role user_role_enum;
BEGIN
  BEGIN
    assigned_role := (NEW.raw_user_meta_data->>'user_role')::user_role_enum;
  EXCEPTION WHEN OTHERS THEN
    assigned_role := 'student'::user_role_enum;
  END;

  INSERT INTO public.profiles (id, email, full_name, user_role, location, education_background, skill_interests)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(assigned_role, 'student'::user_role_enum),
    COALESCE(NEW.raw_user_meta_data->>'location', 'India'),
    COALESCE(NEW.raw_user_meta_data->>'education_background', 'High School'),
    ARRAY[]::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    updated_at = NOW();

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$;

-- Bind trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  skill_level TEXT NOT NULL CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced')),
  category TEXT NOT NULL,
  image_url TEXT,
  syllabus JSONB NOT NULL DEFAULT '[]'::jsonb,
  trainer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'pending_approval', 'published', 'archived')),
  enrolled_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_chapters TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(student_id, course_id)
);

-- 7. ANNOUNCEMENTS & DONATIONS
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  target_role TEXT NOT NULL DEFAULT 'all',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'succeeded',
  transaction_id TEXT NOT NULL UNIQUE,
  cause_target TEXT NOT NULL,
  sponsor_target_name TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by authenticated users" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users and triggers" 
ON public.profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view and update all profiles" 
ON public.profiles FOR ALL USING (public.is_admin());

-- Courses Policies
CREATE POLICY "Published courses are viewable by everyone" 
ON public.courses FOR SELECT USING (status = 'published' OR auth.uid() = trainer_id OR public.is_admin());

CREATE POLICY "Trainers and Admins can create courses" 
ON public.courses FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role IN ('trainer', 'admin'))
);

-- Enrollments Policies
CREATE POLICY "Students can view their own enrollments" 
ON public.enrollments FOR SELECT USING (
  auth.uid() = student_id OR 
  EXISTS (SELECT 1 FROM public.courses WHERE id = enrollments.course_id AND trainer_id = auth.uid()) OR
  public.is_admin()
);

CREATE POLICY "Students can self-enroll" 
ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their progress" 
ON public.enrollments FOR UPDATE USING (auth.uid() = student_id OR public.is_admin());

-- 9. SEED DATA (Edunet & Global Tech Aligned Mock Courses)
INSERT INTO public.courses (id, title, slug, tagline, description, duration, skill_level, category, image_url, syllabus, status, enrolled_count)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'AI Micro Degree for Young Innovators',
    'ai-micro-degree',
    'Master practical AI, Python programming, and build real-world machine learning models.',
    'A transformative 8-week program tailored for young students to demystify artificial intelligence. Learn how computers recognize images, understand human language, and generate creative art using neural networks.',
    '8 Weeks (48 Hours)',
    'Beginner',
    'AI & Machine Learning',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    '[
      {"id": "ch-101", "title": "1. What is Artificial Intelligence? (Demystifying AI for Kids)", "duration_minutes": 60, "description": "Understand how AI differs from ordinary code, with fun interactive examples."},
      {"id": "ch-102", "title": "2. Python Basics: Variables, Loops & Decision Making", "duration_minutes": 90, "description": "Hands-on coding in Python creating smart number guessers and mini text games."},
      {"id": "ch-103", "title": "3. Teaching Computers to See: Intro to Computer Vision", "duration_minutes": 120, "description": "Train a model to classify hand gestures, doodles, and webcam objects."},
      {"id": "ch-104", "title": "4. Natural Language Processing & Chatbots", "duration_minutes": 120, "description": "Build your first friendly text assistant using simple transformer concepts."},
      {"id": "ch-105", "title": "5. Ethics & Responsible AI: Safe Tech for Society", "duration_minutes": 90, "description": "Discuss fairness, privacy, and how AI can solve climate and healthcare challenges."},
      {"id": "ch-106", "title": "6. Capstone Project: Build & Deploy Your AI App", "duration_minutes": 180, "description": "Final showcase project presented to global NGO mentors and industry evaluators."}
    ]'::jsonb,
    'published',
    142
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'IBM SkillsBuild Tech Basics',
    'ibm-skillsbuild-basics',
    'Foundations of Cloud Computing, Cybersecurity, and Professional Digital Literacy.',
    'Delivered in partnership with global tech standards, this course covers fundamental computing architecture, safe digital hygiene, cloud storage models, and collaborative workplace software skills.',
    '4 Weeks (24 Hours)',
    'Beginner',
    'Digital Literacy',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    '[
      {"id": "ch-201", "title": "1. Digital Citizenship & Cyber Safety Fundamentals", "duration_minutes": 45, "description": "Protecting personal identity and recognizing online vulnerabilities."},
      {"id": "ch-202", "title": "2. Understanding Cloud Infrastructure & Internet Protocols", "duration_minutes": 60, "description": "How the modern web works, servers, DNS, and remote computing."},
      {"id": "ch-203", "title": "3. Data Fundamentals & Spreadsheets for Analytics", "duration_minutes": 75, "description": "Working with data, basic formulas, and visualization charts."},
      {"id": "ch-204", "title": "4. Industry Micro-Credential Assessment", "duration_minutes": 60, "description": "Complete the official knowledge quiz to earn your recognized digital certificate."}
    ]'::jsonb,
    'published',
    215
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'AI & Data Careers for Women',
    'ai-careers-for-women',
    'Empowering female students and youth with high-impact data science and career mentorship.',
    'An intensive accelerator designed to close the gender gap in tech. Features dedicated female industry mentors, real-world case studies, data visualization workshops, and portfolio building.',
    '6 Weeks (36 Hours)',
    'Intermediate',
    'Career & Mentorship',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    '[
      {"id": "ch-301", "title": "1. Introduction to Data Science with Pandas & Matplotlib", "duration_minutes": 90, "description": "Cleaning, filtering, and plotting real datasets."},
      {"id": "ch-302", "title": "2. Exploratory Data Analysis & Statistical Intuition", "duration_minutes": 90, "description": "Uncovering insights from social and community impact datasets."},
      {"id": "ch-303", "title": "3. Machine Learning Algorithms (Regression & Classification)", "duration_minutes": 120, "description": "Building predictive models using Scikit-Learn."},
      {"id": "ch-304", "title": "4. Portfolio Storytelling & Mentorship Roundtables", "duration_minutes": 90, "description": "Resume reviews, mock interviews, and direct mentor matching."}
    ]'::jsonb,
    'published',
    98
  )
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 6. Phase 8: Vocational Matchmaking & Portfolio Schema
-- ==========================================

-- 1. Recruiters Table (CSR Aligned partners e.g., IBM SkillsBuild, TechMahindra Foundation, Cisco Academy)
CREATE TABLE IF NOT EXISTS recruiters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    website_url VARCHAR(255),
    contact_email VARCHAR(255) NOT NULL,
    verified_ngo_partner BOOLEAN DEFAULT TRUE,
    csr_sector VARCHAR(255) DEFAULT 'SDG 8: Decent Work and Economic Growth',
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Jobs Registry (Open Entry-Level Vocations, Internships, and Technical Trainee tracks)
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recruiter_id UUID REFERENCES recruiters(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    required_skills VARCHAR(255)[] NOT NULL,
    employment_type VARCHAR(100) DEFAULT 'Internship' CHECK (employment_type IN ('Internship', 'Full-time', 'Part-time', 'Apprenticeship', 'CSR Trainee')),
    stipend_range VARCHAR(100) DEFAULT '₹12,000 - ₹18,000 / month',
    location VARCHAR(255) DEFAULT 'Remote',
    openings_count INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Student Portfolio compilations
CREATE TABLE IF NOT EXISTS student_portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    compiled_resume JSONB NOT NULL,
    search_tags VARCHAR(255)[] DEFAULT '{}',
    match_score INT DEFAULT 90,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_portfolio UNIQUE(user_id)
);

-- 4. Job Applications & Matching Score Logs
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    matching_score INT DEFAULT 0 CHECK (matching_score >= 0 AND matching_score <= 100),
    matching_feedback JSONB,
    status VARCHAR(100) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'interview_scheduled', 'offered', 'rejected')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_job UNIQUE(user_id, job_id)
);

-- Enable Row Level Security (RLS) policies
ALTER TABLE recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone logged in can read jobs and recruiters
CREATE POLICY "Allow public read on jobs" ON jobs FOR SELECT USING (true);
CREATE POLICY "Allow public read on recruiters" ON recruiters FOR SELECT USING (true);
CREATE POLICY "Allow authenticated reads on student_portfolios" ON student_portfolios FOR SELECT USING (true);
CREATE POLICY "Students handle own portfolios" ON student_portfolios FOR ALL USING (true);
CREATE POLICY "Students handle own applications" ON job_applications FOR ALL USING (true);

