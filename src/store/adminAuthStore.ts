import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminData {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminAuthState {
  isAuthenticated: boolean;
  adminData: AdminData | null;
  login: (token: string, data: AdminData) => void;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      adminData: null,
      login: (token: string, data: AdminData) => {
        localStorage.setItem("adminToken", token);
        set({ isAuthenticated: true, adminData: data });
      },
      logout: () => {
        localStorage.removeItem("adminToken");
        set({ isAuthenticated: false, adminData: null });
      },
    }),
    {
      name: "admin-auth-storage",
    }
  )
); 