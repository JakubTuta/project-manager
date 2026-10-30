export type commandLabels = "build" | "run" | "stop";

export interface Command {
  id: number;
  project_name: string;
  label: commandLabels;
  command: string;
}
