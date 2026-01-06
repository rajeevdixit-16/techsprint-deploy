import { create } from "zustand";

/**
 * APP STORE
 * Manages global navigation, issue context, and spatial data.
 */
export const useAppStore = create((set) => ({
  // Navigation state: tracks which screen is currently rendered
  currentScreen: "landing",

  // Selected issue for authority detail view or authority dashboard
  selectedIssue: null,

  // Holds { lat, lng } captured for ward assignment
  selectedLocation: null,

  // 🆕 Persisted image preview (for UI only)
  reportImage: null,

  // 🆕 Persisted actual File object (for backend upload)
  reportFile: null,

  // Dynamic address for Header
  currentAddress: "Detecting Location...",

  /**
   * Navigate to a screen with an optional data payload.
   */
  navigate: (screen, data = null) =>
    set((state) => ({
      currentScreen: screen,
      selectedLocation: data !== null ? data : state.selectedLocation,
    })),

  /**
   * Update human-readable address
   */
  setCurrentAddress: (address) =>
    set({
      currentAddress: address,
    }),

  /**
   * Switch to the issue detail screen
   */
  viewIssue: (issue) =>
    set({
      selectedIssue: issue,
      currentScreen: "issue-detail",
    }),

  /**
   * Reset selected issue
   */
  clearSelectedIssue: () =>
    set({
      selectedIssue: null,
    }),

  /**
   * Location handlers
   */
  setSelectedLocation: (location) =>
    set({
      selectedLocation: location,
    }),

  clearSelectedLocation: () =>
    set({
      selectedLocation: null,
      currentAddress: "Prayagraj, Uttar Pradesh",
    }),

  /**
   * 🆕 Report image (preview)
   */
  setReportImage: (image) =>
    set({
      reportImage: image,
    }),

  clearReportImage: () =>
    set({
      reportImage: null,
    }),

  /**
   * 🆕 Report file (actual File object)
   */
  setReportFile: (file) =>
    set({
      reportFile: file,
    }),

  clearReportFile: () =>
    set({
      reportFile: null,
    }),

  /**
   * Reset full report context (after submit / cancel)
   */
  clearReportContext: () =>
    set({
      selectedLocation: null,
      reportImage: null,
      reportFile: null,
      editingIssue: null,
      currentAddress: "Prayagraj, Uttar Pradesh",
    }),
}));
