"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { FormModal } from "@/components/ui/FormModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import api from "@/lib/api";
import { ApiError } from "@/types/api";

interface FormData {
  [key: string]: string | number | boolean | null;
}

interface Customer extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  address: string;
}

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "companyName", label: "Company Name" },
  { key: "address", label: "Address" },
];

const formFields = [
  { 
    name: "name", 
    label: "Name", 
    type: "text", 
    required: true,
    placeholder: "Enter customer's full name"
  },
  { 
    name: "email", 
    label: "Email", 
    type: "email", 
    required: true,
    placeholder: "Enter customer's email address"
  },
  { 
    name: "phone", 
    label: "Phone", 
    type: "tel", 
    required: true,
    placeholder: "Enter customer's phone number"
  },
  { 
    name: "companyName", 
    label: "Company Name", 
    type: "text", 
    required: true,
    placeholder: "Enter company name"
  },
  { 
    name: "address", 
    label: "Address", 
    type: "text", 
    required: true,
    placeholder: "Enter customer's address"
  }
];

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get<{ customers: Customer[]; totalPages: number }>(
        `/api/customers?page=${currentPage}`
      );
      setCustomers(response.data.customers);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      const formattedData = {
        name: String(data.name || ""),
        email: String(data.email || ""),
        phone: String(data.phone || ""),
        companyName: String(data.companyName || ""),
        address: String(data.address || "")
      };

      if (editingCustomer) {
        await api.put(`/api/customers/${editingCustomer.id}`, formattedData);
        setSuccess("Customer updated successfully");
      } else {
        await api.post("/api/customers", formattedData);
        setSuccess("Customer added successfully");
      }

      setIsModalOpen(false);
      setEditingCustomer(null);
      fetchCustomers();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || "Failed to save customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (customer: Customer) => {
    try {
      setError("");
      await api.delete(`/api/customers/${customer.id}`);
      setSuccess("Customer deleted successfully");
      setDeleteCustomer(null);
      fetchCustomers();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || "Failed to delete customer");
    }
  };

  const confirmDelete = () => {
    if (deleteCustomer) {
      handleDelete(deleteCustomer);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        <button
          onClick={() => {
            setEditingCustomer(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Customer
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={customers}
          loading={loading}
          onEdit={(customer) => {
            setEditingCustomer(customer);
            setIsModalOpen(true);
          }}
          onDelete={(customer) => setDeleteCustomer(customer)}
        />

        {/* Pagination */}
        {!loading && customers.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCustomer(null);
          setError("");
          setSuccess("");
        }}
        onSubmit={handleSubmit}
        title={editingCustomer ? "Edit Customer" : "Add Customer"}
        isSubmitting={isSubmitting}
      >
        {formFields.map((field) => (
          <div key={field.name} className="mb-4">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              id={field.name}
              required={field.required}
              placeholder={field.placeholder}
              defaultValue={String(editingCustomer?.[field.name as keyof Customer] || "")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
        ))}
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteCustomer}
        onClose={() => setDeleteCustomer(null)}
        onConfirm={confirmDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete ${deleteCustomer?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
} 