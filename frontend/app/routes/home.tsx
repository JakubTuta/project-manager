import Bentogrid from "@/components/shadcn-space/bentogrid";
import { useProjectsStore } from "@/stores/projects";

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
          <p>No projects found</p>
        )}

        {projects.length > 0 && <Bentogrid />}
      </section>
    </div>
  );
}
