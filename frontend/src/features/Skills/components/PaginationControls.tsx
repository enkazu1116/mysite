type Props = {
  isPending: boolean;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onFirstPage: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
};

export function PaginationControls({
  isPending,
  canPreviousPage,
  canNextPage,
  onFirstPage,
  onPreviousPage,
  onNextPage,
  onLastPage,
}: Props) {
  return (
    <div className="flex w-full items-center justify-end gap-1.5 sm:ml-auto sm:w-auto">
      <button
        onClick={onFirstPage}
        disabled={isPending || !canPreviousPage}
        className="rounded-md border border-gray-300 px-1.5 py-0.5 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        &lt;&lt;
      </button>
      <button
        onClick={onPreviousPage}
        disabled={isPending || !canPreviousPage}
        className="rounded-md border border-gray-300 px-1.5 py-0.5 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        &lt;
      </button>
      <button
        onClick={onNextPage}
        disabled={isPending || !canNextPage}
        className="rounded-md border border-gray-300 px-1.5 py-0.5 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        &gt;
      </button>
      <button
        onClick={onLastPage}
        disabled={isPending || !canNextPage}
        className="rounded-md border border-gray-300 px-1.5 py-0.5 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        &gt;&gt;
      </button>
    </div>
  );
}
