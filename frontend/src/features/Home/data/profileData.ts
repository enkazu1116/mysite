import type { Profile } from "../types/profile";

export const profile: Profile = {
  name: "John",
  title: "Web Developer",
  avatarSrc: "/images/profile.svg",
  avatarAlt: "John のプロフィール写真",
  bio: [
    "はじめまして、John です。フロントエンドを中心に、ユーザーにとって使いやすい Web アプリケーションの開発に取り組んでいます。",
    "React / TypeScript を用いた UI 実装や、パフォーマンス・保守性を意識した設計が得意分野です。新しい技術のキャッチアップも積極的に行っています。",
    "趣味は読書と写真。週末はカメラを持って街を散歩することが多いです。このサイトではスキル・プロジェクト・読書記録などをまとめています。",
  ],
  calendarEvents: [
    { date: "2026-06-09", label: "ポートフォリオ更新" },
    { date: "2026-06-15", label: "技術勉強会" },
    { date: "2026-06-22", label: "読書会" },
  ],
};
