import {
  columnVisibilityFeature,
  createColumnHelper,
  flexRender,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCommandsStore } from "@/stores/commands";
import type { Command, commandLabels } from "@/types/command";
import CreateCommandDialog from "./create-command-dialog";

const features = tableFeatures({ columnVisibilityFeature });
const columnHelper = createColumnHelper<typeof features, Command>();

const labelColors: Record<commandLabels, string> = {
  build: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  run: "bg-green-500/10 text-green-600 dark:text-green-400",
  stop: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const columns = columnHelper.columns([
  columnHelper.accessor("label", {
    header: () => <span>Label</span>,
    cell: (info) => (
      <Badge
        className={`${labelColors[info.getValue()]} border-0 capitalize shadow-none`}
      >
        {info.getValue()}
      </Badge>
    ),
  }),
  columnHelper.accessor("command", {
    header: () => <span>Command</span>,
    cell: (info) => <span className="text-base">{info.getValue()}</span>,
  }),
  columnHelper.display({
    id: "action",
    header: () => <span>Action</span>,
    cell: () => (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Run command"
        title="Run command"
        className="text-green-600 hover:text-green-700 dark:text-green-400"
      >
        <Play fill="currentColor" />
      </Button>
    ),
  }),
]);

export default function CommandsTable({
  projectName,
}: {
  projectName: string;
}) {
  const data = useCommandsStore((state) => state.commands);

  const table = useTable({
    features,
    data,
    columns,
  });

  return (
    <section>
      <CreateCommandDialog projectName={projectName} />

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-base font-medium text-left border-b border-border px-4 py-3 h-auto"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="divide-y divide-border">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="whitespace-nowrap py-4 px-4"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-8 text-center text-muted-foreground"
                >
                  No commands yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
