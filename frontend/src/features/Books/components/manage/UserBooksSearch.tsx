import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@heroui/react/button";
import { Form } from "@heroui/react/form";
import { Input } from "@heroui/react/input";
import { Label } from "@heroui/react/label";
import { TextField } from "@heroui/react/textfield";
import {
  BookmarkPlusIcon,
  CheckIcon,
  SearchIcon,
} from "../../../../components/icons";
import { useBookSearchQuery } from "../../hooks/useBooksQueries";
import type { BookSearchResult } from "../../types/book";
import { QueryErrorAlert } from "../../../../components/status";

const SEARCH_RESULT_LIMIT = 12;

export function UserBooksSearch({
  onRegister,
  isRegistering,
  registeredSourceBookIds,
}: {
  onRegister: (book: BookSearchResult) => void;
  isRegistering: boolean;
  registeredSourceBookIds: Set<string>;
}) {
  const [title, setTitle] = useState("");
  const [query, setQuery] = useState("");
  const search = useBookSearchQuery(query, query.length > 0);
  const results = (search.data ?? []).slice(0, SEARCH_RESULT_LIMIT);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery(title.trim());
  };

  return (
    <section className="text-left">
      <h2 className="font-display mb-3 text-base font-semibold text-[var(--lib-ink)]">
        本を検索して登録
      </h2>
      <Form
        onSubmit={handleSubmit}
        className="flex flex-col gap-1.5 sm:flex-row sm:items-end"
      >
        <TextField
          value={title}
          onChange={setTitle}
          className="min-w-0 flex-1"
          isDisabled={search.isFetching}
        >
          <Label className="text-xs text-[var(--lib-ink-muted)]">タイトル</Label>
          <Input
            placeholder="タイトル"
            className="bg-[var(--lib-paper-elevated)] text-sm"
          />
        </TextField>
        <Button
          type="submit"
          size="sm"
          isIconOnly
          aria-label="検索"
          isPending={search.isFetching}
          className="bg-[var(--lib-accent)] text-[var(--lib-accent-fg)]"
        >
          <SearchIcon />
        </Button>
      </Form>

      <QueryErrorAlert
        error={search.error}
        fallback="本の検索に失敗しました。"
        className="mt-2 text-left"
      />

      {query && !search.isFetching && results.length === 0 && !search.error && (
        <p className="mt-2 m-0 border border-dashed border-[var(--lib-line)] px-2 py-1.5 text-xs text-[var(--lib-ink-muted)]">
          検索結果はありません。
        </p>
      )}

      {results.length > 0 && (
        <div className="lib-panel mt-3 max-h-40 overflow-y-auto">
          {results.map((book) => {
            const isRegistered = registeredSourceBookIds.has(book.sourceBookId);

            return (
              <article
                key={book.sourceBookId}
                className="flex items-center gap-2 border-b border-[var(--lib-line)] px-2 py-1.5 last:border-b-0"
              >
                <div className="h-9 w-6 shrink-0 overflow-hidden rounded-sm border border-[var(--lib-line)] bg-[var(--lib-paper-elevated)]">
                  {book.thumbnailUrl ? (
                    <img
                      src={book.thumbnailUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-end justify-center bg-[linear-gradient(90deg,#374151_0_18%,#4b5563_18%_82%,#6b7280_82%)] px-0.5 pb-0.5">
                      <span className="h-3 w-0.5 rounded bg-gray-200/80" />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="m-0 truncate text-xs font-semibold text-[var(--lib-ink)]">
                    {book.title}
                  </p>
                  <p className="m-0 truncate text-[11px] text-[var(--lib-ink-muted)]">
                    {book.authors.length > 0
                      ? book.authors.join(", ")
                      : "著者不明"}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  isIconOnly
                  aria-label={isRegistered ? "登録済み" : "登録"}
                  isPending={isRegistering && !isRegistered}
                  isDisabled={isRegistered}
                  onPress={() => {
                    if (isRegistered) {
                      return;
                    }
                    onRegister(book);
                  }}
                  className="h-9 w-9 shrink-0"
                >
                  {isRegistered ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <BookmarkPlusIcon />
                  )}
                </Button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
