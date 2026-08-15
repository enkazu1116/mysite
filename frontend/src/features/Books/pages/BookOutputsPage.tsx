import { useMemo } from "react";
import { useParams } from "react-router";
import { ChapterDetailsPanel } from "../components/chapter/shared/ChapterDetailsPanel";
import { ChapterWorkspace } from "../components/chapter/shared/ChapterWorkspace";
import { PageShell } from "../components/chapter/shared/PageShell";
import { OutputReadonlyDetail } from "../components/chapter/outputs/OutputReadonlyDetail";
import {
  useBookOutputsQuery,
  useUserBookQuery,
} from "../hooks/useBooksQueries";
import { useChapterSelection } from "../hooks/useChapterSelection";
import { QueryErrorAlert } from "../../../components/status";

export function BookOutputsPage() {
  const { userBookId } = useParams<{ userBookId: string }>();
  const userBook = useUserBookQuery(userBookId);
  const outputs = useBookOutputsQuery(userBookId);
  const groupedOutputs = useMemo(
    () =>
      (outputs.data ?? []).toSorted((a, b) => a.title.localeCompare(b.title)),
    [outputs.data],
  );
  const {
    groups,
    selectedChapterOrder,
    setSelectedChapterOrder,
    selectedItems,
  } = useChapterSelection(groupedOutputs);

  return (
    <PageShell
      backTo={userBookId ? `/books/${userBookId}` : "/books"}
      backLabel="本の詳細へ戻る"
      title="アウトプット"
      subtitle={userBook.data?.book.title}
    >
      <QueryErrorAlert
        error={userBook.error ?? outputs.error}
        fallback="アウトプットの取得に失敗しました。"
      />

      <ChapterWorkspace
        groups={groups}
        selectedChapterOrder={selectedChapterOrder}
        onSelect={setSelectedChapterOrder}
        emptySelectLabel="アウトプットはありません。"
        isLoading={outputs.isLoading}
        detailSlot={
          <ChapterDetailsPanel
            title={
              selectedChapterOrder == null
                ? "アウトプット"
                : `章 #${selectedChapterOrder} のアウトプット`
            }
            emptyLabel="章を選択してください。"
          >
            {selectedItems.length > 0 ? (
              <div className="grid gap-3">
                {selectedItems.map((output) => (
                  <OutputReadonlyDetail
                    key={output.bookOutputId}
                    output={output}
                  />
                ))}
              </div>
            ) : null}
          </ChapterDetailsPanel>
        }
      />
    </PageShell>
  );
}
