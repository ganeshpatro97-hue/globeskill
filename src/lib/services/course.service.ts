import { Course, CourseMaterial, SyllabusChapter } from '@/types/database';
import { supabase, isSupabaseConfigured, MockDatabaseStore } from '@/lib/supabase/client';

export async function getAllCourses(includeUnpublished = false): Promise<Course[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('courses').select('*');
    if (!includeUnpublished) {
      query = query.eq('status', 'published');
    }
    const { data, error } = await query;
    if (!error && data) return data as Course[];
  }

  const courses = MockDatabaseStore.getCourses();
  return includeUnpublished ? courses : courses.filter((c) => c.status === 'published');
}

export async function getCourseById(id: string): Promise<Course | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('courses').select('*').eq('id', id).single();
    if (!error && data) return data as Course;
  }

  const courses = MockDatabaseStore.getCourses();
  return courses.find((c) => c.id === id || c.slug === id) || null;
}

export async function getTrainerCourses(trainerId: string): Promise<Course[]> {
  const courses = await getAllCourses(true);
  return courses.filter((c) => c.trainer_id === trainerId || c.trainer_id.startsWith('00000000-0000-0000-0000-000000000002'));
}

export interface CreateCourseParams {
  title: string;
  tagline: string;
  description: string;
  duration: string;
  skill_level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'AI & Machine Learning' | 'Web & Cloud Development' | 'Digital Literacy' | 'Career & Mentorship';
  trainer_id: string;
  trainer_name?: string;
  syllabus: SyllabusChapter[];
  image_url?: string;
}

export async function createCourse(params: CreateCourseParams): Promise<Course> {
  const slug = params.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newCourse: Course = {
    id: `crs_${Date.now()}`,
    ...params,
    slug,
    image_url: params.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    status: 'published', // Instantly available for students in learning portal
    enrolled_count: 0,
    materials: [],
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    await supabase.from('courses').insert(newCourse);
  }

  const courses = MockDatabaseStore.getCourses();
  courses.unshift(newCourse);
  MockDatabaseStore.saveCourses(courses);
  return newCourse;
}

export async function addCourseMaterial(courseId: string, title: string, fileType: 'pdf' | 'slide' | 'code' | 'doc', fileUrl = '#'): Promise<CourseMaterial> {
  const newMaterial: CourseMaterial = {
    id: `mat_${Date.now()}`,
    course_id: courseId,
    title,
    file_url: fileUrl,
    file_type: fileType,
    file_size_kb: Math.floor(Math.random() * 2000) + 500,
    uploaded_at: new Date().toISOString(),
  };

  const courses = MockDatabaseStore.getCourses();
  const course = courses.find((c) => c.id === courseId);
  if (course) {
    course.materials = course.materials || [];
    course.materials.push(newMaterial);
    MockDatabaseStore.saveCourses(courses);
  }
  return newMaterial;
}

export async function updateCourseStatus(courseId: string, status: 'draft' | 'pending_approval' | 'published' | 'archived'): Promise<Course> {
  const courses = MockDatabaseStore.getCourses();
  const course = courses.find((c) => c.id === courseId);
  if (!course) throw new Error('Course not found');

  course.status = status;
  course.updated_at = new Date().toISOString();
  MockDatabaseStore.saveCourses(courses);
  return course;
}
