import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(dirname, "../backend");
const isCi = Boolean(process.env.CI);

/**
 * E2E: Frontend (MSW なし) + Backend (Infisical / CI では注入済み env)
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  workers: 1,
  reporter: "html",
  timeout: 60_000,
  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: isCi
        ? "bash -lc 'bun run db:ensure-skills && bun run start'"
        : "infisical run -- bash -lc 'bun run db:ensure-skills && bun run start'",
      cwd: backendDir,
      url: "http://127.0.0.1:3000/health",
      reuseExistingServer: !isCi,
      timeout: 180_000,
    },
    {
      command: "pnpm exec vite --host 127.0.0.1 --port 5173",
      url: "http://127.0.0.1:5173",
      reuseExistingServer: !isCi,
      timeout: 120_000,
      env: {
        ...process.env,
        VITE_E2E: "1",
      },
    },
  ],
});
