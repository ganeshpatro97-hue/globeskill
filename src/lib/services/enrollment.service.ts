import { Enrollment, Course } from '@/types/database';
import { supabase, isSupabaseConfigured, MockDatabaseStore } from '@/lib/supabase/client';
import { getCourseById } from './course.service';

export async function enrollStudentInCourse(studentId: string, courseId: string, studentName?: string, studentEmail?: string): Promise<Enrollment> {
  const course = await getCourseById(courseId);
  if (!course) throw new Error('Course not found');

  if (isSupabaseConfigured && supabase) {
    const { data: existing } = await supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .single();

    if (existing) return existing as Enrollment;

    const newEnr = {
      student_id: studentId,
      course_id: courseId,
      progress_percentage: 0,
      completed_chapters: [],
      status: 'active',
      enrolled_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('enrollments').insert(newEnr).select().single();
    if (!error && data) return data as Enrollment;
  }

  const enrollments = MockDatabaseStore.getEnrollments();
  const found = enrollments.find((e) => e.student_id === studentId && e.course_id === courseId);
  if (found) return found;

  const newEnrollment: Enrollment = {
    id: `enr_${Date.now()}`,
    student_id: studentId,
    student_name: studentName || 'Student Learner',
    student_email: studentEmail || 'student@globeskill.org',
    course_id: courseId,
    course_title: course.title,
    progress_percentage: 0,
    completed_chapters: [],
    status: 'active',
    enrolled_at: new Date().toISOString(),
  };

  enrollments.push(newEnrollment);
  MockDatabaseStore.saveEnrollments(enrollments);

  // Increment enrolled count
  const courses = MockDatabaseStore.getCourses();
  const cIndex = courses.findIndex((c) => c.id === courseId);
  if (cIndex !== -1) {
    courses[cIndex].enrolled_count = (courses[cIndex].enrolled_count || 0) + 1;
    MockDatabaseStore.saveCourses(courses);
  }

  return newEnrollment;
}

export async function getStudentEnrollments(studentId: string): Promise<{ enrollment: Enrollment; course: Course }[]> {
  const enrollments = MockDatabaseStore.getEnrollments().filter((e) => e.student_id === studentId || studentId.startsWith('00000000-0000-0000-0000-000000000003') || studentId === 'usr_demo_student');
  const courses = MockDatabaseStore.getCourses();

  const results: { enrollment: Enrollment; course: Course }[] = [];
  for (const enr of enrollments) {
    const course = courses.find((c) => c.id === enr.course_id);
    if (course) {
      results.push({ enrollment: enr, course });
    }
  }
  return results;
}

export async function toggleChapterProgress(enrollmentId: string, chapterId: string): Promise<Enrollment> {
  const enrollments = MockDatabaseStore.getEnrollments();
  const enr = enrollments.find((e) => e.id === enrollmentId);
  if (!enr) throw new Error('Enrollment not found');

  const course = await getCourseById(enr.course_id);
  if (!course) throw new Error('Course not found');

  const totalChapters = course.syllabus.length || 1;
  const isCompleted = enr.completed_chapters.includes(chapterId);

  if (isCompleted) {
    enr.completed_chapters = enr.completed_chapters.filter((c) => c !== chapterId);
  } else {
    enr.completed_chapters.push(chapterId);
  }

  enr.progress_percentage = Math.min(100, Math.round((enr.completed_chapters.length / totalChapters) * 100));
  if (enr.progress_percentage === 100) {
    enr.status = 'completed';
    enr.completed_at = new Date().toISOString();
  } else {
    enr.status = 'active';
  }

  MockDatabaseStore.saveEnrollments(enrollments);
  return enr;
}

export async function getCourseRoster(courseId: string): Promise<Enrollment[]> {
  const enrollments = MockDatabaseStore.getEnrollments();
  return enrollments.filter((e) => e.course_id === courseId);
}
