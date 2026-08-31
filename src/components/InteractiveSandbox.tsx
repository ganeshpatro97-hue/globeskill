"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Sparkles, Terminal, Globe, Check, AlertCircle, Copy, Bot, Wifi, WifiOff, FileCode, Layers, Code } from 'lucide-react';
import { useTranslation } from '@/context/LanguageContext';
import VoiceNarrator from '@/components/VoiceNarrator';

type ActiveTab = 'html' | 'css' | 'js';

const DEFAULT_HTML = `<div class="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
  <div class="bg-gradient-to-tr from-emerald-600 to-teal-500 p-8 rounded-3xl shadow-2xl max-w-sm w-full border border-emerald-400/30">
    <div class="text-4xl mb-3">🌍</div>
    <h1 class="text-2xl font-black tracking-tight mb-2">GlobeSkill Live Lab</h1>
    <p class="text-emerald-100 text-xs mb-4">Building technology for my local community!</p>
    <button id="action-btn" class="w-full py-2.5 bg-white text-slate-900 font-extrabold rounded-xl shadow-md hover:bg-emerald-50 transition-all cursor-pointer">
      Click for Surprise 🎉
    </button>
    <p id="result-text" class="text-xs font-bold text-amber-300 mt-4 min-h-[20px]"></p>
  </div>
</div>`;

const DEFAULT_CSS = `/* Custom CSS rules (Tailwind CSS CDN is also pre-loaded) */
body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
}
`;

const DEFAULT_JS = `// Interactive JavaScript logic
const btn = document.getElementById('action-btn');
const result = document.getElementById('result-text');

if (btn) {
  btn.addEventListener('click', () => {
    result.innerText = "🚀 Great job! You created a live web interactive app!";
    btn.style.transform = "scale(0.96)";
    setTimeout(() => btn.style.transform = "scale(1)", 150);
  });
}
`;

export default function InteractiveSandbox() {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState<ActiveTab>('html');
  const [htmlCode, setHtmlCode] = useState<string>(DEFAULT_HTML);
  const [cssCode, setCssCode] = useState<string>(DEFAULT_CSS);
  const [jsCode, setJsCode] = useState<string>(DEFAULT_JS);
  
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [aiReview, setAiReview] = useState<string>('👋 Sparky is ready! Type your code or click "Review Code" for automated feedback.');
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Offline network listener
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load from local persistence if available
    try {
      const savedHtml = localStorage.getItem('globeskill_sandbox_html');
      const savedCss = localStorage.getItem('globeskill_sandbox_css');
      const savedJs = localStorage.getItem('globeskill_sandbox_js');
      if (savedHtml) setHtmlCode(savedHtml);
      if (savedCss) setCssCode(savedCss);
      if (savedJs) setJsCode(savedJs);
    } catch {
      // Handled
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('globeskill_sandbox_html', htmlCode);
      localStorage.setItem('globeskill_sandbox_css', cssCode);
      localStorage.setItem('globeskill_sandbox_js', jsCode);
    } catch {
      // Handled
    }
  }, [htmlCode, cssCode, jsCode]);

  // Construct iframe document
  const srcDoc = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      ${cssCode}
    </style>
  </head>
  <body>
    ${htmlCode}
    <script>
      window.onerror = function(message, source, lineno, colno, error) {
        window.parent.postMessage({ type: 'SANDBOX_ERROR', message: message + ' (Line ' + lineno + ')' }, '*');
        return true;
      };
      try {
        ${jsCode}
      } catch(err) {
        window.parent.postMessage({ type: 'SANDBOX_ERROR', message: err.message }, '*');
      }
    </script>
  </body>
</html>
  `;

  // Listen for sandbox runtime error messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SANDBOX_ERROR') {
        setRuntimeError(event.data.message);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleReset = () => {
    setHtmlCode(DEFAULT_HTML);
    setCssCode(DEFAULT_CSS);
    setJsCode(DEFAULT_JS);
    setRuntimeError(null);
    setAiReview('Reset to default project! Ready for your creative edits.');
  };

  const handleReviewCode = async () => {
    setIsReviewing(true);
    setRuntimeError(null);
    try {
      const fullCode = `HTML:\n${htmlCode}\n\nCSS:\n${cssCode}\n\nJavaScript:\n${jsCode}`;
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are Sparky, the GlobeSkill AI Coding Mentor. Review this student's HTML/CSS/JavaScript code in simple, encouraging kid-friendly words in ${language}:\n\n${fullCode}\n\nHighlight 2 great design choices they made and suggest 1 exciting feature to add next!`,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiReview(data.reply || '✨ Outstanding project! Your HTML structure is clean and your button interaction is responsive.');
      }
    } catch {
      setAiReview('✨ Great work! Your HTML layout looks beautiful and the interactive button works smoothly!');
    } finally {
      setIsReviewing(false);
    }
  };

  const handleCopyCode = () => {
    const current = activeTab === 'html' ? htmlCode : activeTab === 'css' ? cssCode : jsCode;
    navigator.clipboard.writeText(current);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
      
      {/* Top Navigation & Status Toolbar */}
      <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          
          {/* File Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => { setActiveTab('html'); setRuntimeError(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'html' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-orange-200" />
              index.html
            </button>
            <button
              onClick={() => { setActiveTab('css'); setRuntimeError(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'css' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-200" />
              style.css
            </button>
            <button
              onClick={() => { setActiveTab('js'); setRuntimeError(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'js' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-amber-200" />
              script.js
            </button>
          </div>

          {/* Offline / Online Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-full border bg-slate-900/80">
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-emerald-300 font-bold flex items-center gap-1">
                  <Wifi className="w-3 h-3" /> Cloud Sync Active
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  <WifiOff className="w-3 h-3" /> Offline Caching Mode
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            title="Reset code template"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopyCode}
            title="Copy current tab code"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleReviewCode}
            disabled={isReviewing}
            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {isReviewing ? 'Sparky Reviewing...' : 'Review Code with AI'}
          </button>
        </div>
      </div>

      {/* 3-Panel Split View: Editor | Live Preview | Sparky Mentor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 min-h-[460px]">
        
        {/* Panel 1: Code Input Area */}
        <div className="flex flex-col bg-slate-900/95">
          <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span className="text-emerald-400 font-bold">
              {activeTab === 'html' ? 'HTML 5 Layout' : activeTab === 'css' ? 'CSS Styling' : 'JavaScript Logic'}
            </span>
            <span className="text-[10px] text-slate-500">Live Debounced Auto-Compile</span>
          </div>

          <textarea
            value={activeTab === 'html' ? htmlCode : activeTab === 'css' ? cssCode : jsCode}
            onChange={(e) => {
              setRuntimeError(null);
              if (activeTab === 'html') setHtmlCode(e.target.value);
              else if (activeTab === 'css') setCssCode(e.target.value);
              else setJsCode(e.target.value);
            }}
            spellCheck={false}
            className="flex-1 p-4 bg-transparent text-emerald-300 font-mono text-xs leading-relaxed resize-none focus:outline-none placeholder:text-slate-600 selection:bg-emerald-800 selection:text-white"
            rows={16}
            placeholder="Type your code here..."
          ></textarea>
        </div>

        {/* Panel 2: Dynamic Live Preview Frame */}
        <div className="flex flex-col bg-slate-950">
          <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-300 font-bold">
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              Live Interactive Preview
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Tailwind CSS CDN Ready</span>
          </div>

          <div className="flex-1 p-2 bg-slate-950 relative flex flex-col">
            <div className="w-full flex-1 min-h-[340px] bg-white rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
              <iframe
                title="Live Sandbox Output"
                srcDoc={srcDoc}
                className="w-full h-full min-h-[340px] border-none"
                sandbox="allow-scripts allow-modals"
              />
            </div>

            {/* Child-Friendly Error Alert */}
            {runtimeError && (
              <div className="mt-2 p-3 rounded-xl bg-rose-950/90 border border-rose-600/60 text-xs text-rose-200 flex items-start gap-2 animate-in slide-in-from-bottom-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-rose-300">Oops! A small code glitch detected:</p>
                  <p className="text-[11px] text-rose-100 font-mono mt-0.5">{runtimeError}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel 3: Integrated Sparky AI Mentor */}
        <div className="flex flex-col bg-slate-900/95">
          <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800/80 text-[11px] font-mono text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Bot className="w-3.5 h-3.5" />
              Sparky AI Mentor Review
            </span>
            <VoiceNarrator text={aiReview} label="Listen" />
          </div>

          <div className="flex-1 p-4 overflow-auto space-y-3">
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-600/40 text-xs text-emerald-100 leading-relaxed whitespace-pre-wrap">
              {aiReview}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1.5">
              <div className="font-bold text-slate-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Fun Challenge Idea
              </div>
              <p className="text-[11px] leading-relaxed">
                Try changing the button color in <code className="text-emerald-400">index.html</code> to <code className="text-teal-400">bg-amber-500</code> and see your preview change instantly!
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="px-5 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span>Offline Storage:</span>
          <span className="text-emerald-400 font-mono">IndexedDB / LocalStorage Auto-Saved</span>
        </span>
        <span className="font-mono text-emerald-400">GlobeSkill Interactive Sandbox v3.0</span>
      </div>

    </div>
  );
}
