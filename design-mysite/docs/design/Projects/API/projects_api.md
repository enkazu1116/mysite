# Projects API

## 概要

プロジェクトドメインの HTTP API を定義する。

## エンドポイント一覧

| メソッド | パス | 説明 |
|----------|------|------|
| GET | `/api/projects?userId=` | プロジェクト一覧（`userId` 任意フィルタ） |
| POST | `/api/projects` | プロジェクト作成 |
| GET | `/api/projects/:projectId` | プロジェクト詳細 |
| PATCH | `/api/projects/:projectId` | プロジェクト部分更新 |
| DELETE | `/api/projects/:projectId` | プロジェクト削除 |

## レスポンス形状

- 一覧: `{ projects: Project[] }`
- 単体: `{ project: Project }`
