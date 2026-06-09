import { Chip, Typography } from "@heroui/react";

type Props = {
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  rowLength: number;
};

export function PaginationSummary({ pageIndex, pageCount, pageSize, rowLength }: Props) {
  const start = rowLength === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, rowLength);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Chip size="sm" variant="soft">
        {pageIndex + 1} / {pageCount} ページ
      </Chip>
      <Typography type="body-xs" color="muted">
        {rowLength} 件中 {start} - {end} 件を表示
      </Typography>
    </div>
  );
}
