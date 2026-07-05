# metadata
## Issue
ユーザー型に対して、メタ情報もフィールドに含めたい。
そのままフィールド定義をして良いのか、それとも他方法があるのか調査をする必要がある。

### 調査1
デコレータを使用して、メタ情報を付与する共通機能を実装するのが良さそうである。
**デコレータとは**
クラスやメソッド、プロパティなどに機能を後付けできる構文

### 調査2
`Omit<T, Keys>`の使用パターン
**Omitとは**
オブジェクトの型TからKeysで指定したプロパティを除いたobject型を返すユーティリティ型

### 調査3
Omitだと複雑な型定義をした場合に、把握するのに苦労する可能性がある。
また、satisficeでタイポを防げるかと思ったが演算子だったのでできないことがわかり、
タイポミスを防ぐ方法がない場合だと、微妙に感じた。

型合成があることを知り、そちらを採用する。

### 調査4
型合成でも、問題はないがInterfaceの方が拡張性に富んでいる。
宣言マージによる拡張がバージョンに合わせて必要なインターフェースだけを採用できるので、柔軟性もあり
メリットが大きいため変更する。

## 結論
**6月1日**
型定義は調査2の方法で実践する。
関数には調査1の方法、つまりはデコレータを使用してメタ情報を付与するようにする。

**6月3日**
調査2の方法は、複雑な型定義時に懸念があるため不採用とする。
型合成のほうがシンプルな使用方法でわかりやすいためそちらを採用する。

**6月5日**
Interfaceの方がtypeによる宣言よりも拡張性と柔軟性に富んでいるため、
Interfaceを採用する。

## 参考サイト
[参考1](https://qiita.com/softbase/items/bff4989aebc8f12ad392)
[デコレータ2](https://qiita.com/taqm/items/4bfd26dfa1f9610128bc)
[参考2](https://tech.kentem.jp/entry/2026/01/12/090000)
[Omit](https://typescriptbook.jp/reference/type-reuse/utility-types/omit)
[型合成](https://typescriptbook.jp/reference/values-types-variables/intersection)
[Interface](https://typescriptbook.jp/reference/object-oriented/interface/open-ended-and-declaration-merging)
[型の理解](https://zenn.dev/mizchi/articles/typescript-type-value-validation)
[型定義](https://zenn.dev/toms74209200/articles/semantic-type-is-meaningless)