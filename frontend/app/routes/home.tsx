import Bentogrid from "@/components/shadcn-space/blocks/bento-grid-01/bentogrid";
import { useProjectsStore } from "@/stores/projects";
import { useEffect } from "react";

export default function Home() {
  const projects = useProjectsStore((state) => state.projects);
  const isLoading = useProjectsStore((state) => state.isLoading);
  const error = useProjectsStore((state) => state.error);

  return (
    <div>
      <section className="space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Projects</h1>

        {isLoading && <p>Loading projects...</p>}

        {error && <p role="alert">Could not load projects: {error}</p>}

        {!isLoading && !error && projects.length === 0 && (
          <p>No tables found.</p>
        )}

        {projects.length > 0 && (
          <ul className="list-inside list-disc space-y-2">
            {projects.map((project) => (
              <li key={project.name}>{project.name}</li>
            ))}
          </ul>
        )}
      </section>
      <Bentogrid />
    </div>
  );
}
