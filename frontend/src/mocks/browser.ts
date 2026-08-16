import { setupWorker } from "msw/browser";
import { handlers as skillsHandlers } from "../features/Skills/api/mock/handler";
import { booksHandlers } from "../test/handlers";

/**
 * 開発 / Playwright E2E 用のブラウザ MSW。
 * Skills と Books API をモックし、ローカルで BE なしでも画面を確認できるようにする。
 */
export const worker = setupWorker(...skillsHandlers, ...booksHandlers);
