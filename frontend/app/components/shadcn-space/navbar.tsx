"use client";
import { cn } from "@/lib/utils";
import BreadcrumbDropdown from "./breadcrumb-dropdown";
import CreateProjectDialog from "./create-project-dialog";

export type NavigationSection = {
  title: string;
  href: string;
};

export default function Navbar() {
  return (
    <div>
      <header className="bg-background">
        <div className="max-w-7xl mx-auto w-full px-4 py-4">
          <nav
            className={cn(
              "w-full flex items-center h-fit justify-between gap-6 bg-transparent border-transparent",
            )}
          >
            <BreadcrumbDropdown />

            <CreateProjectDialog />
          </nav>
        </div>
      </header>
    </div>
  );
}
