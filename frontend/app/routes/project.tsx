import { useProjectsStore } from "@/stores/projects";
import { useEffect } from "react";
import { useParams } from "react-router";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FolderCode } from "lucide-react";
import { useCommandsStore } from "@/stores/commands";
import CommandsTable from "@/components/shadcn-space/commands-table";

export default function Project() {
  const { name } = useParams();
  const { fetchProject, selectedProject, isLoadingProjects, errorProjects } =
    useProjectsStore();
  const { fetchCommands } = useCommandsStore();

  if (!name) return <div>Error: empty name</div>;

  useEffect(() => {
    fetchProject(name);
    fetchCommands(name);
  }, [fetchProject]);

  return (
    <section className="space-y-4 p-6">
      {isLoadingProjects && <p>Loading project...</p>}

      {errorProjects && (
        <p role="alert">Error loading project: {errorProjects}</p>
      )}

      {!isLoadingProjects && !errorProjects && !selectedProject && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderCode />
            </EmptyMedia>
            <EmptyTitle>Project not found</EmptyTitle>
            <EmptyDescription>
              Project with that name doesn't exist. Choose one from the list on
              Home page.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      <CommandsTable projectName={name} />
    </section>
  );
}
