"use client";

import { useEffect, useState } from "react";
import { DateFilter } from "@/components/ui/DateFilter";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import api from "@/lib/api";
import { TaggedTransactions } from "@/components/transactions/TaggedTransactions";

interface PaymentStats {
  period: string;
  totalPayments: number;
  totalSales: number;
  balance: number;
}

interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: 'payment' | 'sale';
  paymentMode: string;
  remarks: string;
  vendorName: string | null;
  vendorCompany: string | null;
  customerName: string | null;
  customerCompany: string | null;
}

export default function Dashboard() {
  const [stats, setStats] = useState<PaymentStats>({
    period: 'month',
    totalPayments: 0,
    totalSales: 0,
    balance: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async (period: string = 'month') => {
    try {
      setLoading(true);
      setError("");
      
      const [statsResponse, transactionsResponse] = await Promise.all([
        api.get(`/api/dashboard/stats?period=${period}`),
        api.get('/api/dashboard/transactions/recent?limit=5')
      ]);

      setStats(statsResponse.data);
      setRecentTransactions(transactionsResponse.data);
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError(err.response?.data?.error || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of your payment statistics and recent transactions
          </p>
        </div>
        <DateFilter onFilterChange={(range) => fetchStats(range)} />
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            title="Total Sales"
            amount={stats.totalSales}
            type="received"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <SummaryCard
            title="Total Payments"
            amount={stats.totalPayments}
            type="made"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <SummaryCard
            title="Balance"
            amount={stats.balance}
            type={stats.balance >= 0 ? "received" : "made"}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-medium mb-4">Recent Transactions</h2>
        <TaggedTransactions transactions={recentTransactions} />
      </div>
    </div>
  );
} 