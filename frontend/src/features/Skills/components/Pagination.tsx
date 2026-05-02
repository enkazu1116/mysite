import type { Table } from "@tanstack/react-table";
import { useTransition } from "react";
import { PaginationControls } from "./PaginationControls";
import { PaginationInputs } from "./PaginationInputs";
import { PaginationSummary } from "./PaginationSummary";

type Props<T> = {
    table: Table<T>;
}

export function Pagination<T>({ table }: Props<T>) {
    const [isPending, startTransition] = useTransition();
    const pageCount = table.getPageCount();
    const rowLength = table.getFilteredRowModel().rows.length;
    const { pageIndex, pageSize } = table.getState().pagination;

    return (
        <div className="mt-2 rounded-lg border border-gray-200 bg-white p-2.5 text-xs sm:text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
            <PaginationSummary
                pageIndex={pageIndex}
                pageCount={pageCount}
                pageSize={pageSize}
                rowLength={rowLength}
            />

            <div className="mt-2 flex flex-wrap items-center gap-2">
                <PaginationInputs
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    pageCount={pageCount}
                    onPageIndexChange={(nextPage) => {
                        startTransition(() => {
                            table.setPageIndex(nextPage);
                        });
                    }}
                    onPageSizeChange={(nextPageSize) => {
                        startTransition(() => {
                            table.setPageSize(nextPageSize);
                        });
                    }}
                />

                <PaginationControls
                    isPending={isPending}
                    canPreviousPage={table.getCanPreviousPage()}
                    canNextPage={table.getCanNextPage()}
                    onFirstPage={() => startTransition(() => table.firstPage())}
                    onPreviousPage={() => startTransition(() => table.previousPage())}
                    onNextPage={() => startTransition(() => table.nextPage())}
                    onLastPage={() => startTransition(() => table.lastPage())}
                />
                {isPending && (
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">ページ切替中...</span>
                )}
            </div>
        </div>
    )
}