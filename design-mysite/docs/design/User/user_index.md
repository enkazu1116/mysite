# 1. ユーザー管理
## 目的
ユーザーは、基本的に管理者のみを想定。
将来的にはゲストユーザーでの体験版を作成を検討する。

ユーザードメインの責務:

- プロフィール情報の管理
- GitHub・LinkedIn連携
- 他ドメインへの参照

## DB設計
テーブル定義の詳細は [ユーザーテーブル](/docs/design/User/DB/user) を参照。

## 画面設計
画面設計は、コンポーネント設計で何を作るかのみ記載する。
デザインや画面構成は記載しない。
詳細は [ユーザー管理画面](/docs/design/User/UI/user_screen)を参照。

## ドメイン設計
ドメイン定義の詳細は [ユーザードメイン](/docs/design/User/Domain/user_domain)を参照。

## 型設計
型定義は、Type・Interfaceから構築する。
型での表現にこだわり、良いコードの土台を構築することを目的とする。
型定義の詳細は [User型定義](/docs/design/User/Type/user_types)を参照。

## API設計
API定義の詳細は [User API](/docs/design/User/API/user_api)を参照。