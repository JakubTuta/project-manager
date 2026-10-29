"use client";
import {
  createColumnHelper,
  useTable,
  tableFeatures,
  columnVisibilityFeature,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProjectsStore } from "@/stores/projects";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Hammer, Play, Square } from "lucide-react";

export interface TableType {
  name: string;
  path: string;
  actions: string;
  goToProject: string;
}

// const statusColors: Record<string, string> = {
//   Active: "bg-teal-400/10 text-teal-400 hover:bg-teal-400/10",
//   Pending: "bg-orange-400/10 text-orange-400 hover:bg-orange-400/10",
//   Inactive: "bg-red-500/10 text-red-500 hover:bg-red-500/10",
// };

const features = tableFeatures({ columnVisibilityFeature });

const columnHelper = createColumnHelper<typeof features, TableType>();

const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: () => <span>Project name</span>,
    cell: (info) => <span className="text-base">{info.getValue()}</span>,
  }),
  columnHelper.accessor("path", {
    header: () => <span>Folder path</span>,
    cell: (info) => <span className="text-base">{info.getValue()}</span>,
  }),
  columnHelper.accessor("actions", {
    header: () => <span>Quick actions</span>,
    cell: (info) => <span className="text-base">{info.getValue()}</span>,
  }),
  columnHelper.accessor("goToProject", {
    header: () => <span>See project</span>,
    cell: (info) => <span className="text-base">{info.getValue()}</span>,
  }),
  //   columnHelper.accessor("status", {
  //     header: () => <span>Status</span>,
  //     cell: (info) => (
  //       <Badge
  //         className={`${statusColors[info.getValue()]} border-0 capitalize shadow-none`}
  //       >
  //         {info.getValue()}
  //       </Badge>
  //     ),
  //   }),
]);

export default function ProjectsTable() {
  const data = useProjectsStore((state) => state.projects);

  const table = useTable({
    features,
    data,
    columns,
  });

  return (
    <section className="border rounded-md border-border overflow-hidden">
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
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row
                  .getVisibleCells()
                  .slice(0, row.getVisibleCells().length - 2)
                  .map((cell) => (
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

                <TableCell className="whitespace-nowrap py-4 px-4 flex">
                  <Button variant="ghost" size="icon">
                    <Hammer color="blue" />
                  </Button>

                  <Button variant="ghost" size="icon">
                    <Play color="green" />
                  </Button>

                  <Button variant="ghost" size="icon">
                    <Square color="red" />
                  </Button>
                </TableCell>

                <TableCell className="whitespace-nowrap py-4 px-4">
                  <Button variant="ghost" size="icon">
                    <Link
                      to={`/project/${row.getVisibleCells()[0].getValue()}`}
                    >
                      <ArrowRight />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
