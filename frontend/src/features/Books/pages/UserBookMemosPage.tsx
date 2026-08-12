import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Alert, EmptyState } from "@heroui/react";
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
  useCreateChapterMemoMutation,
  useUserBookQuery,
} from "../hooks/useBooksQueries";
import { useChapterSelection } from "../hooks/useChapterSelection";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export function UserBookMemosPage() {
  const { userId, userBookId } = useParams<{
    userId: string;
    userBookId: string;
  }>();
  const userBook = useUserBookQuery(userBookId);
  const memos = useChapterMemosQuery(userBookId);
  const createMemo = useCreateChapterMemoMutation();
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterOrder, setChapterOrder] = useState(1);
  const [memoBody, setMemoBody] = useState("");

  const sorted = useMemo(
    () =>
      [...(memos.data ?? [])].sort((a, b) => a.chapterOrder - b.chapterOrder),
    [memos.data],
  );
  const {
    groups,
    selectedChapterOrder,
    setSelectedChapterOrder,
    selectedItems,
  } = useChapterSelection(sorted);

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userBookId) {
      return;
    }
    createMemo.mutate(
      {
        userBookId,
        payload: {
          chapterTitle: chapterTitle.trim() || undefined,
          chapterOrder,
          memo: memoBody.trim() || undefined,
        },
      },
      {
        onSuccess: (created) => {
          setChapterTitle("");
          setMemoBody("");
          setChapterOrder((value) => value + 1);
          setSelectedChapterOrder(created.chapterOrder);
        },
      },
    );
  };

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
          <CompactPageProgress userBook={userBook.data} />
        ) : null
      }
    >
      {(userBook.error || memos.error || createMemo.error) && (
        <Alert status="danger" className="mb-3 text-left">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>エラー</Alert.Title>
            <Alert.Description>
              {getErrorMessage(
                userBook.error ?? memos.error ?? createMemo.error,
                "メモの取得に失敗しました。",
              )}
            </Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      <ChapterWorkspace
        groups={groups}
        selectedChapterOrder={selectedChapterOrder}
        onSelect={setSelectedChapterOrder}
        emptySelectLabel="章メモはまだありません。"
        isLoading={memos.isLoading}
        createSlot={
          <ChapterCreateCard>
            <MemoCreateForm
              chapterTitle={chapterTitle}
              setChapterTitle={setChapterTitle}
              chapterOrder={chapterOrder}
              setChapterOrder={setChapterOrder}
              memoBody={memoBody}
              setMemoBody={setMemoBody}
              onSubmit={handleCreate}
              isPending={createMemo.isPending}
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
