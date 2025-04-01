"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import api from "@/lib/api";
import { DataTable } from "@/components/ui/DataTable";

interface Session extends Record<string, unknown> {
  id: string;
  adminId: string;
  createdAt: string;
  ipAddress: string;
  userAgent: string;
}

interface PaginationData {
  total: number;
  page: number;
  pages: number;
}

export default function AdminSessions() {
  const router = useRouter();
  const { isAuthenticated } = useAdminAuthStore();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    pages: 1
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get("/api/admin/menu/sessions", {
          params: {
            page: currentPage,
            limit: 10
          }
        });

        setSessions(response.data.sessions || []);
        setPagination({
          total: response.data.total || 0,
          page: response.data.currentPage || 1,
          pages: response.data.totalPages || 1
        });
      } catch (err: any) {
        console.error("Error fetching sessions:", err);
        setError(err.response?.data?.error || "Failed to fetch session history");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [isAuthenticated, router, currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Session History</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <DataTable
            columns={[
              { key: "createdAt", label: "Login Time" },
              { key: "ipAddress", label: "IP Address" },
              { key: "userAgent", label: "User Agent" }
            ]}
            data={sessions}
            loading={loading}
          />

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
            <div className="flex justify-between w-full">
              <div className="text-sm text-gray-700">
                Page {pagination.page} of {pagination.pages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === pagination.pages}
                  className="px-3 py-1 border rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 