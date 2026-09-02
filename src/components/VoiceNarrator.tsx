"use client";

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { ttsEngine } from '@/lib/voice/tts-engine';
import { LanguageCode } from '@/context/LanguageContext';

interface VoiceNarratorProps {
  text: string;
  lang?: LanguageCode;
  label?: string;
  className?: string;
}

export default function VoiceNarrator({ text, lang = 'en', label, className = '' }: VoiceNarratorProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (ttsEngine) ttsEngine.stop();
    };
  }, []);

  const handleToggle = () => {
    if (!ttsEngine) return;

    if (isPlaying) {
      ttsEngine.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const success = ttsEngine.speak(
        text,
        lang,
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
      if (!success) setIsPlaying(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
        isPlaying
          ? 'bg-emerald-600 text-white shadow-xs animate-pulse'
          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80'
      } ${className}`}
      title="Listen Aloud"
      aria-label="Toggle voice narration"
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-3.5 h-3.5 animate-bounce" />
          <span>{label || 'Stop'}</span>
          <span className="flex gap-0.5 ml-1">
            <span className="w-1 h-3 bg-white animate-pulse [animation-delay:0.1s]"></span>
            <span className="w-1 h-3 bg-white animate-pulse [animation-delay:0.3s]"></span>
            <span className="w-1 h-3 bg-white animate-pulse [animation-delay:0.2s]"></span>
          </span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{label || 'Listen'}</span>
        </>
      )}
    </button>
  );
}
