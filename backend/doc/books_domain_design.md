# Books Domain 設計メモ

## 目的
- フロントは本を検索できる
- 本の検索は backend 経由で行う
- backend が外部書籍 API を隠蔽する
- 外部 API を差し替えても frontend や永続化モデルに影響を広げない
- ユーザーごとの読書本データとして保存する
- 読書状態は `未読 / 読書中 / 読了` の 3 状態を持つ

## 最小構成の結論
- `books_table` は持つ
- `user_books_table` は持つ
- `user_book_skills_table` は持たない
- 本と技術詳細の多対多も、現時点では持たない

理由:
- 本の書誌情報と、ユーザーごとの読書状態は責務が違う
- スキルや技術詳細との関連は、今の段階では必須ではない
- 先に検索、保存、進捗更新を安定させる方が優先度が高い

## ドメインの分け方

### 1. 書誌情報
外部 API から得た、ユーザー共通の本情報。

例:
- タイトル
- 著者
- 出版社
- 出版日
- サムネイル
- 外部 API 上の本 ID

### 2. ユーザー読書本
そのユーザーが保存した本と、その進捗状態。

例:
- 未読 / 読書中 / 読了
- 現在ページ
- メモ
- 読み始め日時
- 読了日時

この分離により、同じ本を複数ユーザーが持てる。

## API 隠蔽の方針

### 方針
frontend から直接 `Google Books API` を呼ばない。
backend に「書籍検索 API」を作り、外部 API 呼び出しは backend 内部に閉じ込める。

### この形にする理由
- frontend が外部 API のレスポンス構造を知らなくてよい
- API の認証、レート制御、キャッシュを backend に寄せられる
- 別 API に差し替えるとき、backend の adapter だけ直せばよい

### 推奨構成
- `BookSearchProvider` のような抽象を作る
- `GoogleBooksProvider` はその実装のひとつにする
- route や service は provider interface の戻り値だけを見る

## 型設計

### 外部 API DTO
外部 API 専用の取得型。backend 内部でのみ使う。

```ts
type GoogleBookVolumeDto = {
  id: string;
  volumeInfo?: {
    title?: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
    industryIdentifiers?: Array<{
      type?: string;
      identifier?: string;
    }>;
    language?: string;
    infoLink?: string;
    previewLink?: string;
  };
};
```

### backend が frontend に返す検索結果型
外部 API に依存しない共通の検索結果型。

```ts
type BookSearchResult = {
  source: "google_books";
  sourceBookId: string;
  title: string;
  authors: string[];
  publisher: string | null;
  publishedDate: string | null;
  description: string | null;
  pageCount: number | null;
  thumbnailUrl: string | null;
  infoLink: string | null;
};
```

### 永続化用の書誌情報
DB 上の本マスタ。

```ts
type Book = {
  bookId: string;
  source: "google_books";
  sourceBookId: string;
  title: string;
  authorsJson: string;
  publisher: string | null;
  publishedDate: string | null;
  description: string | null;
  pageCount: number | null;
  thumbnailUrl: string | null;
  infoLink: string | null;
  createdAt: string;
  updatedAt: string;
};
```

### 永続化用のユーザー読書本

```ts
type ReadingStatus = "unread" | "reading" | "finished";

type UserBook = {
  userBookId: string;
  userId: string;
  bookId: string;
  status: ReadingStatus;
  currentPage: number | null;
  note: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
```

## DB スキーマ方針

### books_table
ユーザー共通の書誌情報を保持する。

カラム:
- `book_id`
- `source`
- `source_book_id`
- `title`
- `authors_json`
- `publisher`
- `published_date`
- `description`
- `page_count`
- `thumbnail_url`
- `info_link`
- `created_at`
- `updated_at`

制約:
- `unique(source, source_book_id)`

### user_books_table
ユーザーが保存した読書本データを保持する。

カラム:
- `user_book_id`
- `user_id`
- `book_id`
- `status`
- `current_page`
- `note`
- `started_at`
- `finished_at`
- `created_at`
- `updated_at`

制約:
- `unique(user_id, book_id)`

## なぜ中間テーブルを持たないか

### user_book_skills_table を入れない理由
- 今の要件では必須ではない
- 紐づく件数が多くない
- まずは読書管理を成立させる方が重要

### 技術詳細との多対多を今入れない理由
- 実際にどの単位で紐づけるかがまだ固まっていない
- `techs` なのか、別の `book_topics` なのかも未確定
- 先に入れると設計が引っ張られる

### 将来の拡張
必要になった時点で以下のどちらかを追加する。

- `user_book_techs_table`
- `user_book_topics_table`

## API 一覧

### 1. 書籍検索
`GET /books/search?q=keyword`

役割:
- backend が外部書籍 API を呼ぶ
- backend がレスポンスを正規化する
- frontend に `BookSearchResult[]` を返す

返却例:

```json
{
  "books": [
    {
      "source": "google_books",
      "sourceBookId": "abc123",
      "title": "Domain-Driven Design",
      "authors": ["Eric Evans"],
      "publisher": "Addison-Wesley",
      "publishedDate": "2003-08-30",
      "description": "...",
      "pageCount": 560,
      "thumbnailUrl": "https://...",
      "infoLink": "https://..."
    }
  ]
}
```

### 2. 読書本を保存
`POST /user-books`

入力:

```json
{
  "book": {
    "source": "google_books",
    "sourceBookId": "abc123",
    "title": "Domain-Driven Design",
    "authors": ["Eric Evans"],
    "publisher": "Addison-Wesley",
    "publishedDate": "2003-08-30",
    "description": "...",
    "pageCount": 560,
    "thumbnailUrl": "https://...",
    "infoLink": "https://..."
  },
  "status": "unread"
}
```

処理:
1. `books_table` を `source + source_book_id` で upsert
2. `user_books_table` を `user_id + book_id` で upsert

### 3. 保存済み本一覧
`GET /user-books`

クエリ候補:
- `status`
- `page`
- `sort=updated_at|created_at|published_date`

### 4. 読書状態更新
`PATCH /user-books/:userBookId`

更新対象:
- `status`
- `currentPage`
- `note`
- `startedAt`
- `finishedAt`

## 処理フロー

### 検索
1. frontend が `GET /books/search?q=...` を呼ぶ
2. backend が provider 経由で外部 API を呼ぶ
3. backend が共通型 `BookSearchResult` に変換する
4. frontend はその結果だけを使って描画する

### 保存
1. frontend で本を選択する
2. frontend が `POST /user-books` を呼ぶ
3. backend が `books_table` を upsert する
4. backend が `user_books_table` に読書本を保存する

### 進捗更新
1. frontend が保存済み一覧を取得する
2. ユーザーが読書状態やページ数を更新する
3. frontend が `PATCH /user-books/:userBookId` を呼ぶ
4. backend が `user_books_table` を更新する

## repository/provider の責務

### provider
外部 API を叩いて、共通の検索結果型に変換する責務。

例:
- `searchBooks(query: string): Promise<BookSearchResult[]>`

### repository
DB に保存、取得、更新する責務。

例:
- `saveBook(...)`
- `saveUserBook(...)`
- `listUserBooks(...)`
- `updateUserBookProgress(...)`

## この形の利点
- frontend は外部 API を知らない
- backend は provider を差し替えるだけで API 変更に対応しやすい
- DB は外部 API の生レスポンスに引っ張られない
- 読書管理の最小要件に集中できる

## 実装順

### Phase 1
- `books_table`
- `user_books_table`
- `GET /books/search`
- `POST /user-books`
- `GET /user-books`
- `PATCH /user-books/:userBookId`

### Phase 2
- provider interface 抽出
- `GoogleBooksProvider` 実装
- adapter 差し替え可能な構造へ整理

### Phase 3
- 必要になったら `user_book_techs_table` を追加

