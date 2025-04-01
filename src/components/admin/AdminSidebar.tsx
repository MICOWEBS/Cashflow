"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ mobile, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "Sessions", href: "/admin/sessions", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { name: "Profile", href: "/admin/profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        {mobile && (
          <div className="flex items-center flex-shrink-0 px-4">
            <span className="text-xl font-bold text-blue-600">Admin Panel</span>
          </div>
        )}

        <nav className="mt-5 flex-1 space-y-1 px-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={mobile ? onClose : undefined}
              className={cn(
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all",
                isActive(item.href)
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <svg
                className={cn(
                  "mr-3 h-6 w-6",
                  isActive(item.href) ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
