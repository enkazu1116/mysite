import { useParams } from "react-router";
import { ChapterDetailsPanel } from "../components/chapter/shared/ChapterDetailsPanel";
import { ChapterWorkspace } from "../components/chapter/shared/ChapterWorkspace";
import { PageShell } from "../components/chapter/shared/PageShell";
import { MemoReadonlyDetail } from "../components/chapter/memos/MemoReadonlyDetail";
import {
  useChapterMemosQuery,
  useUserBookQuery,
} from "../hooks/useBooksQueries";
import { useChapterSelection } from "../hooks/useChapterSelection";
import { QueryErrorAlert } from "../../../components/status";

export function BookMemosPage() {
  const { userBookId } = useParams<{ userBookId: string }>();
  const userBook = useUserBookQuery(userBookId);
  const memos = useChapterMemosQuery(userBookId);
  const {
    groups,
    selectedChapterOrder,
    setSelectedChapterOrder,
    selectedItems,
  } = useChapterSelection(memos.data ?? []);

  return (
    <PageShell
      backTo={userBookId ? `/books/${userBookId}` : "/books"}
      backLabel="本の詳細へ戻る"
      title="メモ"
      subtitle={userBook.data?.book.title}
    >
      <QueryErrorAlert
        error={userBook.error ?? memos.error}
        fallback="メモの取得に失敗しました。"
      />

      <ChapterWorkspace
        groups={groups}
        selectedChapterOrder={selectedChapterOrder}
        onSelect={setSelectedChapterOrder}
        emptySelectLabel="章メモはありません。"
        isLoading={memos.isLoading}
        detailSlot={
          <ChapterDetailsPanel
            title={
              selectedChapterOrder == null
                ? "メモ"
                : `章 #${String(selectedChapterOrder)} のメモ`
            }
            emptyLabel="章を選択してください。"
          >
            {selectedItems.length > 0 ? (
              <div className="grid gap-3">
                {selectedItems.map((memo) => (
                  <MemoReadonlyDetail key={memo.chapterMemoId} memo={memo} />
                ))}
              </div>
            ) : null}
          </ChapterDetailsPanel>
        }
      />
    </PageShell>
  );
}
