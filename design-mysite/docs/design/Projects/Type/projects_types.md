# Projects 型定義

## 概要

プロジェクトドメインで使用する Type・Interface を定義する。

## 型一覧

| 型名 | 種別 | 説明 |
|------|------|------|
| Project | type | プロジェクト本体 |
| CreateProjectInput | type | 作成時の入力 |
| UpdateProjectInput | type | 部分更新時の入力 |
| ListProjectsInput | type | 一覧取得時の入力（userId 任意） |
| ProjectRepository | interface | 永続化の境界 |

## ステータス

実装済み。詳細は `backend/src/features/projects/` を参照。
