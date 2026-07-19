# Books API

## 概要

書籍ドメインの HTTP API を定義する。

## エンドポイント一覧

| メソッド | パス | 説明 |
|----------|------|------|
| GET | `/books/search` | 書籍検索 |
| POST | `/user-books` | 読書本の保存 |
| GET | `/user-books` | 保存済み本一覧 |
| PATCH | `/user-books/:userBookId` | 読書状態の更新 |

## ステータス

設計中。詳細は [書籍ドメイン](/docs/design/Books/Domain/books_domain) を参照。
