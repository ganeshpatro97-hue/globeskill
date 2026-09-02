"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { DonationStats, DonationCause } from '@/types/database';
import { getDonationStats } from '@/lib/services/donation.service';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';
import { 
  Heart, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  CreditCard, 
  QrCode, 
  Landmark, 
  Download, 
  Award
} from 'lucide-react';

const TIERS = [
  { amount: 1000, label: 'Sponsor 1 Student AI Toolkit', desc: 'Provides hands-on electronics kit & mentor access' },
  { amount: 2500, label: 'Sponsor Full AI Micro-Degree', desc: 'Complete 8-week guided cohort with certification' },
  { amount: 10000, label: 'Equip 1 Rural Smart Lab Station', desc: 'Hardware microcontroller & cloud computing credit' },
  { amount: 25000, label: 'Adopt a Full Classroom Cohort', desc: 'Sponsors 10 young learners for 6 months' },
];

const CAUSES: { id: DonationCause; name: string }[] = [
  { id: 'ai-scholarship', name: 'AI Micro-Degree Scholarships for Kids' },
  { id: 'rural-lab', name: 'Rural School Digital Literacy Labs' },
  { id: 'women-in-tech', name: 'Women in Tech & Data Careers Initiative' },
  { id: 'devices-for-kids', name: 'Refurbished Laptops & Learning Tablets' },
  { id: 'general', name: 'Where Needed Most (General Fund)' },
];

export default function SupportUsPage() {
  const { profile } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(2500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedCause, setSelectedCause] = useState<DonationCause>('ai-scholarship');
  const [donorName, setDonorName] = useState(profile?.full_name || 'Vikram Malhotra');
  const [donorEmail, setDonorEmail] = useState(profile?.email || 'donor.vikram@techgives.org');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('upi');
  const [processing, setProcessing] = useState(false);
  const [successReceiptUrl, setSuccessReceiptUrl] = useState<string | null>(null);
  const [successTxnId, setSuccessTxnId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const s = await getDonationStats();
      setStats(s);
    }
    load();
  }, []);

  const effectiveAmount = customAmount ? Number(customAmount) : selectedAmount;
  const progressPercent = stats ? Math.min(100, Math.round((stats.totalFundsRaised / stats.targetGoal) * 100)) : 35;

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveAmount || effectiveAmount <= 0) return;

    setProcessing(true);
    try {
      const res = await fetch('/api/donations/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: profile?.id || 'donor_guest',
          donorName,
          donorEmail,
          amount: effectiveAmount,
          paymentMethod,
          causeTarget: selectedCause,
          sponsorTargetName: CAUSES.find((c) => c.id === selectedCause)?.name,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessReceiptUrl(data.donation.receipt_url);
        setSuccessTxnId(data.donation.transaction_id);

        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#059669', '#10b981', '#f59e0b', '#e11d48', '#3b82f6'],
        });

        // Refresh stats
        const updatedStats = await getDonationStats();
        setStats(updatedStats);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      
      {/* Hero Impact Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-emerald-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-md relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 backdrop-blur-md border border-rose-400/30 px-3.5 py-1 rounded-full text-xs font-bold text-rose-200">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" /> {t('donationTagline')}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {t('Help Us Bridge the AI & Digital Opportunity Gap', 'Help Us Bridge the AI & Digital Opportunity Gap')}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
            {t('100% of your tax-deductible contribution directly sponsors laptops, localized AI curriculum, and hands-on coding mentors for underserved children.', '100% of your tax-deductible contribution directly sponsors laptops, localized AI curriculum, and hands-on coding mentors for underserved children.')}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> {t('taxExemption80G')}
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
              <Users className="w-4 h-4 text-teal-300" /> {t('Direct Student Cohort Matching', 'Direct Student Cohort Matching')}
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Fundraising Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              {t('Phase 1-5 National Campaign Goal', 'Phase 1-5 National Campaign Goal')}
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              ₹{stats ? stats.totalFundsRaised.toLocaleString('en-IN') : '1,75,000'} {t('Raised of ₹5,00,000 Target', 'Raised of ₹5,00,000 Target')}
            </h2>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-700">{progressPercent}%</span>
            <span className="text-xs text-slate-500 block">{t('of ₹5 Lakh Goal', 'of ₹5 Lakh Goal')}</span>
          </div>
        </div>

        {/* Progress Track */}
        <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200 p-0.5">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-700 relative"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-center text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 block">{t('Total Donors', 'Total Donors')}</span>
            <span className="text-base font-bold text-slate-900">{stats?.totalDonors || 14}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 block">{t('Students Sponsored', 'Students Sponsored')}</span>
            <span className="text-base font-bold text-emerald-700">{stats?.studentsSponsored || 70}+</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 block">{t('Avg Contribution', 'Avg Contribution')}</span>
            <span className="text-base font-bold text-slate-900">₹{stats?.averageDonation.toLocaleString('en-IN') || '2,500'}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 block">{t('Tax Exemption', 'Tax Exemption')}</span>
            <span className="text-base font-bold text-indigo-700">80G Eligible</span>
          </div>
        </div>
      </div>

      {/* Main Donation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Container (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            
            {successReceiptUrl ? (
              <div className="text-center py-8 space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">{t('donorThankYou')} ❤️</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {t('Your contribution of', 'Your contribution of')} <strong>₹{effectiveAmount.toLocaleString('en-IN')}</strong> {t('has been received with transaction ID', 'has been received with transaction ID')} <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">{successTxnId}</code>.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={successReceiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> {t('downloadReceipt')}
                  </a>
                  <Link
                    href="/donate/success"
                    className="w-full sm:w-auto px-5 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors text-center"
                  >
                    {t('View Verified Impact Details', 'View Verified Impact Details')} &rarr;
                  </Link>
                  <button
                    onClick={() => {
                      setSuccessReceiptUrl(null);
                      setSuccessTxnId(null);
                    }}
                    className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {t('Make Another Donation', 'Make Another Donation')}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDonate} className="space-y-6">
                
                {/* Tier Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    1. {t('Select Contribution Tier', 'Select Contribution Tier')}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {TIERS.map((tier) => {
                      const isSelected = selectedAmount === tier.amount && !customAmount;
                      return (
                        <div
                          key={tier.amount}
                          onClick={() => {
                            setSelectedAmount(tier.amount);
                            setCustomAmount('');
                          }}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-600 shadow-2xs'
                              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-base font-black text-slate-900">₹{tier.amount.toLocaleString('en-IN')}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          </div>
                          <p className="text-xs font-bold text-emerald-900 mt-1">{t(tier.label)}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{t(tier.desc)}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Custom Amount */}
                  <div className="mt-3">
                    <input
                      type="number"
                      placeholder={t('customAmount')}
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Cause Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    2. {t('Choose Program / Cause to Support', 'Choose Program / Cause to Support')}
                  </label>
                  <select
                    value={selectedCause}
                    onChange={(e) => setSelectedCause(e.target.value as DonationCause)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    {CAUSES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {t(c.name)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Donor Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{t('Donor Name / Org', 'Donor Name / Org')}</label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="e.g. Vikram Malhotra"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{t('Email (for 80G Receipt)', 'Email (for 80G Receipt)')}</label>
                    <input
                      type="email"
                      required
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="e.g. donor.vikram@techgives.org"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    3. {t('Payment Channel (Secure 256-Bit SSL)', 'Payment Channel (Secure 256-Bit SSL)')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'upi', label: 'UPI / QR Code', icon: <QrCode className="w-4 h-4" /> },
                      { id: 'card', label: 'Credit/Debit Card', icon: <CreditCard className="w-4 h-4" /> },
                      { id: 'netbanking', label: 'Net Banking', icon: <Landmark className="w-4 h-4" /> },
                    ].map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id as 'card' | 'upi' | 'netbanking')}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          paymentMethod === pm.id
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                            : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pm.icon}
                        <span>{t(pm.label)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
                  {processing ? t('Processing Secure Transaction...', 'Processing Secure Transaction...') : `${t('proceedToDonate')} (₹${effectiveAmount.toLocaleString('en-IN')})`}
                </button>

              </form>
            )}

          </div>
        </div>

        {/* Impact Transparency Sidebar */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> {t('100% Tax Deductible', '100% Tax Deductible')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('GlobeSkill is registered under Section 80G of the Income Tax Act. Donors in India receive a 50% tax exemption receipt instantly upon checkout.', 'GlobeSkill is registered under Section 80G of the Income Tax Act. Donors in India receive a 50% tax exemption receipt instantly upon checkout.')}
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div><strong>{t('Registration No:', 'Registration No:')}</strong> AAATG1234F20261</div>
              <div><strong>{t('Audit Standard:', 'Audit Standard:')}</strong> ISO 9001 Non-Profit Compliance</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl border border-emerald-200 p-6 shadow-xs space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
              {t('Where Your Money Goes', 'Where Your Money Goes')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span><strong>85%</strong> {t('Direct Learning Hardware & AI Kits', 'Direct Learning Hardware & AI Kits')}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <span><strong>10%</strong> {t('Trainer Stipends & Classroom Labs', 'Trainer Stipends & Classroom Labs')}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span><strong>5%</strong> {t('Operations & Cloud Infrastructure', 'Operations & Cloud Infrastructure')}</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
