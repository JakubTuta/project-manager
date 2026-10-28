import { useProjectsStore } from "@/stores/projects";
import { useEffect } from "react";
import { useParams } from "react-router";

export default function Project() {
  const { name } = useParams();
  const fetchProject = useProjectsStore((state) => state.fetchProject);
  const selectedProject = useProjectsStore((state) => state.selectedProject);
  const isLoading = useProjectsStore((state) => state.isLoading);
  const error = useProjectsStore((state) => state.error);

  if (!name) return <div>Error: empty name</div>;

  useEffect(() => {
    fetchProject(name);
  }, [fetchProject]);

  return (
    <section className="space-y-4 p-6">
      {isLoading && <p>Loading project...</p>}

      {error && <p role="alert">Error loading project: {error}</p>}

      {!isLoading && !error && !selectedProject && <p>Project not found</p>}

      {selectedProject && <div>{selectedProject.name}</div>}
    </section>
  );
}
