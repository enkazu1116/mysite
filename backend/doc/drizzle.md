# Drizzle ORMの環境構築
今回はTursoを使用する。

## インストール
```zsh
bun add drizzle-orm @libsql/client dotenv
bun add -D drizzle-kit tsx
```

## 環境変数の設定
.envファイルにTursoのトークンとURLを記載する。

## ORMをデータベースに接続する
環境変数を読み込むオブジェクトを作成
### Drizzleの設定ファイルを用意
`drizzle.config.ts`を用意
out: マイグレーションや生成するファイルの出力先
schema: テーブル定義をしたファイルの配置場所
dialect: DB種類
dbCredentials: DBの接続情報

**エラーの対処**
`dbCredentials`を公式通り記載しても、コンパイルエラーとなりました。
以下の記事を参考にしてみると、型が一致してエラーを解消することができました。

*そもそもの原因*
公式通り記載すると、`string | undefined`だったため、要求している`string`にあっていないためでした。
そこで、記事を参考にすると`|| ""`で`string`に確定したので解消ができました。
[参考記事](https://memory-lovers.blog/entry/2024/12/25/064610)

## スキーマの定義
上記で定義したファイル配置場所にスキーマを定義する。
その後、コマンドを実行することでDBに適用してくれる。
```zsh
npx drizzle-kit push
```
