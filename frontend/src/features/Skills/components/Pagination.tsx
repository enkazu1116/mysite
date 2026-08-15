import type { Table } from "@tanstack/react-table";
import { Spinner } from "@heroui/react/spinner";
import { Surface } from "@heroui/react/surface";
import { useTransition } from "react";
import {
  PaginationControls,
  PaginationInputs,
  PaginationSummary,
} from "../../../components/pagination";

type Props<T> = {
  table: Table<T>;
};

export function Pagination<T>({ table }: Props<T>) {
  const [isPending, startTransition] = useTransition();
  const pageCount = table.getPageCount();
  const rowLength = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <Surface variant="secondary" className="mt-2 p-3 text-left text-xs sm:text-sm">
      <PaginationSummary
        pageIndex={pageIndex}
        pageCount={pageCount}
        pageSize={pageSize}
        rowLength={rowLength}
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
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
          <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--lib-ink-muted)]">
            <Spinner size="sm" />
            ページ切替中...
          </span>
        )}
      </div>
    </Surface>
  );
}
