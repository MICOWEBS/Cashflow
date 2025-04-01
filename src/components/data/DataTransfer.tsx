"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { useState } from "react";
import api from "@/lib/api";

interface DataTransferProps {
  className?: string;
}

export function DataTransfer({ className }: DataTransferProps) {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleExport = async (type: "csv" | "pdf") => {
    try {
      const response = await api.get(`/api/export/${type}`, {
        responseType: "blob"
      });
      
      const blob = new Blob([response.data], {
        type: type === "csv" 
          ? "text/csv" 
          : "application/pdf"
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `transactions-${new Date().toISOString().split("T")[0]}.${type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      setError(`Failed to export data: ${err.message}`);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/api/import", formData);
      setSuccess("Data imported successfully!");
      event.target.value = ""; // Reset file input
    } catch (err: any) {
      setError(`Failed to import data: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-4">
        <button
          onClick={() => handleExport("csv")}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Export CSV
        </button>
        <button
          onClick={() => handleExport("pdf")}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Export PDF
        </button>
        <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
          Import CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}
      {success && (
        <div className="p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}
    </div>
  );
} 