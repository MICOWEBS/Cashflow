"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { DateFilter } from "@/components/ui/DateFilter";
import api from "@/lib/api";
import { ApiError } from "@/types/api";

interface ActivityLog extends Record<string, unknown> {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

const columns = [
  {
    key: "timestamp",
    label: "Time",
    render: (value: unknown) => new Date(value as string).toLocaleString()
  },
  {
    key: "action",
    label: "Action",
    render: (value: unknown) => (
      <span className="font-medium text-gray-900">{value as string}</span>
    )
  },
  {
    key: "details",
    label: "Details",
    render: (value: unknown) => (
      <span className="text-gray-600">{value as string}</span>
    )
  },
  {
    key: "ipAddress",
    label: "IP Address",
    render: (value: unknown) => (
      <span className="text-gray-500">{value as string}</span>
    )
  }
];

export default function ActivityLog() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("");

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      let url = "/api/activity/activity-logs";
      if (dateRange) {
        url += `?range=${dateRange}`;
      }
      const response = await api.get<ActivityLog[]>(url);
      setActivities(response.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || "Failed to fetch activity log");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Activity Log</h1>
        <DateFilter
          onFilterChange={(range) => setDateRange(range || "")}
          className="w-48"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={activities}
          loading={loading}
        />
      </div>
    </div>
  );
} 