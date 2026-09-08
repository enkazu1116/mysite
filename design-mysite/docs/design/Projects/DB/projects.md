# プロジェクトテーブル

## 概要

プロジェクトドメインのテーブル定義。ユーザーに紐づく参画プロジェクトを保持する。

使用技術は `techs_table` とは紐づけず、自由記述テキストとして持つ。

## テーブル設計

### projects_table

| 物理名 | 論理名 | 主キー | 外部キー | 制約 | 型 | 備考 |
| --- | --- | --- | --- | --- | --- | --- |
| project_id | プロジェクトID | ⚪︎ |  | Not Null | UUIDv7 | DB上はTEXT |
| user_id | ユーザーID |  | users_table.user_id | Not Null | UUIDv7 |  |
| project_name | プロジェクト名 |  |  | Not Null | TEXT |  |
| overview | 概要 |  |  | Not Null | TEXT |  |
| my_role | 自分の役割 |  |  | Not Null | TEXT |  |
| team_size | チーム規模 |  |  | Not Null | INTEGER | 人数（正の整数） |
| technologies | 使用技術 |  |  | Not Null | TEXT | 自由記述 |
| challenges | 課題 |  |  | Not Null | TEXT |  |
| decisions | 工夫 / 意思決定 |  |  | Not Null | TEXT |  |
| outcomes | 成果 |  |  | Not Null | TEXT |  |
| created_at | 作成日時 |  |  | Not Null | TEXT | Drizzle Custom Type |
| updated_at | 更新日時 |  |  | Not Null | TEXT | Drizzle Custom Type |
