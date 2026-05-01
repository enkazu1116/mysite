import { useState } from "react";
import { 
    useReactTable,
    getCoreRowModel, 
    getPaginationRowModel, 
    type PaginationState,
    createColumnHelper
} from "@tanstack/react-table";
import type { Skill } from "../types/skill";


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

export const useSkillsTable = (skills: Skill[]) => {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

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

    return { table };
};