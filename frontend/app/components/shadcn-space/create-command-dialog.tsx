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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCommandsStore } from "@/stores/commands";
import type { commandLabels } from "@/types/command";

const CreateCommandButton = ({
  className,
  ...props
}: ComponentProps<typeof Button>) => (
  <div className="flex items-center justify-end mb-4">
    <Button
      {...props}
      className={cn(
        "relative text-sm font-medium rounded-full h-10 p-1 ps-4 pe-12 group w-fit overflow-hidden hover:bg-primary/80 hover:cursor-pointer",
        className,
      )}
    >
      Add new Command
      <div className="absolute right-1 w-8 h-8 bg-background text-foreground rounded-full flex items-center justify-center">
        <Plus size={16} />
      </div>
    </Button>
  </div>
);

const labelItems = [
  { label: "Build", value: "build" },
  { label: "Run", value: "run" },
  { label: "Stop", value: "stop" },
] satisfies { label: string; value: commandLabels }[];

const formSchema = z.object({
  label: z
    .string()
    .refine(
      (value): value is commandLabels =>
        labelItems.some((item) => item.value === value),
      "Please select a command label",
    ),
  command: z
    .string()
    .min(1, "Command must not be empty")
    .max(100, "Command cannot be over 100 characters long"),
});

export default function CreateCommandDialog({
  projectName,
}: {
  projectName: string;
}) {
  const [open, setOpen] = useState(false);
  const { createCommand, isLoadingCreateCommand, errorCreateCommand } =
    useCommandsStore();

  const form = useForm<
    z.input<typeof formSchema>,
    unknown,
    z.output<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      command: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const command = await createCommand(
      projectName,
      data.label as commandLabels,
      data.command,
    );
    if (!command) return;

    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<CreateCommandButton />} />

      <DialogContent
        className="sm:max-w-lg data-open:zoom-in-50! data-closed:zoom-out-50 duration-300 [[data-slot=dialog-overlay]:has(~_&)]:duration-300"
        showCloseButton={false}
      >
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <DialogHeader className="items-center">
            <DialogTitle className="text-lg">Create new command</DialogTitle>

            <DialogDescription>
              Choose the label and enter command.
            </DialogDescription>
          </DialogHeader>

          <form
            className="flex w-full flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Controller
                name="label"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-command-label">
                      Command label
                    </FieldLabel>

                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      items={labelItems}
                    >
                      <SelectTrigger
                        id="create-command-label"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      >
                        <SelectValue placeholder="Select the label" />
                      </SelectTrigger>

                      <SelectContent alignItemWithTrigger={false}>
                        {labelItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="command"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="command">
                      Enter command to run
                    </FieldLabel>

                    <Input
                      {...field}
                      id="command"
                      aria-invalid={fieldState.invalid}
                      placeholder="Run build"
                      autoComplete="off"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {errorCreateCommand && (
              <div className="flex justify-center">
                <p className="text-left text-destructive" role="alert">
                  {errorCreateCommand}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoadingCreateCommand}
              className="cursor-pointer hover:bg-primary/80"
            >
              {isLoadingCreateCommand ? "Creating..." : "Create Command"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
