import { create } from "zustand";

/**
 * AUTH STORE
 * Manages user session and role-based access.
 * Includes rehydration logic to persist state on page refresh.
 */
export const useAuthStore = create((set) => ({
  // 1. Initial State: Pull from localStorage to handle page refreshes
  userRole: localStorage.getItem("role") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),

  /**
   * LOGIN
   * Saves credentials to storage and updates memory state.
   */
  login: (role, accessToken, refreshToken) => {
    // Save to storage to persist across refreshes
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("role", role);

    set({
      userRole: role,
      isAuthenticated: true,
    });

    return {
      role: role,
      message: "Login successful",
    };
  },

  /**
   * LOGOUT
   * Clears all storage and resets state.
   */
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");

    set({
      userRole: null,
      isAuthenticated: false,
    });
  },

  /**
   * REHYDRATE (Optional Helper)
   * Manually force a sync with localStorage if needed.
   */
  checkAuth: () => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("accessToken");

    set({
      userRole: role || null,
      isAuthenticated: !!token,
    });
  },
}));
