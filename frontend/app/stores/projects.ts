import { create } from "zustand";
import { useApiStore } from "./api";
import { type Project } from "../types/project";

interface ProjectsState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const { call } = useApiStore.getState();
      const response = await call("/api/projects");

      if (response.data.success) set({ projects: response.data.data });
      else if (response.data.error) set({ error: response.data.error.message });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch projects",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
