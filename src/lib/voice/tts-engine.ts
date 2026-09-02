/**
 * GlobeSkill Voice Narration & Text-to-Speech (TTS) Engine (English Standard)
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

  speak(text: string, _lang: LanguageCode = 'en', onEnd?: () => void, onError?: () => void): boolean {
    if (!this.synth || !this.isSupported) {
      console.warn('Voice TTS is not supported on this browser.');
      return false;
    }

    this.stop();

    const cleanText = text.replace(/[*#`_]/g, '').trim();
    if (!cleanText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    this.currentUtterance = utterance;
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    const voices = this.synth.getVoices();
    const matchedVoice = voices.find((v) => v.lang.startsWith('en')) || voices[0];

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

  isSpeaking(): boolean {
    return !!this.synth && this.synth.speaking;
  }
}

export const voiceTTS = VoiceTTSEngine.getInstance();
export const ttsEngine = VoiceTTSEngine.getInstance();
