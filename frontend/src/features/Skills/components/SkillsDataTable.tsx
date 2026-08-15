import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import { Table } from "@heroui/react/table";
import type { Skill } from "../types/skill";

type Props = {
  table: TanstackTable<Skill>;
};

export function SkillsDataTable({ table }: Props) {
  const headerGroup = table.getHeaderGroups()[0];

  return (
    <Table className="w-full">
      <Table.ScrollContainer>
        <Table.Content aria-label="My Skills">
          <Table.Header>
            {headerGroup.headers.map((header) => (
              <Table.Column key={header.id} isRowHeader={header.column.id === "id"}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </Table.Column>
            ))}
          </Table.Header>
          <Table.Body>
            {table.getRowModel().rows.map((row) => (
              <Table.Row key={row.id} className="skill-row">
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
