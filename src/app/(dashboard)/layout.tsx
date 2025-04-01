import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Hidden on mobile, shown as overlay */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white p-4 rounded-lg shadow-sm sticky top-6">
              <Sidebar />
            </div>
          </div>
          
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 