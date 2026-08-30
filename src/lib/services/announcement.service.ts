import { Announcement } from '@/types/database';
import { supabase, isSupabaseConfigured, MockDatabaseStore } from '@/lib/supabase/client';

export async function getAnnouncements(targetRole: 'all' | 'student' | 'trainer' = 'all'): Promise<Announcement[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      const all = data as Announcement[];
      return targetRole === 'all' ? all : all.filter((a) => a.target_role === 'all' || a.target_role === targetRole);
    }
  }

  const list = MockDatabaseStore.getAnnouncements();
  return targetRole === 'all' ? list : list.filter((a) => a.target_role === 'all' || a.target_role === targetRole);
}

export async function createAnnouncement(title: string, content: string, authorName: string, targetRole: 'all' | 'student' | 'trainer'): Promise<Announcement> {
  const newAnn: Announcement = {
    id: `ann_${Date.now()}`,
    title,
    content,
    author_name: authorName,
    target_role: targetRole,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    await supabase.from('announcements').insert(newAnn);
  }

  const list = MockDatabaseStore.getAnnouncements();
  list.unshift(newAnn);
  MockDatabaseStore.saveAnnouncements(list);
  return newAnn;
}
