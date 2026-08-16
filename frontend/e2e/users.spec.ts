import { expect, test } from "@playwright/test";
import { openFromNav } from "./helpers";

test.describe("Users", () => {
  test("ユーザー一覧と検索欄が表示される", async ({ page }) => {
    await page.goto("/");
    await openFromNav(page, "Users", "/users");

    await expect(page.getByRole("heading", { name: "Users", level: 1 })).toBeVisible();
    await expect(
      page.getByText("表示内容と各ドメインへの編集導線をまとめたディレクトリです。"),
    ).toBeVisible();
    await expect(page.getByLabel("ユーザー検索")).toBeVisible();

    const list = page.locator('section[aria-label="ユーザー一覧"]');
    await expect(list.getByText("John", { exact: true })).toBeVisible();
    await expect(list.getByText("Guest Reader", { exact: true })).toBeVisible();
    await expect(list.getByText("Archive User", { exact: true })).toBeVisible();
  });
});
