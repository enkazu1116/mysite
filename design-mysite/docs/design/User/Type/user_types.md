# User 型定義

## 概要

ユーザードメインで使用する Type・Interface を定義する。  
方針は 
[metadata](/docs/tech/Types/metadata)・
[UUID](/docs/tech/Types/uuid)・
[Date / Temporal](/docs/tech/Types/Date) に従う。<br />
ドメインモデルは `interface` で定義し、拡張性を持たせる。共通定義には型合成で定義する。

## 型一覧

| 型名 | 種別 | 説明 |
|------|------|------|
| UUID | branded type | 全体で共通で使用するブランド型 |
| AuditMetadata | interface | 共通で使用するシステムメタデータ |
| UserCore | interface | ユーザーエンティティのみで構成 |
| UserRow | interface | DB 永続化用。`UserCore` + `AuditMetadata`（テーブル1行に対応） |
| CreateUserRequest | interface | 作成時リクエスト |
| UpdateUserRequest | interface | 更新時リクエスト |

## フィールド対応

| Domain / DB | TypeScript | 備考 |
|-------------|------------|------|
| user_id | `id: UUID` | ブランド型。生成は usecase / repository 側 |
| user_name | `name: string` | 1〜30 文字。境界で trim + max |
| bio | `bio: string \| null` | 未設定は `null`。設定時は 200 文字以内 |
| icon_url | `iconUrl: string \| null` | 未設定は `null`。実体ではなく参照文字列 |
| github_url | `githubUrl: string \| null` | 未設定は `null`。プロフィール参照用 URL |
| article_url | `articleUrl: string \| null` | 未設定は `null`。記事サイト参照用 URL |
| created_at | `createdAt: Temporal.Instant` | `AuditMetadata` |
| updated_at | `updatedAt: Temporal.Instant` | `AuditMetadata` |

## バリデーション（境界）

| フィールド | ルール |
|------------|--------|
| name | 必須。30 文字以内。 |
| bio | 任意。200 文字以内。 |
| iconUrl | 任意。空文字は `null` 変換 |
| githubUrl | 任意。空文字は `null` 変換 |
| articleUrl | 任意。空文字は `null` 変換 |
