"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import RoleGate from '@/components/RoleGate';
import { Donation } from '@/types/database';
import { getDonorHistory } from '@/lib/services/donation.service';
import { 
  Heart, 
  Download, 
  FileText, 
  ShieldCheck, 
  Users
} from 'lucide-react';

export default function DonorDashboardPage() {
  const { profile } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const emailOrId = profile?.email || 'donor.vikram@techgives.org';
      const history = await getDonorHistory(emailOrId);
      setDonations(history);
      setLoading(false);
    }
    load();
  }, [profile]);

  const totalGiven = donations.reduce((sum, d) => sum + (d.payment_status === 'succeeded' ? Number(d.amount) : 0), 0);
  const studentsSupported = Math.max(20, Math.floor(totalGiven / 2500));

  return (
    <RoleGate allowedRoles={['donor', 'admin']} portalName="Donor &amp; Philanthropy Hub">
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-rose-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-700/60 border border-rose-500/40 px-3 py-1 rounded-full text-xs font-semibold text-rose-200 mb-3">
              <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" /> Funder &amp; Partner Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {profile?.full_name || 'Global Philanthropist'}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-200">
              Track your cumulative impact, download official 80G tax receipts, and explore active cohorts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/donate"
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Heart className="w-4 h-4 fill-white" /> Make New Contribution
            </Link>
          </div>
        </div>

        {/* Lifetime Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Heart className="w-6 h-6 fill-rose-500" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Contributions</span>
              <span className="text-2xl font-black text-slate-900">₹{totalGiven.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Students Empowered</span>
              <span className="text-2xl font-black text-slate-900">{studentsSupported} Learners</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Tax Exemption Status</span>
              <span className="text-base font-bold text-indigo-900">Section 80G Certified</span>
            </div>
          </div>
        </div>

        {/* Transaction History & Receipt Center */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" /> Contribution Log &amp; 80G Tax Receipts
              </h2>
              <p className="text-xs text-slate-500">
                Instantly download or print official non-profit receipts for your accounting records.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-slate-500 text-xs">Loading transaction records...</div>
          ) : donations.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
              <p className="text-xs text-slate-500">No donations recorded under this account yet.</p>
              <Link href="/donate" className="text-xs font-bold text-rose-600 hover:underline mt-2 inline-block">
                Make your first contribution &rarr;
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 px-2">Transaction ID</th>
                    <th className="pb-3 px-2">Date</th>
                    <th className="pb-3 px-2">Program Supported</th>
                    <th className="pb-3 px-2">Amount</th>
                    <th className="pb-3 px-2">Method</th>
                    <th className="pb-3 px-2 text-right">Official Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donations.map((don) => (
                    <tr key={don.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-2 font-mono text-[11px] font-bold text-slate-900">
                        {don.transaction_id}
                      </td>
                      <td className="py-3.5 px-2 text-slate-600">
                        {new Date(don.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-2">
                        <span className="font-semibold text-slate-800 block">
                          {don.sponsor_target_name || don.cause_target}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">{don.cause_target}</span>
                      </td>
                      <td className="py-3.5 px-2 font-bold text-emerald-800 text-sm">
                        ₹{Number(don.amount).toLocaleString('en-IN')} {don.currency}
                      </td>
                      <td className="py-3.5 px-2 text-slate-600 capitalize">
                        {don.payment_method}
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <a
                          href={don.receipt_url || `/api/donations/receipt?id=${don.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-all shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" /> 80G Receipt
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </RoleGate>
  );
}
