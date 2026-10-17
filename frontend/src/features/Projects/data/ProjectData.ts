import type { Project } from "../types/project";

export const projects: Project[] = [
  {
    projectId: "018f2f57-3f58-7c8f-9b7e-9b75b7298d40",
    userId: "018f2f57-3f58-7c8f-9b7e-9b75b7298d2f",
    projectName: "Portfolio Site",
    overview: "個人ポートフォリオサイトの構築",
    myRole: "フルスタック開発",
    teamSize: 1,
    technologies: "TypeScript / React / Hono / Turso",
    challenges: "ドメイン設計と実装の両立",
    decisions: "Books パターンに揃えた層構成を採用",
    outcomes: "プロジェクト CRUD と公開ページを整備",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    projectId: "018f2f57-3f58-7c8f-9b7e-9b75b7298d41",
    userId: "018f2f57-3f58-7c8f-9b7e-9b75b7298d2f",
    projectName: "Reading Tracker",
    overview: "読書記録と章メモの管理",
    myRole: "Backend 開発",
    teamSize: 2,
    technologies: "Bun / Hono / Drizzle / Google Books API",
    challenges: "外部 API とローカルカタログの整合",
    decisions: "検索結果をカタログへ正規化して保存",
    outcomes: "読書ステータスとメモ運用を実現",
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
];
