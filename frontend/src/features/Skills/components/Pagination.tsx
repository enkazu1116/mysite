import type { Table } from "@tanstack/react-table";

type Props<T> = {
    table: Table<T>;
}

export function Pagination<T>({ table }: Props<T>) {
    const pageCount = table.getPageCount();
    const rowLength = table.getFilteredRowModel().rows.length;
    const { pageIndex, pageSize } = table.getState().pagination;

    return (
        <div className="mt-2 rounded-lg border border-gray-200 bg-white p-2.5 text-xs sm:text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
            <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-md bg-gray-100 px-2 py-0.5 font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                    {pageIndex + 1} / {pageCount} ページ
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                    {rowLength} 件中 {pageIndex * pageSize + 1} - {Math.min((pageIndex + 1) * pageSize, rowLength)} 件を表示
                </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-1.5">
                    <span className="text-gray-600 dark:text-gray-300">ページ移動</span>
                <input 
                    type="number"
                    defaultValue={pageIndex + 1}
                    onChange={(e) => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0;
                        if (page >= 0 && page < pageCount) {
                            table.setPageIndex(page);
                        }
                    }}
                    min={1}
                    max={pageCount}
                    className="w-16 rounded-md border border-gray-300 bg-white px-1.5 py-0.5 text-right outline-none focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                />
                </label>

                <label className="flex items-center gap-1.5">
                    <span className="text-gray-600 dark:text-gray-300">表示件数</span>
                <select
                    value={pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                    className="rounded-md border border-gray-300 bg-white px-1.5 py-0.5 outline-none focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                >
                    {[5, 10, 15].map((item) => (
                        <option key={item} value={item}>{item}件</option>
                    ))}
                </select>
                </label>

                <div className="flex w-full items-center justify-end gap-1.5 sm:ml-auto sm:w-auto">
                    <button
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="rounded-md border border-gray-300 px-1.5 py-0.5 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        &lt;&lt;
                    </button>
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="rounded-md border border-gray-300 px-1.5 py-0.5 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        &lt;
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="rounded-md border border-gray-300 px-1.5 py-0.5 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        &gt;
                    </button>
                    <button
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage()}
                        className="rounded-md border border-gray-300 px-1.5 py-0.5 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        &gt;&gt;
                    </button>
                </div>
            </div>
        </div>
    )
}