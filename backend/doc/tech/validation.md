# validation
## TSでのバリデーションと型
まずTypescriptにおける型とは、TypeSriptからJavaScriptへ変換するときにだけ存在する。
つまり、`type`, `interface`, `implements`...などはトランスパイルされると、消えるとのこと。

**ポイント**
動的型付け言語も型は存在する。
実行時に型が付与される。
`typeof`はランタイム時の型を取り出す機能。

### `typeof`について
JavaScriptとTypeScriptの`type of`は異なる。

#### JavaScript
`typeof`を実行時に型名を文字列として返す

```JavaScript
const t = 1;
console.log(typeof t);  // => "number"という文字列
type T = typeof t;      // => TypeScriptの型としての`number`
```

#### TypeScript
コンパイル時に型そのものを返す

```TypeScript
const add = (a: number, b: number): number => 1;
type AddType = typeof add; //-> (a: number, b: number) => `number`;
```

### 値バリデーションと型推論
ランタイム上では、型は消えているので
実際にユーザーが入力した値や外部から渡されるデータの検証が行えない。
ただし、値から型を推論することができるので、スキーマを組み立ててその推論から型を取り出せる。

### バリデーションライブラリ
- zod
- jsonschema: ajv...など
- openapi
- parseArgs: CLI引数のバリデータ
- Arktype: 新しめのライブラリ
- yup

### 採用ライブラリ
**zod**
TypesScriptのバリデーションライブラリ
事前に定義したスキーマからバリデーションを行うことができる。
[公式](https://zod.dev/)

#### 採用理由
1. 調査したところ、一番使用されている。
そのため、トラブルシューティングを調べて容易に行えることが見込める点
2. Arktypeと比較された記事を見ると、バンドルサイズでArktypeにはあったが
約10KBの差であり、カスタマイズ性の点ではzodのほうがやりやすい。
3. エコシステムとの統合がしやすい。
[参考](https://qiita.com/kskwtnk/items/43018176032a3ed89410)

## 参考サイト
[参考記事](https://zenn.dev/mizchi/articles/typescript-type-value-validation)
