"use client";

import { useState } from "react";
import { FormInput } from "@/components/ui/FormInput";
import api from "@/lib/api";
import Link from "next/link";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");

    try {
      await api.post("/api/auth/forgot-password", { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Forgot Password
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md border border-red-300">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">
              Password reset instructions have been sent to your email.
            </p>
            <Link href="/login" className="text-blue-600 hover:underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Email"
              type="email"
              name="email"
              required
              autoComplete="email"
              className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}