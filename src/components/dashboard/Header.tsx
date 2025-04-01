"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Header() {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            <Link 
              href="/dashboard" 
              className="flex items-center text-xl font-bold text-primary"
            >
              FinanceFlow
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-4 lg:hidden"
            >
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/dashboard/analytics"
              className="text-sm text-gray-700 hover:text-primary"
            >
              Analytics
            </Link>
            <Link
              href="/dashboard/reports"
              className="text-sm text-gray-700 hover:text-primary"
            >
              Reports
            </Link>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-sm text-gray-700 hover:text-primary"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  U
                </div>
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg border">
                  <Link
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile Settings
                  </Link>
                  <Link
                    href="/dashboard/activity"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Activity Log
                  </Link>
                  <button
                    onClick={() => {
                      // Add logout logic here
                      router.push("/login");
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-2 space-y-1">
            <Link
              href="/dashboard/analytics"
              className="block px-3 py-2 text-base text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Analytics
            </Link>
            <Link
              href="/dashboard/reports"
              className="block px-3 py-2 text-base text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Reports
            </Link>
            <Link
              href="/dashboard/profile"
              className="block px-3 py-2 text-base text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Profile Settings
            </Link>
            <Link
              href="/dashboard/activity"
              className="block px-3 py-2 text-base text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Activity Log
            </Link>
            <button
              onClick={() => {
                // Add logout logic here
                router.push("/login");
              }}
              className="block w-full text-left px-3 py-2 text-base text-red-600 hover:bg-gray-100 rounded-md"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
} 