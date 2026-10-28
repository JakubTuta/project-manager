import { useProjectsStore } from "@/stores/projects";
import { Link } from "react-router";

export default function Bentogrid() {
  const projects = useProjectsStore((state) => state.projects);

  return (
    <section>
      <div className="max-w-7xl xl:px-16 lg:px-8 px-4 mx-auto flex flex-col gap-12">
        <h2 className="text-center md:text-5xl text-3xl mx-auto font-medium">
          Manage your projects
        </h2>

        <div className="grid grid-cols-12 gap-5">
          {projects.map((project) => (
            <div
              className="lg:col-span-4 col-span-12 overflow-hidden"
              key={project.name}
            >
              <Link to={`/project/${encodeURIComponent(project.name)}`}>
                <div className="rounded-xl border border-border">
                  <div className="bg-muted rounded-t-xl py-8 px-9 relative">
                    {/* image */}
                  </div>
                  <div className="flex flex-col gap-0.5 p-8 border-t border-border">
                    <h3 className="text-xl font-medium text-foreground">
                      {project.name}
                    </h3>
                    <p className="text-base font-normal text-muted-foreground">
                      {project.path}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
