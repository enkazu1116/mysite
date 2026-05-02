type Props = {
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  rowLength: number;
};

export function PaginationSummary({ pageIndex, pageCount, pageSize, rowLength }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="rounded-md bg-gray-100 px-2 py-0.5 font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-100">
        {pageIndex + 1} / {pageCount} ページ
      </span>
      <span className="text-gray-600 dark:text-gray-300">
        {rowLength} 件中 {pageIndex * pageSize + 1} - {Math.min((pageIndex + 1) * pageSize, rowLength)} 件を表示
      </span>
    </div>
  );
}
