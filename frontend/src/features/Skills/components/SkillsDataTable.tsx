import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import type { Skill } from "../types/skill";

type Props = {
  table: TanstackTable<Skill>;
};

export function SkillsDataTable({ table }: Props) {
  return (
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
  );
}
