"use client";

// GlobeSkill Phase 4: Donation Success & Thank You Page (React / TypeScript / Tailwind CSS)
// This file implements a responsive, highly polished Donation Success and Thank You page
// designed to provide donors with verified receipts, 80G tax exemption details, and impact statistics.

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Define TS Interfaces for receipt data
interface DonationDetails {
  transactionId: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  paymentMethod: string;
  date: string;
  supportedCause: string;
  panNumber?: string;
  isTaxExempt: boolean;
}

export default function DonationSuccessPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [donation, setDonation] = useState<DonationDetails | null>(null);
  const [downloadingReceipt, setDownloadingReceipt] = useState<boolean>(false);
  const [receiptDownloaded, setReceiptDownloaded] = useState<boolean>(false);

  useEffect(() => {
    // Simulate fetching latest transaction details from Supabase `/api/donations/stats` or session state
    const timer = setTimeout(() => {
      setDonation({
        transactionId: 'TXN-902381744-GS',
        donorName: 'Rahul Verma',
        donorEmail: 'rahul.verma@example.com',
        amount: 5000,
        paymentMethod: 'UPI (GPay / PhonePe)',
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        supportedCause: 'AI Careers for Women Cohort',
        panNumber: 'ABCDE1234F',
        isTaxExempt: true
      });
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleDownloadReceipt = () => {
    setDownloadingReceipt(true);
    // Simulate PDF generation using standard non-profit receipt templates
    setTimeout(() => {
      setDownloadingReceipt(false);
      setReceiptDownloaded(true);
      window.open('/api/donations/receipt', '_blank');
    }, 1800);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 font-sans">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <div className="absolute text-xs font-semibold text-emerald-600">GS</div>
        </div>
        <p className="mt-4 text-slate-600 font-medium animate-pulse">Verifying payment with gateway secure server...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Top Success Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-center p-8 sm:p-12 mb-8 relative">
          {/* Confetti Decorative Background Element */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600"></div>
          
          {/* Animated Success Badge */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-50 mb-6 border border-emerald-100">
            <svg className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Thank You for Your Generosity!</h1>
          <p className="mt-3 text-lg text-slate-600 max-w-xl mx-auto">
            Your contribution has been successfully processed. You are directly enabling future-ready technology education for underprivileged youth.
          </p>

          <div className="mt-6 inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-100">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-ping"></span>
            1 Student Fully Sponsored for the AI Micro Degree Program
          </div>
        </div>

        {/* Transaction & Impact Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Left: Invoice Receipt Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 md:col-span-3">
            <div className="flex justify-between items-center pb-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Payment Receipt</h2>
              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded">Official</span>
            </div>

            {donation && (
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction ID</span>
                  <span className="font-mono font-semibold text-slate-800">{donation.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Donor Name</span>
                  <span className="font-semibold text-slate-800">{donation.donorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email Address</span>
                  <span className="text-slate-800">{donation.donorEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Date</span>
                  <span className="text-slate-800">{donation.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Method</span>
                  <span className="text-slate-800">{donation.paymentMethod}</span>
                </div>
                <div className="flex justify-between pb-4 border-b border-dashed border-slate-100">
                  <span className="text-slate-500">Allocated Initiative</span>
                  <span className="font-medium text-emerald-700">{donation.supportedCause}</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-bold text-slate-900">Total Amount Paid</span>
                  <span className="text-2xl font-extrabold text-slate-950">₹{donation.amount.toLocaleString('en-IN')}.00</span>
                </div>

                {donation.isTaxExempt && donation.panNumber && (
                  <div className="mt-6 bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <div className="flex space-x-3">
                      <svg className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div>
                        <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">80G Tax Exemption Applied</h4>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          PAN Number: <span className="font-mono font-semibold">{donation.panNumber}</span>. Under Section 80G of the Indian Income Tax Act, you are eligible to claim a 50% tax deduction for this contribution.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Print / Download Button */}
                <div className="pt-6">
                  <button
                    onClick={handleDownloadReceipt}
                    disabled={downloadingReceipt}
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center transition-all cursor-pointer ${
                      receiptDownloaded 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    {downloadingReceipt ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Compiling 80G Tax Exemption Receipt...
                      </>
                    ) : receiptDownloaded ? (
                      <>
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Receipt Downloaded Successfully!
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download 80G Tax Exemption Receipt
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-3">
                    A copy of this receipt has also been dispatched to <span className="font-medium text-slate-500">{donation?.donorEmail}</span>.
                  </p>
                </div>

              </div>
            )}
          </div>

          {/* Right: NGO Information & Core Alignment Panel */}
          <div className="space-y-6 md:col-span-2">
            
            {/* Certifications Block */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">NGO Certifications</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 text-xs">
                  <div className="h-6 w-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-bold">12A</div>
                  <div>
                    <h5 className="font-bold text-slate-800">12A Registration Active</h5>
                    <p className="text-slate-500 mt-0.5">Approved under Section 12A of the Income Tax Act for tax-exempt operations.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs pt-3 border-t border-slate-100">
                  <div className="h-6 w-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-bold">80G</div>
                  <div>
                    <h5 className="font-bold text-slate-800">80G Exemption Certified</h5>
                    <p className="text-slate-500 mt-0.5">Enables Indian donors to save tax on donations with automatic verification.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs pt-3 border-t border-slate-100">
                  <div className="h-6 w-6 rounded bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 font-bold">UN</div>
                  <div>
                    <h5 className="font-bold text-slate-800">UN ECOSOC Special Consultative Status</h5>
                    <p className="text-slate-500 mt-0.5">Aligned with global standards on youth skill deployment &amp; development indexes.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Metrics Panel */}
            <div className="bg-slate-900 rounded-2xl text-white p-6 relative overflow-hidden">
              <div className="absolute -right-12 -bottom-12 h-36 w-36 rounded-full bg-slate-800 opacity-30"></div>
              
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 relative z-10">Your Direct Impact</h3>
              
              <div className="space-y-4 relative z-10">
                <div>
                  <div className="text-2xl font-extrabold text-white">40+ Hours</div>
                  <div className="text-xs text-slate-300 mt-1">Of certified technical instruction &amp; coding labs provided to an underserved student.</div>
                </div>
                
                <div className="pt-3 border-t border-slate-800">
                  <div className="text-2xl font-extrabold text-white">IBM SkillsBuild</div>
                  <div className="text-xs text-slate-300 mt-1">Direct integration with official technology pathways and career mentoring portfolios.</div>
                </div>
              </div>
            </div>

            {/* Support / Help Panel */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
              <p className="text-xs text-slate-500">Having trouble with your tax receipt or payment verification?</p>
              <a href="mailto:support@globeskill.org" className="mt-2 inline-block text-xs font-bold text-emerald-600 hover:text-emerald-700">
                Contact GlobeSkill Finance Team
              </a>
            </div>

          </div>

        </div>

        {/* Bottom Actions */}
        <div className="mt-12 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/student"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors shadow-sm text-center"
          >
            Access Learning Portal
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-sm hover:bg-emerald-100 transition-colors text-center"
          >
            Return to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}
