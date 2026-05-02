type Props = {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  onPageIndexChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export function PaginationInputs({
  pageIndex,
  pageSize,
  pageCount,
  onPageIndexChange,
  onPageSizeChange,
}: Props) {
  return (
    <>
      <label className="flex items-center gap-1.5">
        <span className="text-gray-600 dark:text-gray-300">ページ移動</span>
        <input
          type="number"
          defaultValue={pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            if (page >= 0 && page < pageCount) {
              onPageIndexChange(page);
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
            onPageSizeChange(Number(e.target.value));
          }}
          className="rounded-md border border-gray-300 bg-white px-1.5 py-0.5 outline-none focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        >
          {[5, 10, 15].map((item) => (
            <option key={item} value={item}>{item}件</option>
          ))}
        </select>
      </label>
    </>
  );
}
