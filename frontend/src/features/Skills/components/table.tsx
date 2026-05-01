import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type PaginationState,
} from "@tanstack/react-table";
import type { Skill } from "../types/skill";
import { useEffect, useState } from "react";
import { Pagination } from "./Pagination";

const columnHelper = createColumnHelper<Skill>();

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "ID",
  }),
  columnHelper.accessor("skill", {
    cell: (info) => info.getValue(),
    header: "Skill",
  }),
  columnHelper.accessor("level", {
    cell: (info) => info.getValue(),
    header: "Level",
  }),
];

export default function Table() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    fetch('/api/skills')
      .then(response => response.json())
      .then(data => setSkills(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    console.info("Pagination: ", pagination);
  }, [pagination]);

  const table = useReactTable({
    data: skills,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <section className="mx-auto mt-1 w-full max-w-3xl px-2">
      <div className="mb-2 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Profile</p>
          <h2 className="m-0 text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-2xl">My Skills</h2>
        </div>
      </div>
      <div className="mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <table className="w-full border-collapse text-left text-xs sm:text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/70">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-200">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 last:border-0 hover:bg-indigo-100 dark:border-gray-800 dark:hover:bg-indigo-900/40"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2 text-left text-gray-600 dark:text-gray-300">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination table={table} />
    </section>
  );
}