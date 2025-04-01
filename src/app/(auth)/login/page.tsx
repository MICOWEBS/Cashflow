"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { ApiError } from "@/types/api";

export default function Login() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      login(response.data.user);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      router.push("/dashboard");
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 403) {
        setError("Email not verified. Please verify your email to continue.");
      } else if (apiError.status === 401) {
        setError("Invalid email or password");
      } else {
        setError(apiError.error || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const email = (document.getElementById("email") as HTMLInputElement).value;
      await api.post("/api/auth/resend-verification", { email });
      alert("Verification email sent successfully!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend verification email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Welcome Back!
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md border border-red-300">
            {error}
            {error.includes("not verified") && (
              <button
                onClick={handleResendVerification}
                className="ml-2 text-blue-600 hover:underline"
              >
                Resend verification email
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}