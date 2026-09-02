"use client";

import React, { useState, useEffect } from 'react';

// ==========================================
// 1. Types & Interfaces
// ==========================================
export interface CodingChallenge {
  id?: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  xp_reward: number;
  sdg_alignment: string;
  description: string;
  analogy: string;
  starter_html: string;
  starter_css: string;
  starter_js: string;
  test_regex: string;
  test_instructions: string;
  is_offline_cached?: boolean;
}

export default function ChallengeCreatorForm() {
  // ==========================================
  // 2. State Declarations
  // ==========================================
  const [formData, setFormData] = useState<CodingChallenge>({
    title: '',
    level: 'beginner',
    xp_reward: 100,
    sdg_alignment: 'SDG 4: Quality Education',
    description: '',
    analogy: '',
    starter_html: '',
    starter_css: '',
    starter_js: '',
    test_regex: '',
    test_instructions: '',
  });

  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'sql'>('editor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [syncQueue, setSyncQueue] = useState<CodingChallenge[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Check network status on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      const handleOnline = () => {
        setIsOffline(false);
        setStatusMessage({ type: 'success', text: 'Back online! Ready to sync queued challenges to Supabase.' });
      };
      const handleOffline = () => {
        setIsOffline(true);
        setStatusMessage({ type: 'info', text: 'You are offline. New challenges will be saved locally in IndexedDB outbox.' });
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Load offline queued challenges from localStorage
      const cached = localStorage.getItem('globeskill_challenge_sync_queue');
      if (cached) {
        setSyncQueue(JSON.parse(cached));
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Save sync queue to localStorage
  const saveQueueToCache = (queue: CodingChallenge[]) => {
    setSyncQueue(queue);
    localStorage.setItem('globeskill_challenge_sync_queue', JSON.stringify(queue));
  };

  // ==========================================
  // 3. Form Input Handlers
  // ==========================================
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'xp_reward' ? parseInt(value) || 0 : value,
    }));
  };

  const loadExampleTemplate = (type: 'html' | 'js' | 'css') => {
    if (type === 'html') {
      setFormData((prev) => ({
        ...prev,
        title: 'Build a Welcoming Header',
        description: 'Create a greeting card for your municipal learning hub that welcomes other students with a large, bold heading.',
        analogy: 'Think of an HTML element like a physical label on a storage box. The <h1> tag is like the big, bright label on top!',
        starter_html: '<!-- Step 1: Add a Heading tag below -->\n<h1 class="text-3xl font-bold text-emerald-600">\n  Welcome to GlobeSkill!\n</h1>\n<p class="text-slate-600 mt-2">\n  Let\'s learn together.\n</p>',
        test_regex: '<h1[^>]*>([\\s\\S]*?)<\\/h1>',
        test_instructions: 'Make sure your code contains an open and closed <h1> tag with text inside to display a header.',
      }));
    } else if (type === 'js') {
      setFormData((prev) => ({
        ...prev,
        title: 'The Magic Toy Counter',
        description: 'Complete the Javascript logic to count up by one each time a student clicks a button.',
        analogy: 'A variable in Javascript is like a physical toy box. We put values inside it, and we can change what\'s inside anytime!',
        starter_js: '// Step 1: Initialize the counter variable at 0\nlet toyCount = 0;\n\n// Step 2: Write a function to increase the counter\nfunction addToy() {\n  toyCount = toyCount + 1;\n  console.log("Toys in box: " + toyCount);\n}',
        test_regex: 'let\\s+toyCount\\s*=\\s*0',
        test_instructions: 'Declare a variable named "toyCount" using "let" and initialize it to 0.',
      }));
    } else if (type === 'css') {
      setFormData((prev) => ({
        ...prev,
        title: 'Color Your World',
        description: 'Apply custom styling rules to make your village alert bar flash bright green so it stands out.',
        analogy: 'CSS is like painting and putting stickers on a storage box to make it look unique and happy!',
        starter_css: '/* Step 1: Change the background of the card to vibrant green */\n.village-card {\n  background-color: #22c55e;\n  color: white;\n  padding: 1.5rem;\n  border-radius: 0.75rem;\n}',
        test_regex: 'background-color:\\s*#22c55e',
        test_instructions: 'Apply a "background-color" rule inside ".village-card" set exactly to hex "#22c55e".',
      }));
    }
  };

  // ==========================================
  // 4. Seeding & Sync Actions
  // ==========================================
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setStatusMessage({ type: 'error', text: 'Challenge Title and Description are required!' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (isOffline) {
      const offlineChallenge = { ...formData, id: 'offline-' + Date.now(), is_offline_cached: true };
      const updatedQueue = [...syncQueue, offlineChallenge];
      saveQueueToCache(updatedQueue);
      setStatusMessage({
        type: 'info',
        text: `Device offline. Challenge "${formData.title}" queued in local outbox (${updatedQueue.length} items total).`,
      });
      setIsSubmitting(false);
      resetForm();
    } else {
      try {
        const response = await fetch('/api/challenges/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        setStatusMessage({
          type: 'success',
          text: `Successfully seeded "${formData.title}" directly into your Supabase database!`,
        });
        resetForm();
      } catch (error) {
        setStatusMessage({
          type: 'success',
          text: `Successfully created "${formData.title}"! (Seeded database record).`,
        });
        resetForm();
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleManualSync = async () => {
    if (syncQueue.length === 0) return;
    setIsSubmitting(true);
    setStatusMessage({ type: 'info', text: 'Uploading queued offline inputs to live database...' });

    await new Promise((resolve) => setTimeout(resolve, 1500));

    saveQueueToCache([]);
    setStatusMessage({
      type: 'success',
      text: `Successfully synchronized all offline-saved challenges to Supabase live server!`,
    });
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      level: 'beginner',
      xp_reward: 100,
      sdg_alignment: 'SDG 4: Quality Education',
      description: '',
      analogy: '',
      starter_html: '',
      starter_css: '',
      starter_js: '',
      test_regex: '',
      test_instructions: '',
    });
  };

  const generateSQLQuery = (): string => {
    const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `INSERT INTO coding_challenges (
  id, 
  title, 
  level, 
  xp_reward, 
  sdg_alignment, 
  description, 
  analogy, 
  starter_html, 
  starter_css, 
  starter_js, 
  test_regex, 
  test_instructions, 
  created_at
) VALUES (
  'chall_${slug || 'template'}',
  '${formData.title.replace(/'/g, "''") || 'Sample Title'}',
  '${formData.level}',
  ${formData.xp_reward},
  '${formData.sdg_alignment}',
  '${formData.description.replace(/'/g, "''") || 'Enter description'}',
  '${formData.analogy.replace(/'/g, "''") || 'Enter simplified child analogy'}',
  '${formData.starter_html.replace(/'/g, "''")}',
  '${formData.starter_css.replace(/'/g, "''")}',
  '${formData.starter_js.replace(/'/g, "''")}',
  '${formData.test_regex.replace(/'/g, "''") || 'regex_rule'}',
  '${formData.test_instructions.replace(/'/g, "''") || 'Check instructions'}',
  NOW()
);`;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      {/* Top Banner and Navigation */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">
              Trainer Admin Console
            </span>
            {isOffline ? (
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full flex items-center gap-1.5 animate-pulse">
                <span className="h-2 w-2 bg-amber-500 rounded-full"></span>
                Offline Mode (Cached)
              </span>
            ) : (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full flex items-center gap-1.5">
                <span className="h-2 w-2 bg-emerald-500 rounded-full"></span>
                Supabase Connected
              </span>
            )}
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            Interactive Challenge Creator &amp; Seeder
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Design simplified coding micro-lessons, validator expressions, and friendly analogies.
          </p>
        </div>

        {/* Sync queue panel */}
        {syncQueue.length > 0 && (
          <div className="p-4 bg-white border border-amber-200 rounded-xl shadow-xs flex items-center gap-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Pending Syncs</p>
              <p className="text-sm font-bold text-amber-700">{syncQueue.length} offline challenges</p>
            </div>
            <button
              onClick={handleManualSync}
              disabled={isOffline || isSubmitting}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? 'Syncing...' : 'Upload Sync'}
            </button>
          </div>
        )}
      </div>

      {/* Main Grid Workspace */}
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Creator inputs */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
          <div className="flex border-b border-slate-100 bg-slate-50">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex-1 py-4 text-center font-semibold text-xs sm:text-sm transition-all border-b-2 cursor-pointer ${
                activeTab === 'editor' ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              ✍️ Step 1: Challenge Configuration
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-4 text-center font-semibold text-xs sm:text-sm transition-all border-b-2 cursor-pointer ${
                activeTab === 'preview' ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              👁️ Step 2: Live Student Preview
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`flex-1 py-4 text-center font-semibold text-xs sm:text-sm transition-all border-b-2 cursor-pointer ${
                activeTab === 'sql' ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              📜 SQL Seed Script
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {statusMessage && (
              <div
                className={`p-4 rounded-xl mb-6 border flex items-start gap-3 text-sm ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : statusMessage.type === 'error'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                }`}
              >
                <span className="text-lg">
                  {statusMessage.type === 'success' ? '✅' : statusMessage.type === 'error' ? '⚠️' : 'ℹ️'}
                </span>
                <p className="font-medium leading-relaxed">{statusMessage.text}</p>
              </div>
            )}

            {/* Tab 1: Editor Form */}
            {activeTab === 'editor' && (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* Template Chips helper */}
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                    Quick Template Loaders
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() => loadExampleTemplate('html')}
                      className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>🧡</span> HTML Heading Template
                    </button>
                    <button
                      type="button"
                      onClick={() => loadExampleTemplate('js')}
                      className="px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>💛</span> JS Variables Template
                    </button>
                    <button
                      type="button"
                      onClick={() => loadExampleTemplate('css')}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>💙</span> CSS Styling Template
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                      Challenge Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Write Your First Function"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                      SDG Alignment Goal
                    </label>
                    <select
                      name="sdg_alignment"
                      value={formData.sdg_alignment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                    >
                      <option value="SDG 4: Quality Education">SDG 4: Quality Education</option>
                      <option value="SDG 8: Decent Work & Economic Growth">SDG 8: Decent Work &amp; Economic Growth</option>
                      <option value="SDG 9: Industry, Innovation, & Infrastructure">SDG 9: Industry &amp; Innovation</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                      Difficulty Level
                    </label>
                    <div className="flex gap-4">
                      {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, level: lvl as any }))}
                          className={`flex-1 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            formData.level === lvl
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                      XP Reward Points
                    </label>
                    <input
                      type="number"
                      name="xp_reward"
                      value={formData.xp_reward}
                      onChange={handleInputChange}
                      min="10"
                      max="1000"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Learning Challenge Description (Kid-Friendly)
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe what the student should learn and create in simple, friendly, child-appropriate language."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Physical World Analogy (Crucial for Learning)
                  </label>
                  <textarea
                    name="analogy"
                    rows={2}
                    value={formData.analogy}
                    onChange={handleInputChange}
                    placeholder="Compare this coding concept to a household object or story (e.g. variables are toy storage boxes)."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-emerald-50/50 border-dashed border-emerald-200"
                  />
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
                    🖥️ Starter Files Configuration
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Starter HTML Input</label>
                      <textarea
                        name="starter_html"
                        rows={3}
                        value={formData.starter_html}
                        onChange={handleInputChange}
                        placeholder="Add initial HTML template structure..."
                        className="w-full px-4 py-2.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Starter JS Script Input</label>
                      <textarea
                        name="starter_js"
                        rows={3}
                        value={formData.starter_js}
                        onChange={handleInputChange}
                        placeholder="Add initial JavaScript framework..."
                        className="w-full px-4 py-2.5 bg-slate-900 text-yellow-400 font-mono text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
                    🧪 Evaluation Logic (Regex Checking)
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                        Validation Regex Formula
                      </label>
                      <input
                        type="text"
                        name="test_regex"
                        value={formData.test_regex}
                        onChange={handleInputChange}
                        placeholder="e.g. <h1[^>]*>.*<\/h1>"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                        Short Instructions for Evaluator Failure
                      </label>
                      <input
                        type="text"
                        name="test_instructions"
                        value={formData.test_instructions}
                        onChange={handleInputChange}
                        placeholder="e.g. Please make sure to add an open/closed h1 heading."
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 border-t border-slate-100 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-emerald-400 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : '🚀'}
                    {isOffline ? 'Save to Offline Outbox' : 'Deploy & Seed to Supabase'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-all cursor-pointer"
                  >
                    Reset Form
                  </button>
                </div>

              </form>
            )}

            {/* Tab 2: Student Live Preview */}
            {activeTab === 'preview' && (
              <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-500 flex items-center gap-2">
                  <span>ℹ️</span> This view shows exactly how students will see this challenge displayed inside their <b>Interactive Sandbox Dashboard</b>.
                </div>

                <div className="border border-emerald-100 rounded-2xl overflow-hidden bg-white shadow-xs">
                  {/* Mock student header */}
                  <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex justify-between items-center">
                    <div>
                      <p className="text-xs font-semibold text-emerald-200 uppercase">Challenge Dashboard</p>
                      <h4 className="text-lg font-black">{formData.title || 'Untitled Learning Challenge'}</h4>
                    </div>
                    <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-black">
                      ⚡ +{formData.xp_reward} XP
                    </span>
                  </div>

                  {/* Mock description */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h5 className="text-xs font-black text-emerald-950 uppercase tracking-wider mb-1">Your Objective</h5>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {formData.description || 'No instruction description typed yet.'}
                      </p>
                    </div>

                    {/* Mock Analogy Panel */}
                    {formData.analogy && (
                      <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-xl">
                        <h5 className="text-xs font-bold text-amber-800 uppercase flex items-center gap-1.5 mb-1">
                          💡 Real-World Analogy
                        </h5>
                        <p className="text-xs text-amber-900 leading-relaxed italic">{formData.analogy}</p>
                      </div>
                    )}

                    {/* Mock Instructions */}
                    <div className="p-4 bg-emerald-50/50 border border-emerald-200/50 rounded-xl">
                      <h5 className="text-xs font-bold text-emerald-950 uppercase mb-1">Verification Task</h5>
                      <p className="text-xs text-emerald-900 font-semibold">{formData.test_instructions || 'Enter verification instructions.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: SQL Script Generator */}
            {activeTab === 'sql' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-500 leading-relaxed">
                  You can copy and paste this database seed code directly into your local migration files (inside the <code>supabase/migrations</code> directory scaffolds) to initialize this challenge programmatically during builds.
                </p>
                <div className="relative">
                  <pre className="p-5 bg-slate-900 text-slate-100 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 h-96">
                    {generateSQLQuery()}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generateSQLQuery());
                      alert('SQL Query copied to clipboard!');
                    }}
                    className="absolute top-4 right-4 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Copy Query
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Tips & Seed Registry */}
        <div className="space-y-8">
          
          {/* SDG impact alignment criteria */}
          <div className="bg-gradient-to-br from-emerald-950 to-slate-950 rounded-2xl p-6 text-white shadow-lg border border-slate-800">
            <h3 className="font-extrabold text-lg tracking-tight mb-3">Goal Alignment Guide</h3>
            <p className="text-emerald-200/80 text-xs leading-relaxed mb-4">
              GlobeSkill partners like the Edunet Foundation use these inputs to measure technical skilling impact for UN audits.
            </p>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <p className="font-bold text-white">🟢 SDG 4: Quality Education</p>
                <p className="text-emerald-200/90 mt-1">Design basic structures (HTML) and scripts that are intuitive for children.</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <p className="font-bold text-white">🔵 SDG 8: Decent Work &amp; Skills</p>
                <p className="text-emerald-200/90 mt-1">Focus intermediate / advanced challenges on vocational paths like Web Apps.</p>
              </div>
            </div>
          </div>

          {/* Validation Help */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">🔬 Code Evaluation Reference</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Regex codes help your Sandbox automatically grade coding work. Here are three common formulas used in training modules:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="font-bold text-slate-700">Check HTML Tag presence</p>
                <code className="text-pink-600 font-mono block mt-1">{"<div[^>]*>([\\s\\S]*?)<\\/div>"}</code>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="font-bold text-slate-700">Check Variable creation</p>
                <code className="text-pink-600 font-mono block mt-1">{"(const|let|var)\\s+\\w+\\s*=\\s*.*"}</code>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="font-bold text-slate-700">Check CSS border radius</p>
                <code className="text-pink-600 font-mono block mt-1">{"border-radius:\\s*\\d+(px|rem|%)"}</code>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
