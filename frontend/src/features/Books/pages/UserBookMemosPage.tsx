import { EmptyState } from "@heroui/react/empty-state";
import { useParams } from "react-router";
import { ChapterCreateCard } from "../components/chapter/shared/ChapterCreateCard";
import { ChapterDetailsPanel } from "../components/chapter/shared/ChapterDetailsPanel";
import { ChapterWorkspace } from "../components/chapter/shared/ChapterWorkspace";
import { CompactPageProgress } from "../components/chapter/shared/CompactPageProgress";
import { PageShell } from "../components/chapter/shared/PageShell";
import { MemoCreateForm } from "../components/chapter/memos/MemoCreateForm";
import { MemoDetailEditor } from "../components/chapter/memos/MemoDetailEditor";
import {
  useChapterMemosQuery,
  useUserBookQuery,
} from "../hooks/useBooksQueries";
import { useChapterSelection } from "../hooks/useChapterSelection";
import { QueryErrorAlert } from "../../../components/status";

export function UserBookMemosPage() {
  const { userId, userBookId } = useParams<{
    userId: string;
    userBookId: string;
  }>();
  const userBook = useUserBookQuery(userBookId);
  const memos = useChapterMemosQuery(userBookId);
  const {
    groups,
    selectedChapterOrder,
    setSelectedChapterOrder,
    selectedItems,
  } = useChapterSelection(memos.data ?? []);

  if (!userId || !userBookId) {
    return (
      <EmptyState className="py-10">
        <p>本が見つかりません。</p>
      </EmptyState>
    );
  }

  return (
    <PageShell
      backTo={`/users/${userId}/books`}
      backLabel="Books管理へ戻る"
      title="メモ"
      subtitle={userBook.data?.book.title}
      headerAction={
        userBook.data ? (
          <CompactPageProgress
            key={userBook.data.userBookId}
            userBook={userBook.data}
          />
        ) : null
      }
    >
      <QueryErrorAlert
        error={userBook.error ?? memos.error}
        fallback="メモの取得に失敗しました。"
      />

      <ChapterWorkspace
        groups={groups}
        selectedChapterOrder={selectedChapterOrder}
        onSelect={setSelectedChapterOrder}
        emptySelectLabel="章メモはまだありません。"
        isLoading={memos.isLoading}
        createSlot={
          <ChapterCreateCard>
            <MemoCreateForm
              userBookId={userBookId}
              onCreated={setSelectedChapterOrder}
            />
          </ChapterCreateCard>
        }
        detailSlot={
          <ChapterDetailsPanel
            title={
              selectedChapterOrder == null
                ? "メモ"
                : `章 #${selectedChapterOrder} のメモ`
            }
            emptyLabel="章選択から選んでください。"
          >
            {selectedItems.length > 0 ? (
              <div className="grid gap-3" data-stacked-memo-details>
                {selectedItems.map((memo) => (
                  <MemoDetailEditor
                    key={memo.chapterMemoId}
                    memo={memo}
                    userBookId={userBookId}
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
