import { create } from "zustand";
import type { Project } from "../types/project";
import { useApiStore } from "./api";

interface ProjectsState {
  // fetch projects
  projects: Project[];
  isLoadingProjects: boolean;
  errorProjects: string | null;
  fetchProjects: () => Promise<void>;

  // fetch project
  isLoadingProject: boolean;
  errorProject: string | null;
  selectedProject: Project | null;
  fetchProject: (name: string) => Promise<void>;

  // create project
  isLoadingCreateProject: boolean;
  errorCreatingProject: string | null;
  createProject: (name: string, path: string) => Promise<Project | undefined>;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  isLoadingProjects: false,
  errorProjects: null,
  isLoadingProject: false,
  errorProject: null,
  selectedProject: null,
  isLoadingCreateProject: false,
  errorCreatingProject: null,

  fetchProjects: async () => {
    if (get().isLoadingProjects) return;

    set({ isLoadingProjects: true, errorProjects: null });

    try {
      const { call } = useApiStore.getState();
      const response = await call("/api/projects");

      if (response.data.success) set({ projects: response.data.data });
      else if (response.data.error)
        set({ errorProjects: response.data.error.message });
    } catch (error) {
      set({
        errorProjects:
          error instanceof Error ? error.message : "Failed to fetch projects",
      });
    } finally {
      set({ isLoadingProjects: false });
    }
  },

  fetchProject: async (name: string) => {
    if (get().isLoadingProject) return;

    set({ isLoadingProject: true, errorProject: null });

    try {
      const { call } = useApiStore.getState();
      const response = await call(`/api/projects/${name}`, "GET", {
        name: name,
      });

      if (response.data.success) set({ selectedProject: response.data.data });
      else if (response.data.error)
        set({ errorProject: response.data.error.message });
    } catch (error) {
      set({
        errorProject:
          error instanceof Error ? error.message : "Failed to fetch project",
      });
    } finally {
      set({ isLoadingProject: false });
    }
  },

  createProject: async (name: string, path: string) => {
    if (get().isLoadingCreateProject) return;

    set({ isLoadingCreateProject: true, errorCreatingProject: null });

    try {
      const { call } = useApiStore.getState();
      const response = await call("/api/projects", "POST", { name, path });

      if (response.data.success) {
        const project = response.data.data as Project;
        set({ projects: [project, ...get().projects] });
        return project;
      } else if (response.data.error)
        set({ errorCreatingProject: response.data.error.message });
    } catch (error) {
      set({
        errorCreatingProject:
          error instanceof Error ? error.message : "Failed to create project",
      });
    } finally {
      set({ isLoadingCreateProject: false });
    }
  },
}));
