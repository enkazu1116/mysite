# ユーザーテーブル
## 概要
システム開発者の自己紹介/ブログとしての使用用途のため、ユーザーはシステム開発者のみ。
ユーザーテーブルを作成する目的:
- ユーザー名
- 自己紹介文（bio）
- アイコン（icon_url）

以上を簡単に運用管理するためのコアテーブルとする。
技術スキル・参画プロジェクト・書籍などは他ドメインの責務とし、本テーブルには持たない。

`icon_url` は画像実体ではなく参照のみを持つ。初期は `public/asset` 配下のパス、将来はオブジェクトストレージの URL を同じカラムに保存する。NULL のときはアプリ側でデフォルト画像を使う。

## テーブル設計
### カラム
| 物理名 | 論理名 | 主キー | 外部キー | 制約 | 型 | 備考 |
| --- | --- | --- | --- | --- | --- | --- |
| user_id | ユーザーID | ⚪︎ |  | Not Null | UUIDv7 | DB上はTEXT<br />Drizzle Custom Type(UUID) | 
| user_name | ユーザー名 |  |  | Not Null, Unique | varchar(30) |  |
| bio | 自己紹介文 |  |  |  | TEXT | アプリ側で200文字以内 |
| icon_url | アイコン参照 |  |  |  | TEXT | NULL可|
| github_url | GitHubのURL参照 | | | TEXT | NULL可 |
| article_url | 記事サイトのURL参照 | | | TEXT | NULL可 |
| created_at | 作成日時 |  |  | Not Null | TEXT | Drizzle Custom Type(Date) |
| updated_at | 更新日時 |  |  | Not Null | TEXT | Drizzle Custom Type(Date) |

### custom type定義
uuidと日付型はSQLiteベースのDBにはない。そのためDB上はTEXTで保存する。<br />
ただし、TypeScript上ではDrizzleのCustom Typesを用いて型定義を独自に実装する。
