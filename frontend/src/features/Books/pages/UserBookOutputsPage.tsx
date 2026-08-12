import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Alert, EmptyState } from "@heroui/react";
import { useParams } from "react-router";
import { ChapterCreateCard } from "../components/chapter/shared/ChapterCreateCard";
import { ChapterDetailsPanel } from "../components/chapter/shared/ChapterDetailsPanel";
import { ChapterWorkspace } from "../components/chapter/shared/ChapterWorkspace";
import { CompactPageProgress } from "../components/chapter/shared/CompactPageProgress";
import { PageShell } from "../components/chapter/shared/PageShell";
import { OutputCreateForm } from "../components/chapter/outputs/OutputCreateForm";
import { OutputDetailEditor } from "../components/chapter/outputs/OutputDetailEditor";
import {
  useBookOutputsQuery,
  useCreateBookOutputMutation,
  useUserBookQuery,
} from "../hooks/useBooksQueries";
import { useChapterSelection } from "../hooks/useChapterSelection";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export function UserBookOutputsPage() {
  const { userId, userBookId } = useParams<{
    userId: string;
    userBookId: string;
  }>();
  const userBook = useUserBookQuery(userBookId);
  const outputs = useBookOutputsQuery(userBookId);
  const createOutput = useCreateBookOutputMutation();
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterOrder, setChapterOrder] = useState(1);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const sorted = useMemo(
    () =>
      [...(outputs.data ?? [])]
        .map((output) => ({
          ...output,
          chapterOrder: output.chapterOrder ?? 0,
        }))
        .sort(
          (a, b) =>
            a.chapterOrder - b.chapterOrder || a.title.localeCompare(b.title),
        ),
    [outputs.data],
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
    createOutput.mutate(
      {
        userBookId,
        payload: {
          chapterTitle: chapterTitle.trim() || undefined,
          chapterOrder,
          title: title.trim(),
          body: body.trim(),
        },
      },
      {
        onSuccess: (created) => {
          setChapterTitle("");
          setTitle("");
          setBody("");
          setChapterOrder((value) => value + 1);
          setSelectedChapterOrder(created.chapterOrder ?? chapterOrder);
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
      title="アウトプット"
      subtitle={userBook.data?.book.title}
      headerAction={
        userBook.data ? (
          <CompactPageProgress userBook={userBook.data} />
        ) : null
      }
    >
      {(userBook.error || outputs.error || createOutput.error) && (
        <Alert status="danger" className="mb-3 text-left">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>エラー</Alert.Title>
            <Alert.Description>
              {getErrorMessage(
                userBook.error ?? outputs.error ?? createOutput.error,
                "アウトプットの取得に失敗しました。",
              )}
            </Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      <ChapterWorkspace
        groups={groups}
        selectedChapterOrder={selectedChapterOrder}
        onSelect={setSelectedChapterOrder}
        emptySelectLabel="アウトプットはまだありません。"
        isLoading={outputs.isLoading}
        createSlot={
          <ChapterCreateCard>
            <OutputCreateForm
              chapterTitle={chapterTitle}
              setChapterTitle={setChapterTitle}
              chapterOrder={chapterOrder}
              setChapterOrder={setChapterOrder}
              title={title}
              setTitle={setTitle}
              body={body}
              setBody={setBody}
              onSubmit={handleCreate}
              isPending={createOutput.isPending}
            />
          </ChapterCreateCard>
        }
        detailSlot={
          <ChapterDetailsPanel
            title={
              selectedChapterOrder == null
                ? "アウトプット"
                : `章 #${selectedChapterOrder} のアウトプット`
            }
            emptyLabel="章選択から選んでください。"
          >
            {selectedItems.length > 0 ? (
              <div className="grid gap-3" data-stacked-output-details>
                {selectedItems.map((output) => (
                  <OutputDetailEditor
                    key={output.bookOutputId}
                    output={output}
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
