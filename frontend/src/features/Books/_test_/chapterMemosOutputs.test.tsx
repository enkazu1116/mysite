import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router";
import { describe, expect, test } from "vitest";
import { BookMemosPage } from "../pages/BookMemosPage";
import { UserBookMemosPage } from "../pages/UserBookMemosPage";
import { UserBookOutputsPage } from "../pages/UserBookOutputsPage";
import {
  chapterMemo,
  OWNER_USER_ID,
  readingBook,
  unreadBook,
} from "../../../test/booksFixtures";
import { setMemos, setOutputs } from "../../../test/handlers";
import { renderWithProviders } from "../../../test/render";

function renderMemosEdit() {
  return renderWithProviders(
    <Routes>
      <Route
        path="/users/:userId/books/:userBookId/memos"
        element={<UserBookMemosPage />}
      />
    </Routes>,
    {
      initialEntries: [
        `/users/${OWNER_USER_ID}/books/${unreadBook.userBookId}/memos`,
      ],
    },
  );
}

function renderMemosReadonly() {
  return renderWithProviders(
    <Routes>
      <Route path="/books/:userBookId/memos" element={<BookMemosPage />} />
    </Routes>,
    { initialEntries: [`/books/${readingBook.userBookId}/memos`] },
  );
}

function renderOutputsEdit() {
  return renderWithProviders(
    <Routes>
      <Route
        path="/users/:userId/books/:userBookId/outputs"
        element={<UserBookOutputsPage />}
      />
    </Routes>,
    {
      initialEntries: [
        `/users/${OWNER_USER_ID}/books/${unreadBook.userBookId}/outputs`,
      ],
    },
  );
}

function textareaIn(container: HTMLElement) {
  const field = container.querySelector("textarea");
  if (!field) {
    throw new Error("textarea が見つかりません");
  }
  return field;
}

describe("章メモ", () => {
  test("メモがなければ空の案内が出る", async () => {
    setMemos([]);
    renderMemosEdit();

    expect(
      await screen.findByText("章メモはまだありません。"),
    ).toBeInTheDocument();
  });

  test("既存メモは章の本文が見える", async () => {
    renderMemosReadonly();

    expect(await screen.findByText(chapterMemo.memo as string)).toBeInTheDocument();
    expect(screen.getByText(chapterMemo.chapterTitle as string)).toBeInTheDocument();
  });

  test("編集ページで新規追加するとその章の詳細に出る", async () => {
    const user = userEvent.setup();
    setMemos([]);
    renderMemosEdit();

    await screen.findByText("章メモはまだありません。");

    const createCard = document.querySelector(
      "[data-create-form-card]",
    ) as HTMLElement;
    await user.type(within(createCard).getByPlaceholderText("章タイトル"), "新しい章");
    await user.type(textareaIn(createCard), "追加したメモ本文");
    await user.click(within(createCard).getByRole("button", { name: "章メモを追加" }));

    await waitFor(() => {
      const detail = document.querySelector("[data-memo-detail-form]");
      expect(detail).not.toBeNull();
      expect(within(detail as HTMLElement).getByDisplayValue("新しい章")).toBeInTheDocument();
      expect(textareaIn(detail as HTMLElement)).toHaveValue("追加したメモ本文");
    });
  });
});

describe("アウトプット", () => {
  test("アウトプットがなければ空の案内が出る", async () => {
    setOutputs([]);
    renderOutputsEdit();

    expect(
      await screen.findByText("アウトプットはまだありません。"),
    ).toBeInTheDocument();
  });

  test("作成するとその章の詳細に出る", async () => {
    const user = userEvent.setup();
    setOutputs([]);
    renderOutputsEdit();

    await screen.findByText("アウトプットはまだありません。");

    const createCard = document.querySelector(
      "[data-create-form-card]",
    ) as HTMLElement;
    await user.type(
      within(createCard).getByPlaceholderText("アウトプットタイトル"),
      "新しいアウトプット",
    );
    await user.type(textareaIn(createCard), "追加したアウトプット本文");
    await user.click(
      within(createCard).getByRole("button", { name: "アウトプットを追加" }),
    );

    await waitFor(() => {
      const detail = document.querySelector("[data-output-detail-form]");
      expect(detail).not.toBeNull();
      expect(
        within(detail as HTMLElement).getByDisplayValue("新しいアウトプット"),
      ).toBeInTheDocument();
      expect(textareaIn(detail as HTMLElement)).toHaveValue(
        "追加したアウトプット本文",
      );
    });
  });
});
