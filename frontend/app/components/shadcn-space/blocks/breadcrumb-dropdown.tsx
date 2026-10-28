import { ChevronDownIcon, HomeIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useProjectsStore } from "@/stores/projects";
import { Link } from "react-router";

export default function BreadcrumbDropdown() {
  const projects = useProjectsStore((state) => state.projects);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link to="/home" />}>
            <Button variant="ghost" className="text-foreground rounded-full">
              <HomeIcon className="size-5" />
              <span className="text-xl">Home</span>
            </Button>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator className="mr-2" />

        <BreadcrumbItem>
          <BreadcrumbPage>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer">
                <span className="text-xl">Projects</span>
                <ChevronDownIcon className="size-5" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start">
                {projects.map((project) => (
                  <Link
                    to={`/project/${encodeURIComponent(project.name)}`}
                    key={project.name}
                  >
                    <DropdownMenuItem className="cursor-pointer">
                      <span className="text-lg">{project.name}</span>
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
