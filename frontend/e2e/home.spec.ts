import { expect, test } from "@playwright/test";

test.describe("home smoke", () => {
  test("トップページが表示される", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/frontend/i);
    await expect(page.getByRole("heading", { name: "Home", level: 1 })).toBeVisible();

    const nav = page.getByRole("navigation", { name: "メインナビゲーション" });
    await expect(nav).toBeVisible();
    await expect(nav.getByText("Books", { exact: true })).toBeVisible();
  });
});
