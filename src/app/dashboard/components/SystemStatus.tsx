'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Database, WifiOff, RefreshCw } from 'lucide-react';

interface SystemStatusData {
  status: 'online' | 'degraded' | 'offline' | 'loading';
  database?: 'connected' | 'disconnected';
  timestamp?: string;
  uptime?: number;
  latency?: number | null;
}

export default function SystemStatusIndicator({
  compact = false,
  className = '',
}: {
  compact?: boolean;
  className?: string;
}) {
  const [status, setStatus] = useState<'loading' | 'online' | 'degraded' | 'offline'>('loading');
  const [latency, setLatency] = useState<number | null>(null);
  const [uptime, setUptime] = useState<number | null>(null);
  const [database, setDatabase] = useState<'connected' | 'disconnected'>('connected');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkStatus = useCallback(async () => {
    const startTime = performance.now();
    try {
      const res = await fetch('/api/health', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const roundTripLatency = Math.round(performance.now() - startTime);
        
        if (data.status === 'online' || data.status === 'ok') {
          setStatus('online');
          setLatency(data.latency || roundTripLatency);
          setDatabase(data.database || 'connected');
          if (data.uptime) setUptime(data.uptime);
        } else if (data.status === 'degraded') {
          setStatus('degraded');
          setLatency(roundTripLatency);
          setDatabase(data.database || 'disconnected');
        } else {
          setStatus('offline');
          setDatabase('disconnected');
        }
      } else {
        setStatus('offline');
        setDatabase('disconnected');
      }
    } catch (error) {
      setStatus('offline');
      setDatabase('disconnected');
    }
  }, []);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [checkStatus]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await checkStatus();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const formatUptime = (seconds: number | null) => {
    if (!seconds) return null;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m ${Math.floor(seconds % 60)}s`;
  };

  if (compact) {
    return (
      <div 
        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm transition-all ${
          status === 'online'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
            : status === 'degraded'
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
            : status === 'offline'
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
            : 'bg-slate-100 border-slate-200 text-slate-500'
        } ${className}`}
        title={`GlobeSkill System: ${status.toUpperCase()} ${latency ? `(${latency}ms)` : ''}`}
      >
        <span className="relative flex h-2 w-2">
          {status === 'online' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          {status === 'degraded' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${
            status === 'online'
              ? 'bg-emerald-500'
              : status === 'degraded'
              ? 'bg-amber-500'
              : status === 'offline'
              ? 'bg-rose-500'
              : 'bg-slate-400'
          }`}></span>
        </span>
        <span className="text-[11px] font-semibold">
          {status === 'online' ? 'System: Online' : status === 'degraded' ? 'Degraded' : status === 'offline' ? 'Offline Mode' : 'Checking...'}
        </span>
        {status === 'online' && latency !== null && (
          <span className="text-[10px] opacity-75 font-mono">
            {latency}ms
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-xl border transition-all ${
      status === 'online'
        ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
        : status === 'degraded'
        ? 'bg-amber-950/20 border-amber-800/40 text-amber-300'
        : status === 'offline'
        ? 'bg-rose-950/20 border-rose-800/40 text-rose-300'
        : 'bg-slate-900/40 border-slate-800 text-slate-400'
    } ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            {status === 'online' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            {status === 'degraded' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              status === 'online'
                ? 'bg-emerald-400'
                : status === 'degraded'
                ? 'bg-amber-400'
                : status === 'offline'
                ? 'bg-rose-400'
                : 'bg-slate-400'
            }`}></span>
          </span>

          <div className="text-xs">
            <span className="font-bold text-white tracking-wide">
              {status === 'online' 
                ? 'Platform: Online' 
                : status === 'degraded'
                ? 'Platform: Degraded Service'
                : status === 'offline' 
                ? 'Platform: Offline Mode' 
                : 'Checking system status...'}
            </span>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
              {status === 'online' && (
                <>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Database className="w-3 h-3" /> Database connected
                  </span>
                  {latency !== null && (
                    <span className="font-mono text-slate-400">
                      • {latency}ms latency
                    </span>
                  )}
                  {uptime !== null && (
                    <span className="text-slate-500 hidden sm:inline">
                      • uptime {formatUptime(uptime)}
                    </span>
                  )}
                </>
              )}
              {status === 'degraded' && (
                <span className="text-amber-400 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Downstream services experiencing delay
                </span>
              )}
              {status === 'offline' && (
                <span className="text-rose-400 flex items-center gap-1">
                  <WifiOff className="w-3 h-3" /> Offline PWA fallback active (IndexedDB queue)
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          title="Refresh health check"
          aria-label="Refresh status"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>
    </div>
  );
}
