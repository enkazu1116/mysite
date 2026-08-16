import { expect, test } from "@playwright/test";
import {
  deleteUserBook,
  ensureBooksUser,
  openFromNav,
  seedUnreadBook,
} from "./helpers";

test.describe("Books", () => {
  test("実 API の本が本棚に表示される", async ({ page, request }) => {
    const userId = await ensureBooksUser(request);
    const seeded = await seedUnreadBook(request, userId);

    try {
      await page.goto("/");
      await openFromNav(page, "Books", "/books");

      await expect(page.getByRole("heading", { name: "Books", level: 1 })).toBeVisible();
      await expect(
        page.getByText("状態ごとの棚。列内は出版社順。カバーから詳細へ進めます。"),
      ).toBeVisible();

      await expect(page.getByRole("heading", { name: "本棚", level: 2 })).toBeVisible({
        timeout: 20_000,
      });
      await expect(page.getByRole("heading", { name: "未読", level: 3 })).toBeVisible();
      await expect(page.getByRole("link", { name: seeded.title })).toBeVisible({
        timeout: 20_000,
      });
    } finally {
      await deleteUserBook(request, seeded.userBookId);
    }
  });
});
