# Turso環境構築
## CLIの用意
```zsh
brew install tursodatabase/tap/turso
turso auth signup
```

## データベースの作成
```zsh
turso db create mysite
== 実行結果 ==
Created database mysite at group default in 1.205s.
Start an interactive SQL shell with:
   turso db shell mysite

To see information about the database, including a connection URL, run:
   turso db show mysite

To get an authentication token for the database, run:
   turso db tokens create mysite
```
[ダッシュボードから確認](https://turso.tech)

## 環境変数の取得
1. トークンの取得
```zsh
turso db tokens create mysite
```

2. URLの取得
ダッシュボードからURLをコピーする

3. .envに記載して、.gitignoreに追加
