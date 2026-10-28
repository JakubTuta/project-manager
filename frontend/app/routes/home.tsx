import Bentogrid from "@/components/shadcn-space/blocks/bentogrid";
import { useProjectsStore } from "@/stores/projects";

export default function Home() {
  const projects = useProjectsStore((state) => state.projects);
  const isLoading = useProjectsStore((state) => state.isLoading);
  const error = useProjectsStore((state) => state.error);

  return (
    <div>
      <section className="space-y-4 p-6">
        {isLoading && <p>Loading projects...</p>}

        {error && <p role="alert">Error loading projects: {error}</p>}

        {!isLoading && !error && projects.length === 0 && (
          <p>No projects found</p>
        )}

        {projects.length > 0 && <Bentogrid />}
      </section>
    </div>
  );
}
