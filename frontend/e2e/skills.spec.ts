import { expect, test } from "@playwright/test";
import { API_BASE, openFromNav } from "./helpers";

test.describe("Skills", () => {
  test("実 API からスキル画面が描画される", async ({ page, request }) => {
    const apiResponse = await request.get(`${API_BASE}/api/skills`);
    expect(apiResponse.ok()).toBeTruthy();
    const skills = (await apiResponse.json()) as unknown[];

    await page.goto("/");
    await openFromNav(page, "Skills", "/skills");

    await expect(page.getByRole("heading", { name: "Skills", level: 1 })).toBeVisible();
    await expect(page.getByText("使っている言語と経験の一覧です。")).toBeVisible();

    if (skills.length === 0) {
      await expect(page.getByText("スキルが見つかりません。")).toBeVisible({
        timeout: 15_000,
      });
      return;
    }

    const table = page.getByRole("grid", { name: "My Skills" });
    await expect(table).toBeVisible({ timeout: 15_000 });
  });
});
