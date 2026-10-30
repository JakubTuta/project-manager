import {
  columnVisibilityFeature,
  createColumnHelper,
  flexRender,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { ArrowRight, Hammer, Play, Square, Trash } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProjectsStore } from "@/stores/projects";
import type { Project } from "@/types/project";

const features = tableFeatures({ columnVisibilityFeature });
const columnHelper = createColumnHelper<typeof features, Project>();

const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: () => <span>Project name</span>,
    cell: (info) => <span className="text-base">{info.getValue()}</span>,
  }),
  columnHelper.accessor("path", {
    header: () => <span>Folder path</span>,
    cell: (info) => (
      <span className="text-base text-muted-foreground">{info.getValue()}</span>
    ),
  }),
  columnHelper.display({
    id: "commands",
    header: () => <span>Quick commands</span>,
    cell: () => (
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Build project"
          title="Build project"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <Hammer />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Run project"
          title="Run project"
          className="text-green-600 hover:text-green-700 dark:text-green-400"
        >
          <Play fill="currentColor" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Stop project"
          title="Stop project"
          className="text-red-600 hover:text-red-700 dark:text-red-400"
        >
          <Square fill="currentColor" />
        </Button>
      </div>
    ),
  }),
  columnHelper.display({
    id: "project",
    header: () => <span>See project</span>,
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Open ${row.original.name}`}
        title={`Open ${row.original.name}`}
        render={<Link to={`/project/${row.original.name}`} />}
        nativeButton={false}
      >
        <ArrowRight />
      </Button>
    ),
  }),
  columnHelper.display({
    id: "delete",
    header: () => <span>Delete</span>,
  }),
]);

export default function ProjectsTable() {
  const data = useProjectsStore((state) => state.projects);
  const deleteProject = useProjectsStore((state) => state.deleteProject);

  const table = useTable({
    features,
    data,
    columns,
  });

  return (
    <section className="overflow-hidden rounded-md border border-border">
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
                      {cell.id.split("_")[1] === "delete" ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${row.original.name}`}
                          title={`Delete ${row.original.name}`}
                          onClick={() => deleteProject(row.original.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400"
                        >
                          <Trash />
                        </Button>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )
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
                  No projects yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
