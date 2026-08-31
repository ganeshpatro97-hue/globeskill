"use client";

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/offline-sync';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}
