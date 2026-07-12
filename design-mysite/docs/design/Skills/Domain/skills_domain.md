# スキルドメイン

## スコープ

| 含む | 含まない（現時点） |
|------|-------------------|
| スキル一覧・詳細の取得 | スキル認定・外部連携 |
| ページング・ソート付き GET API | 管理 API（認証付き更新） |

## 主要エンティティ

- **Skill**: 言語、技術詳細（Tech）、経験月数、レベル、説明文
- **SkillLevel**: スキルレベルの区分（Union Type）
- **Tech**: 技術詳細の区分

実装の型定義は `backend/src/features/skills/types/` を参照。

## ステータス

設計中。型・API の詳細は [Skills 型定義](/docs/design/Skills/Type/skills_types)、[Skills API](/docs/design/Skills/API/skills_api) を参照。
