/**
 * GlobeSkill Phase 7: Background Sync Engine
 * Monitors network state, registers service workers, and flushes queued offline progress to Supabase when reconnected.
 */

import { offlineDB, OfflineProgressItem } from './indexed-db';

export type NetworkStatus = 'online' | 'offline';

export class BackgroundSyncEngine {
  private static instance: BackgroundSyncEngine;
  private isSyncing = false;
  private listeners: ((status: NetworkStatus, pendingCount: number) => void)[] = [];

  private constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.notifyListeners());
      this.initSW();
    }
  }

  static getInstance(): BackgroundSyncEngine {
    if (!BackgroundSyncEngine.instance) {
      BackgroundSyncEngine.instance = new BackgroundSyncEngine();
    }
    return BackgroundSyncEngine.instance;
  }

  // Register PWA Service Worker
  private initSW(): void {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('GlobeSkill Service Worker registered:', reg.scope);
          })
          .catch((err) => {
            console.warn('Service Worker registration skipped:', err);
          });
      });
    }
  }

  // Subscribe to network & sync status changes
  subscribe(callback: (status: NetworkStatus, pendingCount: number) => void): () => void {
    this.listeners.push(callback);
    this.notifyListeners();
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private async notifyListeners(): Promise<void> {
    const status: NetworkStatus = typeof navigator !== 'undefined' && navigator.onLine ? 'online' : 'offline';
    const pending = await offlineDB.getUnsyncedProgress();
    this.listeners.forEach((l) => l(status, pending.length));
  }

  private async handleOnline(): Promise<void> {
    console.log('GlobeSkill: Network connection restored. Initiating automatic background sync...');
    await this.flushSyncQueue();
  }

  // Flush pending offline progress items to the backend server
  async flushSyncQueue(): Promise<{ synced: number; failed: number }> {
    if (this.isSyncing || typeof navigator === 'undefined' || !navigator.onLine) {
      return { synced: 0, failed: 0 };
    }

    this.isSyncing = true;
    const pendingItems = await offlineDB.getUnsyncedProgress();

    if (pendingItems.length === 0) {
      this.isSyncing = false;
      this.notifyListeners();
      return { synced: 0, failed: 0 };
    }

    try {
      const res = await fetch('/api/sync/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: pendingItems }),
      });

      if (res.ok) {
        const syncedIds = pendingItems.map((i) => i.id!).filter(Boolean);
        await offlineDB.markAsSynced(syncedIds);
        console.log(`GlobeSkill Sync: Successfully synced ${syncedIds.length} offline progress updates!`);
        this.notifyListeners();
        this.isSyncing = false;
        return { synced: syncedIds.length, failed: 0 };
      }
    } catch (err) {
      console.warn('Background sync flush encountered error, will retry on next connection:', err);
    }

    this.isSyncing = false;
    this.notifyListeners();
    return { synced: 0, failed: pendingItems.length };
  }
}

export const syncEngine = typeof window !== 'undefined' ? BackgroundSyncEngine.getInstance() : null;
