"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import BreadcrumbDropdown from "./breadcrumb-dropdown";

export type NavigationSection = {
  title: string;
  href: string;
};

const navigationData: NavigationSection[] = [
  {
    title: "About us",
    href: "#",
  },
  {
    title: "Services",
    href: "#",
  },
  {
    title: "Work",
    href: "#",
  },
  {
    title: "Team",
    href: "#",
  },
  {
    title: "Pricing",
    href: "#",
  },
  {
    title: "Awards",
    href: "#",
  },
];

const CreateProjectButton = () => (
  <Button
    className={cn(
      "relative text-sm font-medium rounded-full h-10 p-1 ps-4 pe-12 group w-fit overflow-hidden hover:bg-primary/80 hover:cursor-pointer",
    )}
  >
    <span className="relative z-10">Create new Project</span>
    <div className="absolute right-1 w-8 h-8 bg-background text-foreground rounded-full flex items-center justify-center">
      <Plus size={16} />
    </div>
  </Button>
);

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

            <CreateProjectButton />
          </nav>
        </div>
      </header>
    </div>
  );
}
