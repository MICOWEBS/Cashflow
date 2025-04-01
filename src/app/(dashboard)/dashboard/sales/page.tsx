"use client";

import { useState } from "react";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import api from "@/lib/api";

interface TransactionData {
  type: 'sale';
  amount: number;
  date: string;
  paymentMode: string;
  remarks: string;
  customerId: string;
}

export default function Sales() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const transactionData: TransactionData = {
        type: 'sale',
        amount: parseFloat(data.amount),
        date: data.paymentDate,
        paymentMode: data.paymentMode,
        remarks: data.remarks,
        customerId: data.customerId
      };
      
      await api.post("/api/transactions", transactionData);
      setSuccess("Sale recorded successfully!");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to record sale");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Record Sale</h1>
          <p className="text-sm text-gray-500 mt-1">
            Record a new sale transaction
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {success}
        </div>
      )}

      <TransactionForm
        type="sale"
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
} 