# ユーザーテーブル
## 概要
システム開発者の自己紹介/ブログとしての使用用途のため、ユーザーはシステム開発者のみ。
ユーザーテーブルを作成する目的
- プロフィール
- 自己紹介文
- 技術スキル
- 参画プロジェクト
以上を簡単に運用管理するためのコアテーブルとするため。

## テーブル設計
### カラム
| 物理名 | 論理名 | 主キー | 外部キー | 制約 | 型 | 備考 |
| --- | --- | --- | --- | --- | --- | --- |
| user_iD | ユーザーID | ⚪︎ |  | Not Null, Unique | UUIDv7 |  |
| user_name | ユーザー名 |  |  | Not Null, Unique | varchar(20) | 名前をカスタマイズしたい場合を考慮 |
| profile | プロフィール | | | | TEXT | |
| created_at | 作成日時 | | | | Not Null | TEXT or Custom Types(Date) | SQLiteで自作する |
| updated_at | 更新日時 | | | | Not Null | TEXT or Custom Types(Date) | SQLiteで自作する |

### custome type定義
uuidと日付型はSQLiteベースのDBにはない。そのためDB上はTEXTで保存する。
ただし、Typescirpt上ではDrizzleのCustom Typesを用いて型定義を独自に実装する。
