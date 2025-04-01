"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // List of auth routes that should not show the admin layout
  const authRoutes = ['/login', '/forgot-password', '/reset-password'];
  const isAuthRoute = authRoutes.some(route => pathname?.includes(route));

  // If it's an auth route, render children without admin layout
  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        {/* Mobile sidebar */}
        <div
          className={`fixed inset-0 z-40 lg:hidden ${
            sidebarOpen ? "block" : "hidden"
          }`}
        >
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar component */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <AdminSidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64">
            <AdminSidebar />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 