import { useProjectsStore } from "@/stores/projects";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FolderCode } from "lucide-react";
import ProjectsTable from "@/components/shadcn-space/projects-table";

export default function Home() {
  const { projects, isLoadingProjects, errorProjects } = useProjectsStore();

  return (
    <div>
      <section className="space-y-4 p-6">
        {isLoadingProjects && <p>Loading projects...</p>}

        {errorProjects && (
          <p role="alert">Error loading projects: {errorProjects}</p>
        )}

        {!isLoadingProjects && !errorProjects && projects.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderCode />
              </EmptyMedia>
              <EmptyTitle>No Projects Yet</EmptyTitle>
              <EmptyDescription>
                You haven't created any projects yet. Get started by creating
                your first project.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        {projects.length > 0 && <ProjectsTable />}
      </section>
    </div>
  );
}
