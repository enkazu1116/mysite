# 1. 書籍管理

## 目的

- フロントは本を検索できる
- 本の検索は backend 経由で行う
- backend が外部書籍 API を隠蔽する
- ユーザーごとの読書本データとして保存する
- 読書状態は `未読 / 読書中 / 読了` の 3 状態を持つ

## DB設計

テーブル定義の詳細は [書籍テーブル](/docs/design/Books/DB/books) を参照。

## 画面設計

画面設計は、コンポーネント設計で何を作るかのみ記載する。
デザインや画面構成は記載しない。
詳細は [書籍管理画面](/docs/design/Books/UI/books_screen)を参照。

## ドメイン設計

ドメイン定義の詳細は [書籍ドメイン](/docs/design/Books/Domain/books_domain)を参照。

## 型設計

型定義は、Type・Interfaceから構築する。
型での表現にこだわり、良いコードの土台を構築することを目的とする。
型定義の詳細は [Books 型定義](/docs/design/Books/Type/books_types)を参照。

## API設計

API定義の詳細は [Books API](/docs/design/Books/API/books_api)を参照。
