# 書籍ドメイン

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

### 3. 章メモ
読書中または読了後に、章単位で本の内容を記録するユーザー固有の情報。

例:
- 章タイトル
- 章の並び順
- メモ本文

章メモは `user_books_table` に紐づける。
書誌情報ではなく、ユーザーの理解や読書体験に属するため。

### 4. 説明アウトプット
ユーザーが本の内容を自分の言葉で説明するための文章。

例:
- アウトプットタイトル
- 説明本文

章メモは章ごとの断片的な記録、説明アウトプットは外部に説明できる形へまとめた記録として分ける。

## API 隠蔽の方針

### 方針
frontend から直接 `Google Books API` を呼ばない。
backend に「書籍検索 API」を作り、外部 API 呼び出しは backend 内部に閉じ込める。

### この形にする理由
- frontend が外部 API のレスポンス構造を知らなくてよい
- API の認証、レート制御、キャッシュを backend に寄せられる
- 別 API に差し替えるとき、backend の adapter だけ直せばよい

### 推奨構成
- `BookSearchAdapter` のような抽象を作る
- `GoogleBooksProvider` は adapter の実装のひとつにする
- `BookRepository` は DB 永続化だけを担当し、外部 API 検索を持たない
- `BookUseCase` が repository と adapter を受け取り、検索と保存のユースケースを組み立てる
- route は usecase の戻り値だけを見る

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

## 処理フロー

### 検索
1. frontend が `GET /books/search?q=...` を呼ぶ
2. backend が adapter 経由で外部 API を呼ぶ
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

### 章メモ記録
1. frontend が保存済みの読書本詳細を開く
2. ユーザーが章タイトル、章の並び順、メモ本文を入力する
3. frontend が `POST /user-books/:userBookId/chapter-memos` を呼ぶ
4. backend が `book_chapter_memos_table` に保存する

### 説明アウトプット
1. frontend が保存済みの読書本詳細を開く
2. ユーザーが説明タイトルと本文を入力する
3. frontend が `POST /user-books/:userBookId/outputs` を呼ぶ
4. backend が `book_outputs_table` に保存する

## repository/adapter の責務

### adapter
外部 API を叩いて、共通の検索結果型に変換する責務。

例:
- `searchBooks(query: string): Promise<BookSearchResult[]>`

### repository
DB に保存、取得、更新する責務。
外部 API は呼ばない。

例:
- `saveBook(...)`
- `saveUserBook(...)`
- `listUserBooks(...)`
- `updateUserBookProgress(...)`
- `createChapterMemo(...)`
- `listChapterMemos(...)`
- `createOutput(...)`
- `listOutputs(...)`

## BDD で固定する振る舞い

### 機能概要
- API から取得した書誌情報を本システムへ保存できる
- ユーザーごとに未読、読書中、読了を管理できる
- 読書中の本は現在ページを更新できる
- 章ごとにメモを残せる
- 本の内容を自分の言葉で説明するアウトプットを残せる

### 最終結果から見た振る舞い
- 検索時、backend は外部 API レスポンスを `BookSearchResult` に変換して返す
- 保存時、同一 `source` と `sourceBookId` の本は `books_table` で重複作成しない
- 同一ユーザーが同じ本を保存した場合、`user_books_table` の状態更新として扱う
- 進捗更新時、`status` と `currentPage` は独立して変更できる
- 章メモ作成時、空の章タイトルや空のメモ本文は受け付けない
- アウトプット作成時、空のタイトルや空の本文は受け付けない

### テスト仕様
- `searchBooks` は空文字を拒否し、trim 済み query で adapter を呼ぶ
- `createUserBook` は API 由来の本情報と読書状態を repository に渡す
- `updateUserBook` は読書状態と現在ページを更新できる
- `createChapterMemo` は `userBookId`、章タイトル、章順、本文を検証して保存する
- `createOutput` は `userBookId`、タイトル、本文を検証して保存する

## ディレクトリ分離

### `types`
ドメイン内で永続的に扱うエンティティや値だけを置く。

例:
- `Book`
- `UserBook`
- `ReadingStatus`
- `BookChapterMemo`
- `BookOutput`

### `commands`
ユースケース入力を置く。
画面や API payload と完全一致させるための DTO ではなく、usecase が受け取る命令として扱う。

例:
- `CreateUserBookInput`
- `UpdateUserBookInput`
- `CreateBookChapterMemoInput`
- `CreateBookOutputInput`

### `adapters`
外部 API や外部サービスとの境界を置く。
Google Books 固有のレスポンス構造は infrastructure 側で吸収し、BookDomain は adapter の共通型だけを見る。

例:
- `BookSearchAdapter`
- `BookSearchResult`

## 実装順

### Phase 1
- `books_table`
- `user_books_table`
- `GET /books/search`
- `POST /user-books`
- `GET /user-books`
- `PATCH /user-books/:userBookId`

### Phase 2
- `book_chapter_memos_table`
- `book_outputs_table`
- `GET /user-books/:userBookId/chapter-memos`
- `POST /user-books/:userBookId/chapter-memos`
- `PATCH /user-books/chapter-memos/:chapterMemoId`
- `GET /user-books/:userBookId/outputs`
- `POST /user-books/:userBookId/outputs`
- `PATCH /user-books/outputs/:bookOutputId`

### Phase 3
- adapter interface 抽出
- adapter 差し替え可能な構造へ整理

### Phase 4
- 必要になったら `user_book_techs_table` を追加

型・API の詳細は [Books 型定義](/docs/design/Books/Type/books_types)、[Books API](/docs/design/Books/API/books_api) を参照。
