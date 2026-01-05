import { create } from "zustand";

export const useAppStore = create((set) => ({
  // Navigation state: tracks which screen is currently rendered
  currentScreen: "landing",

  // Selected issue for authority detail view or authority dashboard
  selectedIssue: null,

  // PERSISTENT LOCATION: Holds {lat, lng} captured for ward assignment
  selectedLocation: null,

  /**
   * Navigate to a screen with an optional data payload.
   * Updates the selectedLocation if data is provided (e.g., from MapView).
   * Preserves existing location if data is null (e.g., moving between steps in ReportIssue).
   */
  navigate: (screen, data = null) =>
    set((state) => ({
      currentScreen: screen,
      // Logic ensures coordinates aren't lost when moving between form steps
      selectedLocation: data !== null ? data : state.selectedLocation,
    })),

  /**
   * Switch to the issue detail screen and set the context for the specific issue
   */
  viewIssue: (issue) =>
    set({
      selectedIssue: issue,
      currentScreen: "issue-detail",
    }),

  /**
   * Resets the selected issue context
   */
  clearSelectedIssue: () =>
    set({
      selectedIssue: null,
    }),

  /**
   * Resets the location data.
   * Call this after a successful report submission.
   */
  clearSelectedLocation: () =>
    set({
      selectedLocation: null,
    }),

  /**
   * Manual update for location (e.g., using "Current Location" button in ReportIssue)
   */
  setSelectedLocation: (location) =>
    set({
      selectedLocation: location,
    }),
}));
