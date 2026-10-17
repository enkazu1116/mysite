import { expect, test } from "@playwright/test";
import { API_BASE, openFromNav } from "./helpers";

test.describe("Projects", () => {
  test("実 API からプロジェクト画面が描画される", async ({ page, request }) => {
    const apiResponse = await request.get(`${API_BASE}/api/projects`);
    expect(apiResponse.ok()).toBeTruthy();
    const body = (await apiResponse.json()) as { projects: unknown[] };

    await page.goto("/");
    await openFromNav(page, "Projects", "/projects");

    await expect(
      page.getByRole("heading", { name: "Projects", level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByText("関わった仕事の記録です。概要・役割・課題・成果をまとめています。"),
    ).toBeVisible();

    if (body.projects.length === 0) {
      await expect(page.getByText("プロジェクトがありません。")).toBeVisible({
        timeout: 15_000,
      });
      return;
    }

    await expect(page.getByText("プロジェクト詳細").first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
