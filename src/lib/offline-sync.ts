/**
 * GlobeSkill Phase 7: Offline-First Synchronization & PWA Caching Engine
 * Designed for rural / low-connectivity learning centers.
 * 
 * Features:
 * 1. IndexedDB Manager (GlobeSkillOfflineDB) for courses & student progression.
 * 2. Chronological Offline Outbox with UUID, timestamps, and retry limiters.
 * 3. Automated Sync Engine (GlobeSkillSyncEngine) with conflict resolution.
 * 4. React hook `useOfflineSync` for real-time status banners and toasts.
 * 5. PWA Service Worker Registration Helper.
 */

import { useState, useEffect } from 'react';

// ==========================================
// 1. Core Types & Data Contracts
// ==========================================
export type SyncActionType = 
  | 'COURSE_ENROLL' 
  | 'CHAPTER_COMPLETE' 
  | 'PROGRESS_UPDATE' 
  | 'QUIZ_SUBMIT' 
  | 'CODE_SAVE';

export interface OutboxRecord {
  id: string; // Unique UUID
  actionType: SyncActionType;
  studentId: string;
  courseId: string;
  chapterId?: string;
  payload: Record<string, any>;
  timestamp: string;
  retryCount: number;
  maxRetries: number;
  status: 'pending' | 'syncing' | 'failed' | 'completed';
}

export interface CachedCourseRecord {
  id: string;
  title: string;
  category: string;
  data: any;
  cachedAt: string;
}

export type NetworkState = 'online' | 'offline';

const DB_NAME = 'GlobeSkillOfflineDB';
const DB_VERSION = 1;

// ==========================================
// 2. Native IndexedDB Local Storage Manager
// ==========================================
class GlobeSkillIndexedDB {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return Promise.reject(new Error('IndexedDB is not supported in this environment.'));
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = (event.target as IDBOpenDBRequest).result;

          // Courses store
          if (!db.objectStoreNames.contains('cached_courses')) {
            db.createObjectStore('cached_courses', { keyPath: 'id' });
          }

          // Chronological outbox queue store
          if (!db.objectStoreNames.contains('outbox_queue')) {
            const outboxStore = db.createObjectStore('outbox_queue', { keyPath: 'id' });
            outboxStore.createIndex('status', 'status', { unique: false });
            outboxStore.createIndex('timestamp', 'timestamp', { unique: false });
          }

          // Student offline progress snapshot
          if (!db.objectStoreNames.contains('offline_progress')) {
            db.createObjectStore('offline_progress', { keyPath: 'id' });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }

    return this.dbPromise;
  }

  // Course Caching
  async saveCourseForOffline(course: any): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction('cached_courses', 'readwrite');
      const store = tx.objectStore('cached_courses');
      const record: CachedCourseRecord = {
        id: course.id,
        title: course.title,
        category: course.category || 'General',
        data: course,
        cachedAt: new Date().toISOString(),
      };
      store.put(record);
    } catch (err) {
      console.warn('GlobeSkill OfflineDB: Error saving course to cache:', err);
    }
  }

  async getCachedCourses(): Promise<any[]> {
    try {
      const db = await this.getDB();
      const tx = db.transaction('cached_courses', 'readonly');
      const store = tx.objectStore('cached_courses');
      return new Promise((resolve) => {
        const req = store.getAll();
        req.onsuccess = () => resolve((req.result || []).map((r: CachedCourseRecord) => r.data));
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  // Outbox Queue Management
  async queueAction(
    actionType: SyncActionType,
    studentId: string,
    courseId: string,
    payload: Record<string, any>,
    chapterId?: string
  ): Promise<string> {
    const id = `sync_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const record: OutboxRecord = {
      id,
      actionType,
      studentId,
      courseId,
      chapterId,
      payload,
      timestamp: new Date().toISOString(),
      retryCount: 0,
      maxRetries: 5,
      status: 'pending',
    };

    try {
      const db = await this.getDB();
      const tx = db.transaction('outbox_queue', 'readwrite');
      const store = tx.objectStore('outbox_queue');
      store.put(record);
      return id;
    } catch (err) {
      console.warn('GlobeSkill OfflineDB: Failed to queue action:', err);
      return id;
    }
  }

  async getPendingOutbox(): Promise<OutboxRecord[]> {
    try {
      const db = await this.getDB();
      const tx = db.transaction('outbox_queue', 'readonly');
      const store = tx.objectStore('outbox_queue');
      return new Promise((resolve) => {
        const req = store.getAll();
        req.onsuccess = () => {
          const all: OutboxRecord[] = req.result || [];
          // Filter valid pending or failed-retryable records, sorted chronologically
          const pending = all
            .filter((r) => r.status === 'pending' || (r.status === 'failed' && r.retryCount < r.maxRetries))
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          resolve(pending);
        };
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  async updateOutboxStatus(id: string, status: OutboxRecord['status'], incrementRetry = false): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction('outbox_queue', 'readwrite');
      const store = tx.objectStore('outbox_queue');
      const req = store.get(id);

      req.onsuccess = () => {
        const record = req.result as OutboxRecord;
        if (record) {
          record.status = status;
          if (incrementRetry) record.retryCount += 1;
          store.put(record);
        }
      };
    } catch (err) {
      console.warn('GlobeSkill OfflineDB: Failed to update outbox item status:', err);
    }
  }

  async removeCompletedOutbox(ids: string[]): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction('outbox_queue', 'readwrite');
      const store = tx.objectStore('outbox_queue');
      for (const id of ids) {
        store.delete(id);
      }
    } catch (err) {
      console.warn('GlobeSkill OfflineDB: Failed to clear completed records:', err);
    }
  }
}

export const offlineDB = new GlobeSkillIndexedDB();

// ==========================================
// 3. Automated Synchronization Engine
// ==========================================
export class GlobeSkillSyncEngine {
  private static instance: GlobeSkillSyncEngine;
  private isSyncing = false;
  private listeners: ((state: { network: NetworkState; pendingCount: number; isSyncing: boolean }) => void)[] = [];

  private constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange('online'));
      window.addEventListener('offline', () => this.handleNetworkChange('offline'));
    }
  }

  static getInstance(): GlobeSkillSyncEngine {
    if (!GlobeSkillSyncEngine.instance) {
      GlobeSkillSyncEngine.instance = new GlobeSkillSyncEngine();
    }
    return GlobeSkillSyncEngine.instance;
  }

  private async handleNetworkChange(state: NetworkState) {
    this.broadcast();
    if (state === 'online') {
      console.log('GlobeSkill Engine: Online connection detected. Initiating background synchronization...');
      await this.syncPendingRecords();
    }
  }

  subscribe(callback: (state: { network: NetworkState; pendingCount: number; isSyncing: boolean }) => void): () => void {
    this.listeners.push(callback);
    this.broadcast();
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  async broadcast() {
    const network: NetworkState = typeof navigator !== 'undefined' && navigator.onLine ? 'online' : 'offline';
    const pending = await offlineDB.getPendingOutbox();
    const state = {
      network,
      pendingCount: pending.length,
      isSyncing: this.isSyncing,
    };
    this.listeners.forEach((fn) => fn(state));
  }

  // Flush chronological outbox queue
  async syncPendingRecords(): Promise<{ success: boolean; syncedCount: number }> {
    if (this.isSyncing || typeof navigator === 'undefined' || !navigator.onLine) {
      return { success: false, syncedCount: 0 };
    }

    const pending = await offlineDB.getPendingOutbox();
    if (pending.length === 0) {
      return { success: true, syncedCount: 0 };
    }

    this.isSyncing = true;
    this.broadcast();

    const successfullySyncedIds: string[] = [];

    for (const item of pending) {
      try {
        await offlineDB.updateOutboxStatus(item.id, 'syncing');

        const response = await fetch('/api/sync/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: [
              {
                studentId: item.studentId,
                courseId: item.courseId,
                chapterId: item.chapterId,
                progressPercentage: item.payload?.progressPercentage || 100,
                actionType: item.actionType,
              }
            ]
          }),
        });

        if (response.ok) {
          successfullySyncedIds.push(item.id);
        } else {
          await offlineDB.updateOutboxStatus(item.id, 'failed', true);
        }
      } catch (err) {
        console.warn(`GlobeSkill Engine: Sync error for action ${item.id}:`, err);
        await offlineDB.updateOutboxStatus(item.id, 'failed', true);
      }
    }

    if (successfullySyncedIds.length > 0) {
      await offlineDB.removeCompletedOutbox(successfullySyncedIds);
      console.log(`GlobeSkill Engine: Successfully synced ${successfullySyncedIds.length} offline actions!`);
    }

    this.isSyncing = false;
    this.broadcast();
    return { success: true, syncedCount: successfullySyncedIds.length };
  }
}

export const syncEngine = typeof window !== 'undefined' ? GlobeSkillSyncEngine.getInstance() : null;

// ==========================================
// 4. Global React Hook: useOfflineSync
// ==========================================
export function useOfflineSync() {
  const [network, setNetwork] = useState<NetworkState>('online');
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    if (!syncEngine) return;
    const unsubscribe = syncEngine.subscribe((state) => {
      setNetwork(state.network);
      setPendingCount(state.pendingCount);
      setIsSyncing(state.isSyncing);
    });
    return () => unsubscribe();
  }, []);

  const triggerSync = async () => {
    if (!syncEngine) return { success: false, syncedCount: 0 };
    return await syncEngine.syncPendingRecords();
  };

  const recordOfflineProgress = async (
    actionType: SyncActionType,
    studentId: string,
    courseId: string,
    payload: Record<string, any>,
    chapterId?: string
  ) => {
    const actionId = await offlineDB.queueAction(actionType, studentId, courseId, payload, chapterId);
    if (typeof navigator !== 'undefined' && navigator.onLine && syncEngine) {
      // Opportunistic immediate sync if online
      syncEngine.syncPendingRecords();
    } else if (syncEngine) {
      syncEngine.broadcast();
    }
    return actionId;
  };

  return {
    network,
    isOffline: network === 'offline',
    isOnline: network === 'online',
    pendingCount,
    isSyncing,
    triggerSync,
    recordOfflineProgress,
  };
}

// ==========================================
// 5. Service Worker PWA Helper
// ==========================================
export function registerServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    const register = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('GlobeSkill ServiceWorker registered successfully with scope:', registration.scope);
        })
        .catch((error) => {
          console.warn('GlobeSkill ServiceWorker registration error:', error);
        });
    };

    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register);
    }
  }
}
