"use client";

import { useState } from "react";
import { DateFilter } from "@/components/ui/DateFilter";

interface ReportFiltersProps {
  onFilter: (filters: any) => void;
  onExport: (type: "pdf" | "xlsx") => void;
}

export function ReportFilters({ onFilter, onExport }: ReportFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilter({ search: value });
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by name, date..."
            className="w-full px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onExport("pdf")}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Export PDF
          </button>
          <button
            onClick={() => onExport("xlsx")}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Export Excel
          </button>
        </div>
      </div>

      <DateFilter
        onFilterChange={(dateRange) => {
          onFilter({ range: dateRange });
        }}
      />
    </div>
  );
} 