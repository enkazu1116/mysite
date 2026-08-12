import { useMemo } from "react";
import { Alert } from "@heroui/react";
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
import { getErrorMessage } from "../../../utils/getErrorMessage";

export function BookOutputsPage() {
  const { userBookId } = useParams<{ userBookId: string }>();
  const userBook = useUserBookQuery(userBookId);
  const outputs = useBookOutputsQuery(userBookId);

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

  return (
    <PageShell
      backTo={userBookId ? `/books/${userBookId}` : "/books"}
      backLabel="本の詳細へ戻る"
      title="アウトプット"
      subtitle={userBook.data?.book.title}
    >
      {(userBook.error || outputs.error) && (
        <Alert status="danger" className="mb-3 text-left">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>エラー</Alert.Title>
            <Alert.Description>
              {getErrorMessage(
                userBook.error ?? outputs.error,
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
