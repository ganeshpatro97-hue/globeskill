-- ============================================================================
-- GLOBESKILL DATABASE SCHEMA MIGRATION
-- PostgreSQL + Supabase with Row Level Security (RLS)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (User Accounts & Roles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  user_role TEXT NOT NULL CHECK (user_role IN ('student', 'trainer', 'admin', 'donor')),
  avatar_url TEXT,
  location TEXT,
  education_background TEXT,
  skill_interests TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  skill_level TEXT NOT NULL CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced')),
  category TEXT NOT NULL CHECK (category IN ('AI & Machine Learning', 'Web & Cloud Development', 'Digital Literacy', 'Career & Mentorship')),
  image_url TEXT,
  syllabus JSONB NOT NULL DEFAULT '[]'::jsonb,
  trainer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'published', 'archived')),
  enrolled_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENROLLMENTS TABLE
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

-- 4. COURSE MATERIALS TABLE (Storage / Docs)
CREATE TABLE IF NOT EXISTS public.course_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'slide', 'code', 'doc')),
  file_size_kb INTEGER NOT NULL DEFAULT 0,
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  target_role TEXT NOT NULL DEFAULT 'all' CHECK (target_role IN ('all', 'student', 'trainer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DONORS & DONATIONS TABLE
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('card', 'upi', 'netbanking')),
  payment_status TEXT NOT NULL DEFAULT 'succeeded' CHECK (payment_status IN ('succeeded', 'pending', 'failed')),
  transaction_id TEXT NOT NULL UNIQUE,
  cause_target TEXT NOT NULL CHECK (cause_target IN ('general', 'ai-scholarship', 'rural-lab', 'women-in-tech', 'devices-for-kids')),
  sponsor_target_name TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AI LEARNING SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.ai_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_sessions ENABLE ROW LEVEL SECURITY;

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
ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view and update all profiles" 
ON public.profiles FOR ALL USING (public.is_admin());

-- Courses Policies
CREATE POLICY "Published courses are viewable by everyone" 
ON public.courses FOR SELECT USING (status = 'published' OR auth.uid() = trainer_id OR public.is_admin());

CREATE POLICY "Trainers can create courses" 
ON public.courses FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role IN ('trainer', 'admin'))
);

CREATE POLICY "Trainers can update their own courses" 
ON public.courses FOR UPDATE USING (
  auth.uid() = trainer_id OR public.is_admin()
);

-- Enrollments Policies
CREATE POLICY "Students can view their own enrollments" 
ON public.enrollments FOR SELECT USING (
  auth.uid() = student_id OR 
  EXISTS (SELECT 1 FROM public.courses WHERE id = enrollments.course_id AND trainer_id = auth.uid()) OR
  public.is_admin()
);

CREATE POLICY "Students can enroll themselves" 
ON public.enrollments FOR INSERT WITH CHECK (
  auth.uid() = student_id
);

CREATE POLICY "Students can update their progress" 
ON public.enrollments FOR UPDATE USING (
  auth.uid() = student_id OR public.is_admin()
);

-- Donations Policies
CREATE POLICY "Donors can view their own donations" 
ON public.donations FOR SELECT USING (
  auth.uid() = donor_id OR public.is_admin()
);

CREATE POLICY "Anyone can create donations" 
ON public.donations FOR INSERT WITH CHECK (true);

-- AI Sessions Policies
CREATE POLICY "Users manage their own AI sessions" 
ON public.ai_sessions FOR ALL USING (
  auth.uid() = user_id
);

-- Announcements Policies
CREATE POLICY "Everyone can view announcements" 
ON public.announcements FOR SELECT USING (true);

CREATE POLICY "Trainers and Admins can create announcements" 
ON public.announcements FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role IN ('trainer', 'admin'))
);
