import { create } from "zustand";
import { useApiStore } from "./api";
import type { Command, commandLabels } from "@/types/command";

interface CommandsState {
  // create command
  isLoadingCreateCommand: boolean;
  errorCreateCommand: string | null;
  createCommand: (
    projectName: string,
    label: commandLabels,
    command: string,
  ) => Promise<Command | undefined>;

  // fetch commands
  isLoadingFetchCommands: boolean;
  errorFetchCommands: string | null;
  commands: Command[];
  fetchCommands: (projectName: string) => Promise<void>;
}

export const useCommandsStore = create<CommandsState>((set, get) => ({
  isLoadingCreateCommand: false,
  errorCreateCommand: null,
  isLoadingFetchCommands: false,
  errorFetchCommands: null,
  commands: [],

  createCommand: async (
    projectName: string,
    label: commandLabels,
    command: string,
  ) => {
    if (get().isLoadingCreateCommand) return;

    set({ isLoadingCreateCommand: true, errorCreateCommand: null });

    try {
      const { call } = useApiStore.getState();
      const response = await call("/api/commands", "POST", {
        project_name: projectName,
        label,
        command,
      });

      if (response.data.success) {
        const command = response.data.data;
        set({ commands: [command, ...get().commands] });
        return command;
      } else if (response.data.error)
        set({ errorCreateCommand: response.data.error.message });
    } catch (error) {
      set({
        errorCreateCommand:
          error instanceof Error ? error.message : "Failed to create command",
      });
    } finally {
      set({ isLoadingCreateCommand: false });
    }
  },

  fetchCommands: async (projectName: string) => {
    if (get().isLoadingFetchCommands) return;

    set({ isLoadingFetchCommands: true, errorFetchCommands: null });

    try {
      const { call } = useApiStore.getState();
      const response = await call(`/api/commands/${projectName}`);

      if (response.data.success) set({ commands: response.data.data });
      else if (response.data.error)
        set({ errorFetchCommands: response.data.error.message });
    } catch (error) {
      set({
        errorFetchCommands:
          error instanceof Error ? error.message : "Failed to fetch commands",
      });
    } finally {
      set({ isLoadingFetchCommands: false });
    }
  },
}));
