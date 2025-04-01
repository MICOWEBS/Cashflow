"use client";

import { useState, useEffect } from "react";
import { FormInput } from "@/components/ui/FormInput";
import { FormTextarea } from "@/components/ui/FormTextarea";
import api from "@/lib/api";

interface TransactionFormProps {
  type: "sale" | "payment";
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

interface Customer {
  id: number;
  name: string;
}

interface Vendor {
  id: number;
  name: string;
}

export function TransactionForm({ 
  type, 
  onSubmit, 
  loading
}: TransactionFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [formData, setFormData] = useState({
    customerId: "",
    vendorId: "",
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMode: "Cash",
    remarks: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (type === "sale") {
          const response = await api.get("/api/customers/customers");
          setCustomers(response.data);
        } else {
          const response = await api.get("/api/vendors/vendors");
          setVendors(response.data);
        }
      } catch (error) {
        console.error(`Failed to fetch ${type === "sale" ? "customers" : "vendors"}:`, error);
      }
    };

    fetchData();
  }, [type]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      {/* Customer/Vendor Name Dropdown */}
      <div>
        <label htmlFor={type === "sale" ? "customerId" : "vendorId"} className="block text-sm font-medium text-gray-700 mb-1">
          {type === "sale" ? "Customer Name" : "Vendor Name"}
        </label>
        <select
          id={type === "sale" ? "customerId" : "vendorId"}
          name={type === "sale" ? "customerId" : "vendorId"}
          value={type === "sale" ? formData.customerId : formData.vendorId}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a {type === "sale" ? "customer" : "vendor"}</option>
          {type === "sale" 
            ? customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))
            : vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))
          }
        </select>
      </div>

      {/* Amount */}
      <FormInput
        label="Amount"
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        required
        min="0"
        step="0.01"
      />

      {/* Payment Date */}
      <FormInput
        label="Payment Date"
        type="date"
        name="paymentDate"
        value={formData.paymentDate}
        onChange={handleChange}
        required
      />

      {/* Payment Mode */}
      <div>
        <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700 mb-1">
          Payment Mode
        </label>
        <select
          id="paymentMode"
          name="paymentMode"
          value={formData.paymentMode}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Cash">Cash</option>
          <option value="Check">Check</option>
          <option value="Credit Card">Credit Card</option>
        </select>
      </div>

      {/* Remarks */}
      <div>
        <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
          Remarks
        </label>
        <textarea
          id="remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Saving..." : `Save ${type === "sale" ? "Sale" : "Purchase"}`}
        </button>
      </div>
    </form>
  );
} 