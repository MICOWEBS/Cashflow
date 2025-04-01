"use client";

import React from 'react';
import { cn } from "@/lib/utils";

export interface DateFilterProps {
  onFilterChange: (dateRange?: string) => void;
  className?: string;
}

export function DateFilter({ onFilterChange, className }: DateFilterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(e.target.value || undefined);
  };

  return (
    <div className={cn("flex items-center", className)}>
      <select 
        onChange={handleChange}
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        defaultValue=""
      >
        <option value="">All Time</option>
        <option value="7days">Last 7 Days</option>
        <option value="14days">Last 14 Days</option>
        <option value="month">Last 30 Days</option>
        <option value="year">Last 12 Months</option>
      </select>
    </div>
  );
} 