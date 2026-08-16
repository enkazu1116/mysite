import { EmptyState } from "@heroui/react/empty-state";
import { useMemo } from "react";
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
  useUserBookQuery,
} from "../hooks/useBooksQueries";
import { useChapterSelection } from "../hooks/useChapterSelection";
import { QueryErrorAlert } from "../../../components/status";

export function UserBookOutputsPage() {
  const { userId, userBookId } = useParams<{
    userId: string;
    userBookId: string;
  }>();
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
          <CompactPageProgress
            key={userBook.data.userBookId}
            userBook={userBook.data}
          />
        ) : null
      }
    >
      <QueryErrorAlert
        error={userBook.error ?? outputs.error}
        fallback="アウトプットの取得に失敗しました。"
      />

      <ChapterWorkspace
        groups={groups}
        selectedChapterOrder={selectedChapterOrder}
        onSelect={setSelectedChapterOrder}
        emptySelectLabel="アウトプットはまだありません。"
        isLoading={outputs.isLoading}
        createSlot={
          <ChapterCreateCard>
            <OutputCreateForm
              userBookId={userBookId}
              onCreated={setSelectedChapterOrder}
            />
          </ChapterCreateCard>
        }
        detailSlot={
          <ChapterDetailsPanel
            title={
              selectedChapterOrder == null
                ? "アウトプット"
                : `章 #${String(selectedChapterOrder)} のアウトプット`
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
