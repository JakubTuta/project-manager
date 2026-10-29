import { useProjectsStore } from "@/stores/projects";
import { useEffect } from "react";
import { useParams } from "react-router";

export default function Project() {
  const { name } = useParams();
  const { fetchProject, selectedProject, isLoadingProjects, errorProjects } =
    useProjectsStore();

  if (!name) return <div>Error: empty name</div>;

  useEffect(() => {
    fetchProject(name);
  }, [fetchProject]);

  return (
    <section className="space-y-4 p-6">
      {isLoadingProjects && <p>Loading project...</p>}

      {errorProjects && (
        <p role="alert">Error loading project: {errorProjects}</p>
      )}

      {!isLoadingProjects && !errorProjects && !selectedProject && (
        <p>Project not found</p>
      )}

      {selectedProject && <div>{selectedProject.name}</div>}
    </section>
  );
}
