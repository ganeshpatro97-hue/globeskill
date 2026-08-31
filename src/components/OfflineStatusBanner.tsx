"use client";

import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useOfflineSync } from '@/lib/offline-sync';

export default function OfflineStatusBanner() {
  const { network, pendingCount, isSyncing, triggerSync } = useOfflineSync();
  const [justSynced, setJustSynced] = useState<boolean>(false);

  const handleManualSync = async () => {
    if (network === 'offline') return;
    const result = await triggerSync();
    if (result.syncedCount > 0) {
      setJustSynced(true);
      setTimeout(() => setJustSynced(false), 4000);
    }
  };

  // Only display if offline or if there are pending unsynced offline items or just synced
  if (network === 'online' && pendingCount === 0 && !justSynced) {
    return null;
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-30 pointer-events-none flex justify-center px-4 animate-in slide-in-from-top-3 duration-300">
      <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 rounded-2xl shadow-xl px-4 py-2 flex items-center gap-3 text-xs">
        
        {network === 'offline' ? (
          <>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></div>
            <div className="flex items-center gap-1.5 font-medium text-amber-300">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline Mode Active (बिना इंटरनेट अध्ययन)</span>
            </div>
            <span className="text-slate-400 text-[11px]">
              Lessons cached in IndexedDB. {pendingCount > 0 && `${pendingCount} updates queued for auto-sync.`}
            </span>
          </>
        ) : justSynced ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-emerald-300">
              Offline progress successfully synchronized with GlobeSkill cloud!
            </span>
          </>
        ) : (
          <>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            <span className="text-slate-300 font-medium">
              Back online! {pendingCount} offline updates ready to sync.
            </span>
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </>
        )}

      </div>
    </div>
  );
}
