"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { FormModal } from "@/components/ui/FormModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import api from "@/lib/api";
import { ApiError } from "@/types/api";

const columns = [
  { key: "name", label: "Name" },
  { key: "companyName", label: "Company Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address" },
];

const formFields = [
  { 
    name: "name", 
    label: "Name", 
    type: "text", 
    required: true,
    placeholder: "Enter vendor's full name"
  },
  { 
    name: "companyName", 
    label: "Company Name", 
    type: "text", 
    required: true,
    placeholder: "Enter company name"
  },
  { 
    name: "email", 
    label: "Email", 
    type: "email", 
    required: true,
    placeholder: "Enter vendor's email address"
  },
  { 
    name: "phone", 
    label: "Phone", 
    type: "tel", 
    required: true,
    placeholder: "Enter vendor's phone number"
  },
  { 
    name: "address", 
    label: "Address", 
    type: "text", 
    required: true,
    placeholder: "Enter vendor's address"
  },
];

interface FormData {
  [key: string]: string | number | boolean | null;
}

interface Vendor extends Record<string, unknown> {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
}

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteVendor, setDeleteVendor] = useState<Vendor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/vendors");
      setVendors(response.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || "Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const handleSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      // Log the data being sent
      console.log('Submitting vendor data:', data);

      // Validate required fields
      const requiredFields = ["name", "companyName", "email", "phone", "address"];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(", ")}`);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(data.email))) {
        setError("Please enter a valid email address");
        return;
      }

      // Format the data before sending
      const formattedData = {
        name: String(data.name || "").trim(),
        companyName: String(data.companyName || "").trim(),
        email: String(data.email || "").trim().toLowerCase(),
        phone: String(data.phone || "").trim(),
        address: String(data.address || "").trim()
      };

      if (editingVendor) {
        console.log('Updating vendor:', editingVendor.id, formattedData);
        await api.put(`/api/vendors/${editingVendor.id}`, formattedData);
        setSuccess("Vendor updated successfully");
      } else {
        console.log('Creating new vendor:', formattedData);
        await api.post("/api/vendors", formattedData);
        setSuccess("Vendor created successfully");
      }
      
      await fetchVendors();
      setIsModalOpen(false);
      setEditingVendor(null);
    } catch (err) {
      console.error('Error details:', err);
      const apiError = err as ApiError;
      setError(apiError.error || "Failed to save vendor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (vendor: Vendor) => {
    setDeleteVendor(vendor);
  };

  const confirmDelete = async () => {
    if (!deleteVendor) return;

    try {
      setLoading(true);
      await api.delete(`/api/vendors/${deleteVendor.id}`);
      setSuccess("Vendor deleted successfully");
      await fetchVendors();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || "Failed to delete vendor");
    } finally {
      setLoading(false);
      setDeleteVendor(null);
    }
  };

  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastVendor = currentPage * itemsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - itemsPerPage;
  const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Vendors</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your vendor information and details
            </p>
          </div>
          <button
            onClick={() => {
              setEditingVendor(null);
              setError("");
              setSuccess("");
              setIsModalOpen(true);
            }}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Vendor
          </button>
        </div>

        {/* Search and Stats Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="text-sm text-gray-500">
            {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Messages Section */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 text-green-700 rounded-md flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {success}
          </div>
        )}

        {/* Data Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div className="text-gray-500">Loading vendors...</div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <DataTable
              columns={columns}
              data={currentVendors}
              onEdit={(vendor) => {
                setEditingVendor(vendor);
                setError("");
                setSuccess("");
                setIsModalOpen(true);
              }}
              onDelete={handleDelete}
            />
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
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
                        Showing <span className="font-medium">{indexOfFirstVendor + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(indexOfLastVendor, filteredVendors.length)}
                        </span>{' '}
                        of <span className="font-medium">{filteredVendors.length}</span> results
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
                        {[...Array(totalPages)].map((_, index) => (
                          <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === index + 1
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}
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
        )}
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingVendor(null);
          setError("");
          setSuccess("");
        }}
        onSubmit={handleSubmit}
        title={editingVendor ? "Edit Vendor" : "Add Vendor"}
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
              defaultValue={String(editingVendor?.[field.name as keyof Vendor] || "")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
            />
          </div>
        ))}
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteVendor}
        onClose={() => setDeleteVendor(null)}
        onConfirm={confirmDelete}
        title="Delete Vendor"
        message={`Are you sure you want to delete ${deleteVendor?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
} 