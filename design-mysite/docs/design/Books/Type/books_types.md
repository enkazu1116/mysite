# Books 型定義

## 概要

書籍ドメインで使用する Type・Interface を定義する。

## 型一覧

| 型名 | 種別 | 説明 |
|------|------|------|
| BookSearchResult | type | 検索結果（外部 API 非依存） |
| Book | type | 書誌情報（DB 永続化用） |
| UserBook | type | ユーザー読書本 |
| ReadingStatus | type | 読書状態（`unread` / `reading` / `finished`） |
| BookInput | type | 作成・更新時の入力 |

## ステータス

設計中。詳細は [書籍ドメイン](/docs/design/Books/Domain/books_domain) を参照。
