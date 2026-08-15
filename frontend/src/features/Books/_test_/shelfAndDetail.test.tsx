import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { Route, Routes } from "react-router";
import { describe, expect, test } from "vitest";
import Books from "../books";
import BookDetail from "../BookDetail";
import { readingBook, unreadBook } from "../../../test/booksFixtures";
import { setUserBooks } from "../../../test/handlers";
import { renderWithProviders } from "../../../test/render";
import { server } from "../../../test/server";

function renderBooks(path = "/books") {
  return renderWithProviders(
    <Routes>
      <Route path="/books" element={<Books />} />
      <Route path="/books/:userBookId" element={<BookDetail />} />
    </Routes>,
    { initialEntries: [path] },
  );
}

describe("本棚", () => {
  test("本のタイトルから詳細へ進むリンクと状態ラベルがある", async () => {
    renderBooks();

    const unreadLink = await screen.findByRole("link", {
      name: unreadBook.book.title,
    });
    expect(unreadLink).toHaveAttribute(
      "href",
      `/books/${unreadBook.userBookId}`,
    );

    expect(
      await screen.findByRole("link", { name: readingBook.book.title }),
    ).toHaveAttribute("href", `/books/${readingBook.userBookId}`);

    expect(screen.getByRole("heading", { name: "未読" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "読書中" })).toBeInTheDocument();
  });

  test("0件なら空の案内が出る", async () => {
    setUserBooks([]);
    renderBooks();

    expect(
      await screen.findByText("登録済みの本はありません。"),
    ).toBeInTheDocument();
  });

  test("API 失敗ならエラー文言が出る", async () => {
    server.use(
      http.get("/api/user-books", () =>
        HttpResponse.json(
          { message: "Books の取得に失敗しました。" },
          { status: 500 },
        ),
      ),
    );
    renderBooks();

    expect(
      await screen.findByText("Books の取得に失敗しました。"),
    ).toBeInTheDocument();
  });
});

describe("本の詳細", () => {
  test("タイトル・著者・状態とメモ／アウトプットへのリンクがある", async () => {
    renderBooks(`/books/${readingBook.userBookId}`);

    expect(
      await screen.findByRole("heading", { name: readingBook.book.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(readingBook.book.authors[0])).toBeInTheDocument();
    expect(screen.getByText("読書中")).toBeInTheDocument();

    const memosLink = screen.getByRole("link", { name: /メモ/ });
    expect(memosLink).toHaveAttribute(
      "href",
      `/books/${readingBook.userBookId}/memos`,
    );

    const outputsLink = screen.getByRole("link", { name: /アウトプット/ });
    expect(outputsLink).toHaveAttribute(
      "href",
      `/books/${readingBook.userBookId}/outputs`,
    );
  });

  test("見つからない本なら案内が出る", async () => {
    renderBooks("/books/missing-book");

    expect(
      (await screen.findAllByText("本が見つかりません。")).length,
    ).toBeGreaterThan(0);
  });
});
