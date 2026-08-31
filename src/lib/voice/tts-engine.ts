/**
 * GlobeSkill Multilingual Voice Narration & Text-to-Speech (TTS) Engine
 * Supports regional Indian accents: Hindi (hi-IN), Tamil (ta-IN), Kannada (kn-IN), Marathi (mr-IN), and English (en-IN).
 */

import { LanguageCode } from '@/context/LanguageContext';

export class VoiceTTSEngine {
  private static instance: VoiceTTSEngine;
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSupported = false;

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
    }
  }

  static getInstance(): VoiceTTSEngine {
    if (!VoiceTTSEngine.instance) {
      VoiceTTSEngine.instance = new VoiceTTSEngine();
    }
    return VoiceTTSEngine.instance;
  }

  speak(text: string, lang: LanguageCode = 'en', onEnd?: () => void, onError?: () => void): boolean {
    if (!this.synth || !this.isSupported) {
      console.warn('Voice TTS is not supported on this browser.');
      return false;
    }

    this.stop();

    const cleanText = text.replace(/[*#`_]/g, '').trim();
    if (!cleanText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    this.currentUtterance = utterance;

    // Select target BCP-47 language tag
    const langMap: Record<LanguageCode, string> = {
      hi: 'hi-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
      mr: 'mr-IN',
      en: 'en-IN',
    };

    const targetLangTag = langMap[lang] || 'en-IN';
    utterance.lang = targetLangTag;
    utterance.rate = 0.95; // Slightly slower for clear educational comprehension
    utterance.pitch = 1.05;

    // Pick best matching native voice if installed
    const voices = this.synth.getVoices();
    const matchedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(targetLangTag.toLowerCase())) ||
      voices.find((v) => v.lang.includes(lang));

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      if (onError) onError();
    };

    this.synth.speak(utterance);
    return true;
  }

  stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  isPlaying(): boolean {
    return !!(this.synth && this.synth.speaking);
  }
}

export const ttsEngine = typeof window !== 'undefined' ? VoiceTTSEngine.getInstance() : null;
