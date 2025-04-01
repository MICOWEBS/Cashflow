"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { DateFilter } from "@/components/ui/DateFilter";
import api from "@/lib/api";

interface Session {
  id: string;
  deviceName: string;
  ipAddress: string;
  location: string;
  browser: string;
  os: string;
  loginTime: string;
  lastActive: string;
  status: "active" | "inactive";
}

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState<string>("");

  const columns = [
    { key: "deviceName", label: "Device Name" },
    { key: "ipAddress", label: "IP Address" },
    { key: "location", label: "Location" },
    { key: "browser", label: "Browser" },
    { key: "os", label: "Operating System" },
    { 
      key: "loginTime", 
      label: "Login Time",
      render: (value: string) => new Date(value).toLocaleString()
    },
    { 
      key: "lastActive", 
      label: "Last Active",
      render: (value: string) => new Date(value).toLocaleString()
    },
    { 
      key: "status", 
      label: "Status",
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
  ];

  const fetchSessions = async (range?: string) => {
    try {
      setLoading(true);
      const url = `/api/auth/sessions${range ? `?range=${range}` : ''}`;
      const response = await api.get(url);
      setSessions(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions(dateRange);
  }, [dateRange]);

  const handleTerminateSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to terminate this session?")) return;

    try {
      await api.post(`/api/sessions/${sessionId}/terminate`);
      await fetchSessions(dateRange); // Refresh the sessions list
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to terminate session");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Session History</h1>
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <DateFilter 
            onFilterChange={(range) => setDateRange(range || "")}
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            data={sessions}
            onDelete={(session: Session) => handleTerminateSession(session.id)}
          />
        </div>
      )}
    </div>
  );
} 