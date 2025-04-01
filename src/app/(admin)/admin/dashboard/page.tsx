"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, UserCheck, UserX } from "lucide-react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import api from "@/lib/api";
import { DataTable } from "@/components/ui/DataTable";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

interface User extends Record<string, unknown> {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isVerified: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  pages: number;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message: string;
}

interface DashboardResponse {
  stats: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
  }
}

interface UsersResponse {
  users: User[];
  pagination: PaginationData;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated } = useAdminAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
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

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, usersRes] = await Promise.all([
          api.get<DashboardResponse>("/api/admin/menu/dashboard/stats"),
          api.get<UsersResponse>("/api/admin/menu/users", {
            params: {
              page: currentPage,
              limit: 10
            }
          })
        ]);

        console.log('Dashboard stats response:', statsRes.data);
        console.log('Users response:', usersRes.data);

        // Update to use the stats property from the response
        setStats({
          totalUsers: statsRes.data?.stats?.totalUsers || 0,
          activeUsers: statsRes.data?.stats?.activeUsers || 0,
          inactiveUsers: statsRes.data?.stats?.inactiveUsers || 0
        });
        
        setUsers(usersRes.data?.users || []);
        setPagination(usersRes.data?.pagination || {
          total: 0,
          page: 1,
          pages: 1
        });
      } catch (err) {
        const error = err as ApiError;
        console.error("Error fetching dashboard data:", error);
        setError(error.response?.data?.error || error.message || "Failed to fetch dashboard data");
        
        // Set default values on error
        setStats({
          totalUsers: 0,
          activeUsers: 0,
          inactiveUsers: 0
        });
        setUsers([]);
        setPagination({
          total: 0,
          page: 1,
          pages: 1
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, router, currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
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
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
          <div className="text-sm text-gray-500 mt-2">
            Total registered users in the system
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
            <UserCheck className="h-4 w-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
          <div className="text-sm text-gray-500 mt-2">
            Users with active accounts
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Inactive Users</h3>
            <UserX className="h-4 w-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold">{stats?.inactiveUsers || 0}</div>
          <div className="text-sm text-gray-500 mt-2">
            Users with inactive or suspended accounts
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Recent Users</h2>
        </div>
        <div className="p-6">
          <DataTable<User>
            columns={[
              { key: "firstName", label: "First Name" },
              { key: "lastName", label: "Last Name" },
              { key: "email", label: "Email" },
              { key: "phone", label: "Phone" },
              { 
                key: "status", 
                label: "Status",
                render: (value) => (
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    value === 'active' ? 'bg-green-100 text-green-800' : 
                    value === 'inactive' ? 'bg-red-100 text-red-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {String(value).toUpperCase()}
                  </span>
                )
              },
              { 
                key: "isVerified", 
                label: "Verified",
                render: (value) => (
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {value ? 'YES' : 'NO'}
                  </span>
                )
              },
              { 
                key: "createdAt", 
                label: "Created At",
                render: (value) => new Date(value as string).toLocaleDateString()
              }
            ]}
            data={users}
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