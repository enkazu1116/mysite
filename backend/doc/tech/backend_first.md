# バックエンドファースト実装方針

## 目的

- React 側で感じている TypeScript の不足を、**バックエンドで「境界の型」から補う**
- 自己紹介サイトを **静的なページ** ではなく **自分専用のミニ CMS + 公開 API** として運用する
- Hono / Bun / Drizzle を使い、**モダン TS・import/export・レイヤー設計** を実践で身につける

## 北極星

> **ポートフォリオをコードで運用するバックエンド**

| 利用者 | 役割 |
|--------|------|
| 訪問者 | 読み取り専用 API（Skills / Projects / Books） |
| 本人 | 管理 API（認証付きで更新） |
| 将来 | GitHub 連携・読書ログなど外部と同期する機能 |

CRUD は土台。**検索・ページング・認可・状態遷移・キャッシュ・観測** が本体と捉える。

---

## なぜバックエンドから TS を学ぶか

React では `useState` の推論、`children`、イベント型、ライブラリのジェネリクスが同時に来て、  
「TS の本質」と「React 固有」が分かりにくい。

バックエンドは **リクエスト → 処理 → レスポンス** だけに集中できる。

| バックエンドで鍛えること | React に戻ったとき |
|--------------------------|---------------------|
| Zod + `z.infer` | フォーム・API 型の共有 |
| 判別可能ユニオン（draft / published） | 状態に応じた UI 分岐 |
| レイヤー分離と import ルール | features 配下の import 整理 |
| リポジトリ / トランザクション | 非同期・エラー処理の整理 |

**リズム:** バックエンド 2 ステップ → フロント 1 画面、で定着させる。

---

## import / export の基本

### イメージ

1 ファイル = 1 箱。**export** は外に渡す扉、**import** は他の箱の扉を使うこと。  
export していない変数・関数は、他ファイルから参照できない。

```
schema/skills.ts  --export-->  skillsTable
       ↑ import
repositories/skillRepository.ts  --export-->  listSkills
       ↑ import
routes/skills.ts  --export-->  skillsRoute
       ↑ import
app.ts → index.ts
```

### 2 種類

| 書き方 | 意味 | このプロジェクトでの使い分け |
|--------|------|------------------------------|
| `export default X` | ファイルの主役 1 つ | `db.ts` の DB 接続 |
| `export const foo` / `export function foo` | 名前付きで複数 | ルート、Zod スキーマ、リポジトリ関数、テーブル定義 |

```typescript
// default
import db from "../infrastructure/drizzle/db";

// 名前付き
import { skillsTable } from "../infrastructure/drizzle/schema";
import { listSkills } from "../repositories/skillRepository";

// 型だけ（実行時に消える）
import type { SkillResponse } from "../schemas/skill";
```

### 相対パス

| 記法 | 意味 |
|------|------|
| `"./foo"` | 同じフォルダの `foo.ts` |
| `"../foo"` | 1 つ上のフォルダの `foo.ts` |
| `"drizzle-orm/..."` | `node_modules`（自作ファイルではない） |

### よくあるエラー

| 症状 | 原因 |
|------|------|
| `has no exported member` | export していない / 名前の typo |
| default が見つからない | `import { db }` と書いたが `export default` だった |
| 循環参照 | A が B を、B が A を import している |

**対策:** 迷ったら IDE の「定義へ移動」。それでも難しければ **1 ファイルに戻して動かす → 動く部分だけ export で切り出す**。

---

## フォルダ構成（目標）

現状の `infrastructure/drizzle/` を基盤に、段階的に足す。

```
backend/src/
├── index.ts                 # 起動のみ（app を serve）
├── app.ts                   # Hono 生成 + ルート登録のみ
│
├── routes/                  # HTTP（URL・ステータス・JSON）
│   ├── skills.ts
│   └── admin/
│       └── skills.ts
│
├── schemas/                 # Zod（リクエスト/レスポンス）
│   ├── common.ts            # エラー形式など
│   └── skill.ts
│
├── repositories/            # DB アクセス（Drizzle のみ）
│   └── skillRepository.ts
│
├── middleware/              # 認証など（後から）
│   └── auth.ts
│
└── infrastructure/
    └── drizzle/
        ├── db.ts            # export default db
        ├── schema/
        │   ├── index.ts     # テーブルを re-export
        │   ├── users.ts
        │   └── skills.ts
        └── types/
            ├── uuid.ts
            └── isoDateTime.ts
```

### 最初の 1〜2 週間（簡略版）

理解優先なら、次でもよい。

```
routes/skills.ts     # 一時的に Zod + DB クエリもここに書く
infrastructure/      # 既存のまま
```

動いたら `repositories/skillRepository.ts` に DB 部分だけ切り出す。

---

## import の向き（最重要ルール）

```
routes        →  schemas, repositories, middleware
repositories  →  infrastructure (db, schema)
schemas       →  基本どこにも依存しない
infrastructure → 外部パッケージのみ
app.ts        →  routes のみ
index.ts      →  app のみ
```

**禁止**

- `repositories` が `routes` を import する
- `schema` が `routes` を import する
- `infrastructure` が `routes` / `repositories` を import する

下の層は上の層を知らない。これで「どこに何を書くか」が決まる。

---

## export / import のプロジェクトルール

1. **テーブル定義** … `export const xxxTable`（名前付き）。default は使わない
2. **DB 接続** … `db.ts` のみ `export default db`
3. **API ルート** … `export const skillsRoute = new Hono()`
4. **型** … `export type` / `import type` で関数と分ける
5. **schema/index.ts** … 窓口として `export * from "./skills"` 等でまとめる（慣れたら明示 export に変更可）

---

## 機能を足すときの手順（テンプレート）

例: **Skills GET（ページング）**

| 順 | ファイル | export するもの | import 元の例 |
|----|----------|-----------------|---------------|
| 1 | `schema/skills.ts` | `skillsTable` | `types/uuid`, `isoDateTime` |
| 2 | `schema/index.ts` | テーブル一式 | 各テーブルファイル |
| 3 | `schemas/skill.ts` | `SkillQuerySchema`, `SkillResponse` 型 | `zod` |
| 4 | `repositories/skillRepository.ts` | `listSkills` | `db`, `skillsTable` |
| 5 | `routes/skills.ts` | `skillsRoute` | repository, schemas |
| 6 | `app.ts` | `app` | `skillsRoute` |
| 7 | migration | `bun run db:generate` → `db:migrate` | — |

**エンドポイント例**

```
GET /api/v1/skills?page=1&limit=10&sort=level:desc
```

**完了条件**

- [ ] Zod で query 検証
- [ ] 統一エラーレスポンス
- [ ] フロントの MSW を切り、実 API に接続
- [ ] README または doc に curl 例を記載

---

## 学習ロードマップ

| 週 | やること | 増やす主なファイル | TS / module のテーマ |
|----|----------|-------------------|----------------------|
| 0 | Zod 導入、エラー JSON 統一 | `schemas/common.ts` | 名前付き export、`import type` |
| 1 | Skills GET + ページング + FE 接続 | `schema/skills.ts`, `routes/skills.ts` | default vs 名前付き、相対パス |
| 1 末 | DB クエリ切り出し | `repositories/skillRepository.ts` | 関数の export、import 先の付け替え |
| 2 | admin CRUD + 認証 | `routes/admin/`, `middleware/auth.ts` | ミドルウェア、Context の Variables |
| 3 | draft / publish | `schemas/skill.ts` 拡張 | 判別可能ユニオン、網羅的 switch |
| 4 | GitHub キャッシュ **または** Books 読書ログ | `infrastructure/github/` 等 | `unknown` と型ガード、キャッシュ |
| 並行 | Bun test | `*.test.ts` | `app.request()`、fixture 型 |

### フェーズ詳細

#### フェーズ 1 — フロントとつなぐ

- Skills API を Turso + Drizzle で実装
- ページング・ソート・検索（query）
- フロントの Pagination UI を活かす

#### フェーズ 2 — 管理 CMS

- 公開 GET / 管理 POST・PATCH・DELETE の分離
- API Key または JWT（最初は API Key でよい）
- 監査ログ（任意）

#### フェーズ 3 — コンテンツのライフサイクル

- `status: draft | published`
- 公開 API は published のみ
- 不正な状態遷移は 409

#### フェーズ 4 — 外部連携（面白さ）

いずれか 1 本を選ぶ。

| テーマ | 内容 |
|--------|------|
| Developer Dashboard | GitHub API + DB キャッシュ（TTL） |
| Reading Tracker | 外部書籍 API + 自分の棚・メモ・タグ |

#### フェーズ 5 — 品質

- `app.request()` 統合テスト
- OpenAPI / 型共有（任意）
- `/health`, `/ready`、リクエスト ID ログ

---

## フロントエンドとの対応

フロントも同じ import ルールに揃える。

```
features/Skills/
  types/skill.ts           → export type Skill
  api/fetchSkills.ts       → import type + export const fetchSkills
  hooks/useSkillsQuery.ts  → import { fetchSkills }
  skills.tsx               → import hook のみ
```

`api` が `skills.tsx` を import しない（バックエンドと同じ「下から上へ」）。

| BE 完了後 | FE でやること |
|-----------|---------------|
| 週 1 | `fetchSkills` の戻り値を API 型に合わせる |
| 週 2 | 管理用フォーム 1 画面 |
| 週 3 | draft 一覧 UI |

---

## 1 週間の進め方（スプリント）

| 曜日 | 作業 |
|------|------|
| 月〜火 | スキーマ + migration + 1 エンドポイント |
| 水 | Zod + エラー形式 + curl 確認 |
| 木 | フロント接続（1 画面） |
| 金 | この doc か `api_study.md` に「今週覚えた型」をメモ |

**メモ例**

- 今週: `z.infer<typeof SkillQuerySchema>`
- 来週: `Context<{ Variables: { role: 'admin' } }>`

---

## やらないこと

- 全 CRUD を一度に作る（Create だけ、など分割する）
- 最初から認証を完璧にする（Skills GET が動いてから admin）
- マイクロサービス化（1 リポジトリの Hono で十分）
- 動く前に完璧なフォルダ分割（**動く → 切り出す → import を直す**）

---

## 困ったとき

1. エラーのファイル・行を開く
2. export 元で `export` / `export default` を確認
3. import の `{}` とパス `./` `../` を照合
4. 「定義へ移動」で飛べるか確認
5. 1 ファイルに戻して動かし、export で再分割

---

## 関連ドキュメント

- [Drizzle 環境構築](./drizzle.md)
- [Turso 環境構築](./turso.md)
- [ユーザーテーブル設計](../db/user.md)
- フロント: `frontend/doc/api_study.md`

---

## 最初のスプリント（推奨）

**Skills GET + ページング** から始める。

理由:

1. フロントが既に `/api/skills` を待っている
2. ファイル 4〜5 個で import の練習量がちょうどよい
3. 1 週間でブラウザに表示される成功体験が得られる

次の拡張の優先度:

1. リポジトリ切り出し
2. admin 認証 + Skills 更新
3. draft / publish
4. GitHub キャッシュ **または** Books（好みで 1 本）
