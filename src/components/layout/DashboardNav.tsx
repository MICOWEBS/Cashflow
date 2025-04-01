import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Sales", href: "/dashboard/sales" },
  { name: "Purchases", href: "/dashboard/purchases" },
  { name: "Customers", href: "/dashboard/customers" },
  { name: "Vendors", href: "/dashboard/vendors" },
  { name: "Reports", href: "/dashboard/reports" },
  { name: "Activity Log", href: "/dashboard/activity" },
  { name: "Sessions", href: "/dashboard/sessions" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
            pathname === item.href
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
} 