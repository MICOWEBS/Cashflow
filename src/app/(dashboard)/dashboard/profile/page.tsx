"use client";

import { useState, useEffect } from "react";
import { FormInput } from "@/components/ui/FormInput";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import Image from "next/image";

export default function Profile() {
  const router = useRouter();
  const { user, login, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user?.image || null);
  const [activeTab, setActiveTab] = useState('personal');
  const [emailVerificationOTP, setEmailVerificationOTP] = useState("");
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  // Fetch latest user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/api/user/profile");
        const userData = response.data;
        login(userData); // Update stored user data
        setImagePreview(userData.image || null);
      } catch (err: any) {
        if (err.response?.status === 401) {
          // Handle unauthorized access
          logout();
          router.push("/login");
        } else {
          setError(err.response?.data?.message || "Failed to load user data");
        }
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user, login, logout, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setEmailVerificationSent(false);

    const formData = new FormData(e.currentTarget);
    
    try {
      // Handle image upload if there's a new image
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);
        await api.post("/api/user/profile/image", imageFormData);
      }

      // Update profile details
      const data = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        phone: formData.get("phone"),
      };

      const response = await api.put("/api/user/profile", data);
      const updatedUser = response.data;
      login(updatedUser);
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      if (err.response?.status === 401) {
        logout();
        router.push("/login");
      } else {
        setError(err.response?.data?.error || "Failed to update profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const newEmail = formData.get("email");
    const currentPassword = formData.get("currentPassword");

    try {
      await api.post("/api/user/profile/email", {
        newEmail,
        currentPassword,
      });
      
      setPendingEmail(newEmail as string);
      setShowEmailVerification(true);
      setSuccess("Verification code sent to your new email address");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to initiate email change");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/api/user/profile/verify-email", {
        otp: emailVerificationOTP,
      });
      
      const updatedUser = response.data;
      login(updatedUser);
      setShowEmailVerification(false);
      setSuccess("Email updated successfully!");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to verify email change");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      // Call the logout endpoint
      await api.post("/api/auth/logout");
      
      // Clear all local storage
      localStorage.clear();
      
      // Clear session storage
      sessionStorage.clear();
      
      // Reset auth store
      logout();
      
      // Clear any pending requests
      api.defaults.headers.common['Authorization'] = '';
      
      // Redirect to login page
      router.push("/login");
    } catch (err: any) {
      // Even if the API call fails, we should still clear local data
      localStorage.clear();
      sessionStorage.clear();
      logout();
      api.defaults.headers.common['Authorization'] = '';
      router.push("/login");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const data = {
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    };

    try {
      await api.put("/api/user/password", data);
      setSuccess("Password updated successfully!");
      e.currentTarget.reset();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
          {success}
          {emailVerificationSent && (
            <p className="mt-2 text-sm">
              Please check your email to verify your new email address.
            </p>
          )}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Profile settings">
          {['personal', 'security', 'preferences'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Content */}
      <div className="space-y-6">
        {activeTab === 'personal' && (
          <div className="space-y-6">
            {/* Profile Image Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gray-50 rounded-lg">
              <div className="relative">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-500 text-2xl">
                      {user?.firstName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Profile Photo</h3>
                <p className="text-sm text-gray-500">
                  JPG, GIF or PNG. Max size of 2MB.
                </p>
              </div>
            </div>

            {/* Personal Information Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormInput
                  label="First Name"
                  name="firstName"
                  required
                  defaultValue={user?.firstName}
                />
                <FormInput
                  label="Last Name"
                  name="lastName"
                  required
                  defaultValue={user?.lastName}
                />
                <FormInput
                  label="Phone"
                  type="tel"
                  name="phone"
                  defaultValue={user?.phone}
                  className="sm:col-span-2"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>

            {/* Email Change Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Change Email</h3>
              {!showEmailVerification ? (
                <form onSubmit={handleEmailChange} className="space-y-4">
                  <FormInput
                    label="New Email"
                    type="email"
                    name="email"
                    required
                    defaultValue={user?.email}
                  />
                  <FormInput
                    label="Current Password"
                    type="password"
                    name="currentPassword"
                    required
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? "Sending..." : "Change Email"}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleEmailVerification} className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Enter the verification code sent to {pendingEmail}
                  </p>
                  <FormInput
                    label="Verification Code"
                    type="text"
                    value={emailVerificationOTP}
                    onChange={(e) => setEmailVerificationOTP(e.target.value)}
                    required
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? "Verifying..." : "Verify Email"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <FormInput
                  label="Current Password"
                  type="password"
                  name="currentPassword"
                  required
                />
                <FormInput
                  label="New Password"
                  type="password"
                  name="newPassword"
                  required
                />
                <FormInput
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  required
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
              {/* Add 2FA setup/management here */}
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
              {/* Add notification preferences here */}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Display</h3>
              {/* Add display preferences here */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 