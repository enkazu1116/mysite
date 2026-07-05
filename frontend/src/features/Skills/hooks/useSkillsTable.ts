import { useState } from "react";
import { 
    useReactTable,
    getCoreRowModel, 
    getPaginationRowModel, 
    type PaginationState,
    createColumnHelper
} from "@tanstack/react-table";
import type { Skill } from "../types/skill";

// 列定義
const columnHelper = createColumnHelper<Skill>();
const columns = [
  columnHelper.accessor("skillId", {
    cell: (info) => info.getValue(),
    header: "ID",
  }),
  columnHelper.accessor("language", {
    cell: (info) => info.getValue(),
    header: "Language",
  }),
  columnHelper.accessor("level", {
    cell: (info) => info.getValue(),
    header: "Level",
  }),
  columnHelper.accessor("experienceMonths", {
    cell: (info) => info.getValue(),
    header: "Experience (months)",
  }),
];

// テーブル定義
export const useSkillsTable = (skills: Skill[]) => {
    // ページネーション状態管理
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    // テーブルインスタンス生成
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