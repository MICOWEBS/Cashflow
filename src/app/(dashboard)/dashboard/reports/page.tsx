"use client";

import { useState, useEffect } from "react";
import { DateFilter } from "@/components/ui/DateFilter";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import api from "@/lib/api";
import { ApiError } from "@/types/api";

interface ReportData extends Record<string, unknown> {
  id: string;
  date: string;
  amount: number;
  customerName: string | null;
  paymentMode: string;
  description: string;
}

interface ReportResponse {
  transactions: ReportData[];
  summary: {
    totalAmount: number;
    averageAmount: number;
    transactionCount: number;
    growth: number;
  };
}

export default function Reports() {
  const [activeReport, setActiveReport] = useState<string>("received");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ReportData[]>([]);
  const [summary, setSummary] = useState<ReportResponse['summary']>({
    totalAmount: 0,
    averageAmount: 0,
    transactionCount: 0,
    growth: 0
  });
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<string>("");

  const reports = [
    { id: "received", name: "Payment Received" },
    { id: "made", name: "Payment Made" },
  ];

  const fetchReport = async (type: string, range?: string, search?: string) => {
    try {
      setLoading(true);
      let url = `/api/reports/${type}`;
      const params = new URLSearchParams();
      
      if (range) params.append("dateRange", range);
      if (search) params.append("search", search);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await api.get<ReportResponse>(url);
      setData(response.data.transactions);
      setSummary(response.data.summary);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(activeReport, dateRange, searchQuery);
  }, [activeReport, dateRange, searchQuery]);

  const handleExport = async (format: "pdf" | "xlsx") => {
    try {
      const response = await api.get(
        `/api/reports/${activeReport}/export?format=${format}&range=${dateRange}&search=${searchQuery}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${activeReport}_report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || "Failed to export report");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <DateFilter 
            onFilterChange={(range) => setDateRange(range || "")}
            className="w-full sm:w-auto"
          />
          <SearchInput
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
            placeholder="Search by customer name..."
            className="w-full sm:w-auto"
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleExport("pdf")}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              Export PDF
            </button>
            <button
              onClick={() => handleExport("xlsx")}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <nav className="flex space-x-4 p-4" aria-label="Report types">
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => setActiveReport(report.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap
                  ${activeReport === report.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {report.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Report Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-md">
              {error}
            </div>
          )}

          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800">Total Amount</h3>
                  <p className="mt-2 text-2xl font-semibold text-green-900">
                    ${summary.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800">Transaction Count</h3>
                  <p className="mt-2 text-2xl font-semibold text-blue-900">
                    {summary.transactionCount}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-800">Average Amount</h3>
                  <p className="mt-2 text-2xl font-semibold text-purple-900">
                    ${summary.averageAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-yellow-800">Growth</h3>
                  <p className="mt-2 text-2xl font-semibold text-yellow-900">
                    {summary.growth.toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* Data Table */}
              <DataTable
                columns={getColumnsForReport(activeReport)}
                data={data}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getColumnsForReport(reportType: string) {
  const commonColumns = [
    { key: "date", label: "Date" },
    { key: "amount", label: "Amount" },
    { key: "paymentMode", label: "Payment Mode" },
    { key: "description", label: "Description" },
  ];

  if (reportType === "received") {
    return [
      { key: "customerName", label: "Customer Name" },
      ...commonColumns,
    ];
  } else {
    return [
      { key: "customerName", label: "Vendor Name" },
      ...commonColumns,
    ];
  }
} 