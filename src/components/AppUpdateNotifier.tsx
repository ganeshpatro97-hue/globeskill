"use client";

import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, X } from 'lucide-react';

/**
 * GlobeSkill Auto-Update Notifier
 * Automatically detects new website & PWA versions, checks for service worker updates,
 * and enables 1-tap instant cache refresh so users always have the latest features.
 */
export default function AppUpdateNotifier() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    let registration: ServiceWorkerRegistration | null = null;

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;
      registration = reg;

      // Check if a worker is already waiting to activate
      if (reg.waiting) {
        setUpdateAvailable(true);
      }

      // Listen for new service worker being installed
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setUpdateAvailable(true);
          }
        });
      });
    });

    // Check for updates periodically (every 5 minutes)
    const interval = setInterval(() => {
      if (registration && navigator.onLine) {
        registration.update().catch(() => {});
      }
    }, 5 * 60 * 1000);

    // Also check when tab regains focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && registration && navigator.onLine) {
        registration.update().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleApplyUpdate = () => {
    setIsUpdating(true);
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg?.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        setTimeout(() => {
          window.location.reload();
        }, 300);
      });
    } else {
      window.location.reload();
    }
  };

  if (!updateAvailable || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white border border-emerald-500/50 shadow-2xl rounded-2xl p-4 max-w-sm flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        
        <div className="flex-1">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            New Version Available
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </h4>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">
            An updated version of GlobeSkill is ready with new features!
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleApplyUpdate}
            disabled={isUpdating}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
          
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
