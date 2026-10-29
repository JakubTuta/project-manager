import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "cn";
import { Plus } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useProjectsStore } from "@/stores/projects";

const CreateProjectButton = ({
  className,
  ...props
}: ComponentProps<typeof Button>) => (
  <Button
    {...props}
    className={cn(
      "relative text-sm font-medium rounded-full h-10 p-1 ps-4 pe-12 group w-fit overflow-hidden hover:bg-primary/80 hover:cursor-pointer",
      className,
    )}
  >
    Create new Project
    <div className="absolute right-1 w-8 h-8 bg-background text-foreground rounded-full flex items-center justify-center">
      <Plus size={16} />
    </div>
  </Button>
);

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Project name must not be empty")
    .max(100, "Project name cannot be over 100 characters long"),
  path: z
    .string()
    .min(1, "Project path must not be empty")
    .max(100, "Project path cannot be over 100 characters long"),
});

export default function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const createProject = useProjectsStore((state) => state.createProject);
  const isLoadingCreateProject = useProjectsStore(
    (state) => state.isLoadingCreateProject,
  );
  const errorCreatingProject = useProjectsStore(
    (state) => state.errorCreatingProject,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      path: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const project = await createProject(data.name, data.path);
    if (!project) return;

    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<CreateProjectButton />} />

      <DialogContent
        className="sm:max-w-lg data-open:zoom-in-50! data-closed:zoom-out-50 duration-300 [[data-slot=dialog-overlay]:has(~_&)]:duration-300"
        showCloseButton={false}
      >
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <DialogHeader className="items-center">
            <DialogTitle className="text-lg">Create new project</DialogTitle>
            <DialogDescription>
              Enter a name and a path for the new project.
            </DialogDescription>
          </DialogHeader>

          <form
            className="flex w-full flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-project-name">
                      Project name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="create-project-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="My project"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="path"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-project-path">
                      Enter project root path
                    </FieldLabel>

                    <Input
                      {...field}
                      id="create-project-path"
                      aria-invalid={fieldState.invalid}
                      placeholder="C:\Users\...\Projects\my_project"
                      autoComplete="off"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {errorCreatingProject && (
              <div className="flex justify-center">
                <p className="text-left text-destructive" role="alert">
                  {errorCreatingProject}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoadingCreateProject}
              className="cursor-pointer hover:bg-primary/80"
            >
              {isLoadingCreateProject ? "Creating..." : "Create project"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
