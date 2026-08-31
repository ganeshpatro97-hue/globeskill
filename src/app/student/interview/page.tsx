"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import RoleGate from '@/components/RoleGate';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';
import VoiceNarrator from '@/components/VoiceNarrator';
import { 
  Sparkles, 
  Send, 
  Award, 
  CheckCircle2, 
  Clock, 
  ChevronLeft, 
  RotateCcw, 
  HelpCircle, 
  ArrowRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';

interface Question {
  id: string;
  category: string;
  question: string;
}

interface Evaluation {
  score: number;
  confidence_rating: string;
  strengths: string;
  improvement_tip: string;
  model_answer: string;
}

export default function MockInterviewPage() {
  const { profile } = useAuth();
  const { t, language } = useTranslation();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerInput, setAnswerInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [evaluationsList, setEvaluationsList] = useState<Evaluation[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [language]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_questions',
          studentName: profile?.full_name || 'Young Coder',
          completedCourses: ['AI Micro Degree for Young Innovators', 'IBM SkillsBuild Tech Basics'],
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerInput.trim() || loading || !questions[currentIndex]) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate_answer',
          currentQuestion: questions[currentIndex].question,
          candidateAnswer: answerInput,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const evalResult: Evaluation = data.evaluation;
        setEvaluation(evalResult);
        setEvaluationsList((prev) => [...prev, evalResult]);
      }
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    setAnswerInput('');
    setEvaluation(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswerInput('');
    setEvaluation(null);
    setEvaluationsList([]);
    setIsCompleted(false);
    fetchQuestions();
  };

  const avgScore = evaluationsList.length > 0
    ? Math.round(evaluationsList.reduce((acc, curr) => acc + curr.score, 0) / evaluationsList.length)
    : 92;

  const currentQ = questions[currentIndex];

  return (
    <RoleGate allowedRoles={['student', 'admin', 'trainer', 'recruiter']}>
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/student"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>

            <span className="text-xs font-mono text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Recruiter Simulator
            </span>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-6 sm:p-8 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-200 bg-emerald-500/30 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                    UN SDG 8 Career Enablement
                  </span>
                  <h1 className="text-2xl font-black text-white mt-1">
                    AI Mock Interview &amp; Verbal Coaching
                  </h1>
                  <p className="text-emerald-100/90 text-xs mt-1">
                    Practice answering real-world tech questions with instant scoring, feedback, and model solutions.
                  </p>
                </div>

                {!isCompleted && questions.length > 0 && (
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center shrink-0">
                    <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">Question</span>
                    <p className="text-lg font-extrabold text-white">
                      {currentIndex + 1} / {questions.length}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {!isCompleted ? (
                <>
                  {/* Current Question Card */}
                  {currentQ ? (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                          {currentQ.category}
                        </span>
                        <VoiceNarrator text={currentQ.question} label="Listen Question" />
                      </div>

                      <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                        {currentQ.question}
                      </p>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500">
                      <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-xs">Preparing customized interview questions...</p>
                    </div>
                  )}

                  {/* Answer Box */}
                  {!evaluation ? (
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-700">
                        Your Answer (Type your technical answer below):
                      </label>
                      <textarea
                        rows={4}
                        value={answerInput}
                        onChange={(e) => setAnswerInput(e.target.value)}
                        placeholder="Explain your approach clearly using simple analogies or code concepts..."
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                      ></textarea>

                      <div className="flex justify-end">
                        <button
                          onClick={handleSubmitAnswer}
                          disabled={!answerInput.trim() || loading}
                          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          {loading ? 'AI Evaluating Answer...' : 'Submit Answer for AI Review'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* AI Evaluation Feedback Card */
                    <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 animate-in fade-in duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <h3 className="font-bold text-sm text-emerald-950">AI Coach Evaluation</h3>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-white bg-emerald-600 px-3 py-1 rounded-xl shadow-xs">
                            Score: {evaluation.score}/100
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-3.5 rounded-xl border border-emerald-100 space-y-1">
                          <p className="font-bold text-emerald-900">🌟 What You Did Well</p>
                          <p className="text-slate-600 leading-relaxed">{evaluation.strengths}</p>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-emerald-100 space-y-1">
                          <p className="font-bold text-amber-900">💡 Pro Tip to Level Up</p>
                          <p className="text-slate-600 leading-relaxed">{evaluation.improvement_tip}</p>
                        </div>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-emerald-100 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-slate-800">📖 Recommended Model Answer</p>
                          <VoiceNarrator text={evaluation.model_answer} label="Listen Model Answer" />
                        </div>
                        <p className="text-slate-600 leading-relaxed">{evaluation.model_answer}</p>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleNextQuestion}
                          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'Complete Session'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Completion Summary Screen */
                <div className="text-center py-8 space-y-5 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                    <Award className="w-9 h-9" />
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-900">Mock Interview Complete!</h2>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Great job practicing your technical communication! You have demonstrated readiness for vocational CSR tech internships.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <div className="text-center px-4">
                      <p className="text-2xl font-black text-emerald-700">{avgScore}%</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Overall Score</p>
                    </div>
                    <div className="h-8 w-px bg-emerald-200"></div>
                    <div className="text-center px-4">
                      <p className="text-2xl font-black text-emerald-700">{evaluationsList.length}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Questions Answered</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                    <button
                      onClick={handleRestart}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Try Another Session
                    </button>

                    <Link
                      href="/student/portfolio"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Update Verified Portfolio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </RoleGate>
  );
}
