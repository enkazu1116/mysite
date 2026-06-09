import { useState } from "react";
import type { FormEvent } from "react";
import {
  Alert,
  Button,
  Card,
  EmptyState,
  Form,
  Input,
  Label,
  Link,
  Spinner,
  TextField,
  Typography,
} from "@heroui/react";
import { fetchBooks } from "./api/fetchBooks";
import type { Book } from "./types/book";

export default function Books() {
  const [title, setTitle] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedTitle, setSearchedTitle] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = title.trim();
    if (!query) {
      setBooks([]);
      setSearchedTitle("");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchBooks(query);
      setBooks(result);
      setSearchedTitle(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : "本の取得に失敗しました。");
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 px-4 pb-4 pt-0.5">
      <Typography.Heading level={2} className="mb-4 text-left">
        Books
      </Typography.Heading>

      <Form onSubmit={(event) => void handleSubmit(event)} className="mb-6 flex flex-wrap items-end gap-2">
        <TextField
          value={title}
          onChange={setTitle}
          className="w-full max-w-md"
          isDisabled={isLoading}
        >
          <Label>本のタイトル</Label>
          <Input placeholder="本のタイトルを入力" />
        </TextField>
        <Button type="submit" isPending={isLoading}>
          検索
        </Button>
      </Form>

      {isLoading && (
        <div className="flex items-center gap-2 py-4">
          <Spinner size="sm" />
          <span className="text-sm text-gray-500">検索中...</span>
        </div>
      )}

      {error && (
        <Alert status="danger" className="mb-4 max-w-lg text-left">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>エラー</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      {!isLoading && !error && searchedTitle && books.length === 0 && (
        <EmptyState className="py-8">
          <p>「{searchedTitle}」の検索結果はありません。</p>
        </EmptyState>
      )}

      {books.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {books.map((book) => (
            <Card key={book.id} className="text-left">
              <Card.Content className="p-3">
                <Link
                  href={book.infoLink || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="block no-underline"
                >
                  {book.thumbnail ? (
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="mx-auto mb-2 h-40 object-contain"
                    />
                  ) : (
                    <div className="mx-auto mb-2 flex h-40 items-center justify-center rounded-md bg-gray-100 text-xs text-gray-500 dark:bg-gray-800">
                      No Image
                    </div>
                  )}
                  <Card.Title className="line-clamp-2 text-sm">{book.title}</Card.Title>
                  <Typography type="body-xs" color="muted" className="mt-1">
                    {book.authors.length > 0 ? book.authors.join(", ") : "著者不明"}
                  </Typography>
                </Link>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
