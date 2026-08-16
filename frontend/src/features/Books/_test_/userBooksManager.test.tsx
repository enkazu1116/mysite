import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router";
import { describe, expect, test } from "vitest";
import UserBooksManagerPage from "../pages/UserBooksManagerPage";
import { OWNER_USER_ID, searchResult, unreadBook } from "../../../test/booksFixtures";
import { renderWithProviders } from "../../../test/render";

function renderManager(userId: string) {
  return renderWithProviders(
    <Routes>
      <Route path="/users/:userId/books" element={<UserBooksManagerPage />} />
    </Routes>,
    { initialEntries: [`/users/${userId}/books`] },
  );
}

describe("Books 管理", () => {
  test("owner には登録一覧と検索欄がある", async () => {
    renderManager("user-1");

    expect(
      await screen.findByText("本を検索して登録"),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "登録済み本" })).toBeInTheDocument();
    expect(await screen.findByText(unreadBook.book.title)).toBeInTheDocument();
  });

  test("検索して登録すると一覧に載る", async () => {
    const user = userEvent.setup();
    renderManager("user-1");

    await screen.findByText(unreadBook.book.title);

    await user.type(screen.getByPlaceholderText("タイトル"), searchResult.title);
    await user.click(screen.getByRole("button", { name: "検索" }));

    expect(await screen.findByText(searchResult.title)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "登録" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "登録済み" })).toBeDisabled();
    });
    expect(screen.getAllByText(searchResult.title).length).toBeGreaterThan(0);
  });

  test("guest は登録・編集できず検索欄がない", async () => {
    renderManager("user-2");

    expect(
      await screen.findByText("ゲストユーザーは本の登録・編集対象外です。"),
    ).toBeInTheDocument();
    expect(screen.queryByText("本を検索して登録")).toBeNull();
    expect(screen.queryByRole("button", { name: "検索" })).toBeNull();
  });

  test("不明なユーザーなら案内が出る", async () => {
    renderManager("user-unknown");

    expect(
      await screen.findByText("ユーザーが見つかりません。"),
    ).toBeInTheDocument();
  });

  test("行を開くとメモ／アウトプットへ進めて、削除後に一覧から消える", async () => {
    const user = userEvent.setup();
    renderManager("user-1");

    const title = await screen.findByText(unreadBook.book.title);
    const row = title.closest("[data-book-accordion]");
    expect(row).not.toBeNull();

    await user.click(title);

    const detail = within(row as HTMLElement);
    expect(detail.getByRole("link", { name: "メモページへ" })).toHaveAttribute(
      "href",
      `/users/${OWNER_USER_ID}/books/${unreadBook.userBookId}/memos`,
    );
    expect(detail.getByRole("link", { name: "アウトプットページへ" })).toHaveAttribute(
      "href",
      `/users/${OWNER_USER_ID}/books/${unreadBook.userBookId}/outputs`,
    );

    await user.click(detail.getByRole("button", { name: "削除" }));

    await waitFor(() => {
      expect(screen.queryByText(unreadBook.book.title)).toBeNull();
    });
    expect(window.confirm).toHaveBeenCalled();
  });
});
