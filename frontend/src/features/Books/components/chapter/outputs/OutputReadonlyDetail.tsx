import { Chip } from "@heroui/react/chip";
import type { BookOutput } from "../../../types/book";

export function OutputReadonlyDetail({ output }: { output: BookOutput }) {
  return (
    <article
      className="grid gap-2 rounded-md border border-gray-200 p-3 dark:border-gray-800"
      data-output-detail-view
    >
      <div className="flex flex-wrap items-center gap-2">
        <Chip size="sm">#{output.chapterOrder ?? 0}</Chip>
        <span className="text-xs text-gray-500">
          {output.chapterTitle || "章タイトルなし"}
        </span>
      </div>
      <h3 className="m-0 text-sm font-semibold">{output.title}</h3>
      <p className="m-0 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-200">
        {output.body}
      </p>
    </article>
  );
}
