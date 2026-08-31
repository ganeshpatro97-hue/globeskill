/**
 * GlobeSkill Phase 7: IndexedDB Offline Storage Manager
 * Stores courses, lesson chapters, code submissions, and sync queues for rural areas with no network.
 */

const DB_NAME = 'GlobeSkillOfflineDB';
const DB_VERSION = 1;

export interface OfflineProgressItem {
  id?: number;
  studentId: string;
  courseId: string;
  chapterId: string;
  progressPercentage: number;
  completedAt: string;
  synced: boolean;
}

export interface OfflineCourseCache {
  id: string;
  title: string;
  data: any;
  cachedAt: string;
}

class OfflineDatabase {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return Promise.reject(new Error('IndexedDB not supported in current environment'));
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = (event.target as IDBOpenDBRequest).result;

          // 1. Courses Cache Store
          if (!db.objectStoreNames.contains('courses')) {
            db.createObjectStore('courses', { keyPath: 'id' });
          }

          // 2. Offline Progress Queue Store
          if (!db.objectStoreNames.contains('progress_queue')) {
            const progressStore = db.createObjectStore('progress_queue', { keyPath: 'id', autoIncrement: true });
            progressStore.createIndex('synced', 'synced', { unique: false });
            progressStore.createIndex('studentId', 'studentId', { unique: false });
          }

          // 3. Offline Code Scratchpad Store
          if (!db.objectStoreNames.contains('code_drafts')) {
            db.createObjectStore('code_drafts', { keyPath: 'id' });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }

    return this.dbPromise;
  }

  // Save courses for offline study
  async cacheCourse(course: any): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction('courses', 'readwrite');
      const store = tx.objectStore('courses');
      store.put({
        id: course.id,
        title: course.title,
        data: course,
        cachedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Failed to cache course in IndexedDB:', err);
    }
  }

  // Get cached course by ID
  async getCachedCourse(id: string): Promise<any | null> {
    try {
      const db = await this.getDB();
      const tx = db.transaction('courses', 'readonly');
      const store = tx.objectStore('courses');
      return new Promise((resolve) => {
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result ? req.result.data : null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  // Get all cached courses
  async getAllCachedCourses(): Promise<any[]> {
    try {
      const db = await this.getDB();
      const tx = db.transaction('courses', 'readonly');
      const store = tx.objectStore('courses');
      return new Promise((resolve) => {
        const req = store.getAll();
        req.onsuccess = () => resolve((req.result || []).map((r) => r.data));
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  // Queue a lesson progress update while offline
  async queueProgress(item: Omit<OfflineProgressItem, 'id' | 'synced'>): Promise<number> {
    try {
      const db = await this.getDB();
      const tx = db.transaction('progress_queue', 'readwrite');
      const store = tx.objectStore('progress_queue');
      const record: OfflineProgressItem = {
        ...item,
        synced: false,
      };
      return new Promise((resolve, reject) => {
        const req = store.add(record);
        req.onsuccess = () => resolve(req.result as number);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return -1;
    }
  }

  // Get all pending unsynced progress items
  async getUnsyncedProgress(): Promise<OfflineProgressItem[]> {
    try {
      const db = await this.getDB();
      const tx = db.transaction('progress_queue', 'readonly');
      const store = tx.objectStore('progress_queue');
      return new Promise((resolve) => {
        const req = store.getAll();
        req.onsuccess = () => {
          const items: OfflineProgressItem[] = req.result || [];
          resolve(items.filter((i) => !i.synced));
        };
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  // Mark items as synced
  async markAsSynced(ids: number[]): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction('progress_queue', 'readwrite');
      const store = tx.objectStore('progress_queue');
      for (const id of ids) {
        store.delete(id);
      }
    } catch (err) {
      console.warn('Failed to clear synced items:', err);
    }
  }
}

export const offlineDB = new OfflineDatabase();
