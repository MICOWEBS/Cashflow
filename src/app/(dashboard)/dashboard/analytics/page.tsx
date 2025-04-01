"use client";

import { useState, useEffect } from "react";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { DateFilter } from "@/components/ui/DateFilter";
import api from "@/lib/api";

interface AnalyticsData {
  cashFlow: {
    labels: string[];
    income: number[];
    expenses: number[];
  };
  expensesByCategory: {
    labels: string[];
    data: number[];
  };
  trends: {
    labels: string[];
    values: number[];
    prediction: number[];
  };
}

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchAnalytics = async (dateRange?: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/analytics${dateRange ? `?range=${dateRange}` : ''}`);
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!data) return null;

  const cashFlowData = {
    labels: data.cashFlow.labels,
    datasets: [
      {
        label: 'Income',
        data: data.cashFlow.income,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
      },
      {
        label: 'Expenses',
        data: data.cashFlow.expenses,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ],
  };

  const expensesData = {
    labels: data.expensesByCategory.labels,
    datasets: [
      {
        label: 'Expenses by Category',
        data: data.expensesByCategory.data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
      },
    ],
  };

  const trendData = {
    labels: data.trends.labels,
    datasets: [
      {
        label: 'Actual',
        data: data.trends.values,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Forecast',
        data: data.trends.prediction,
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        borderDash: [5, 5],
      },
    ],
  };

  const calculateGrowthTrend = (data: AnalyticsData) => {
    const values = data.trends.values;
    if (values.length < 2) return 'Insufficient data';
    
    const growth = ((values[values.length - 1] - values[0]) / values[0]) * 100;
    return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
  };

  const calculateForecast = (data: AnalyticsData) => {
    const prediction = data.trends.prediction;
    if (prediction.length === 0) return 'No forecast available';
    
    const lastActual = data.trends.values[data.trends.values.length - 1];
    const nextPredicted = prediction[0];
    const change = ((nextPredicted - lastActual) / lastActual) * 100;
    
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}% next period`;
  };

  const calculateSeasonality = (data: AnalyticsData) => {
    const values = data.trends.values;
    if (values.length < 12) return 'Insufficient data';
    
    // Simple seasonality calculation (can be enhanced)
    const lastYear = values.slice(-12);
    const avg = lastYear.reduce((a, b) => a + b, 0) / 12;
    const variance = lastYear.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / 12;
    const seasonality = (Math.sqrt(variance) / avg) * 100;
    
    return `${seasonality.toFixed(1)}% variation`;
  };

  const monthlySummaryData = {
    labels: data.cashFlow.labels,
    datasets: [
      {
        label: 'Net Cash Flow',
        data: data.cashFlow.income.map((income, index) => income - data.cashFlow.expenses[index]),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Financial Analytics</h1>
        <DateFilter onFilterChange={fetchAnalytics} className="w-full sm:w-auto" />
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex overflow-x-auto" aria-label="Tabs">
          {['overview', 'expenses', 'trends'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm
                ${activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-[300px] bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium mb-4">Cash Flow</h2>
                <div className="h-[300px]">
                  <ChartWrapper type="line" data={cashFlowData} />
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium mb-4">Monthly Summary</h2>
                <div className="h-[300px]">
                  <ChartWrapper type="bar" data={monthlySummaryData} />
                </div>
              </div>
            </div>
          )}

          {/* Expenses Tab */}
          {activeTab === 'expenses' && (
            <div className="space-y-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium mb-4">Expenses by Category</h2>
                <div className="h-[400px]">
                  <ChartWrapper type="bar" data={expensesData} />
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.expensesByCategory.labels.map((category, index) => (
                  <div key={category} className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-gray-900">{category}</h3>
                    <p className="mt-1 text-2xl font-semibold text-primary">
                      ${data.expensesByCategory.data[index].toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium mb-4">Financial Trends & Forecast</h2>
                <div className="h-[400px]">
                  <ChartWrapper type="line" data={trendData} />
                </div>
              </div>

              {/* Key Insights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800">Growth Trend</h3>
                  <p className="mt-1 text-sm text-green-600">
                    {calculateGrowthTrend(data)}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800">Forecast</h3>
                  <p className="mt-1 text-sm text-blue-600">
                    {calculateForecast(data)}
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="text-sm font-medium text-yellow-800">Seasonality</h3>
                  <p className="mt-1 text-sm text-yellow-600">
                    {calculateSeasonality(data)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 