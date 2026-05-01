# Table作成
## 概要
ReactでのテーブルUIを作成し、データ一覧表を実現する。

### 使用技術
Tanstack Table

### 選定理由
選定候補としては、`Tanstack Table`と`Material React Table`が候補としてありました。
両者を調べると
- `Tanstack Table`は`React Table v7`からの後継である。
- `Material React Table`は`MUI`と`Tanstack Table`の二つを合わせて作られている
以上のことがわかりました。

`Tanstack Table`でどのようにReactではTableを作成できるのかを試してみたいということもあり、
こちらを採用する。

### 実装手順
#### テーブルUIの実装
ひとまず、固定長配列でハードコーディングされたデータを使用してテーブルUIを実装しました。
1. `createColumnHelper()`を用いて列の定義
2. `useReactTable`というフックを使用して、インスタンスを生成
3. 生成したインスタンスでJSXでHTMLテーブルのレンダリング

ここまでは**参考記事1**を参考に簡単に実現ができた。
CSSが何も適用されていない状態になるので、AIにプロンプトを投げて体裁を整える。

#### ページネーションの実装
テーブルUIであればページネーションも実装をしたかったので、**参考記事３**を参考に
ページネーションコンポーネントを実装しました。
1. `useReactTabel`に`Pagination`の設定を追加する。 
2. Paginationコンポーネントを実装

[参考記事1](https://qiita.com/oga_aiichiro/items/5b56d14da58d759804ed)
[参考記事2](https://zenn.dev/tocat/articles/c55aea8fc72f96)
[参考記事3](https://zenn.dev/cocomina/books/tanstack-table/viewer/pagination-client)

## APIからデータを取得し、そのデータをテーブルに出力
### Mock Service Worker
現在時点でAPIの作成は行なっておらず、フロントエンドの実装に一度集中したいと考えたため
モックで簡単にAPI連携できないか調査したところ、ちょうど良いライブラリがあったため使用しました。

#### 選定理由
Reactでのモックについて調査をしたところ、記事が多かったのが`Mock Service Worker`でした。
また他に`Axios Mock Adapter`での実装もありました。
- 記事の更新日時が比較的に`Mock Service Worker`の方が新しく、記事数が多い
- 手軽に実装が可能なこと
- **参考記事１**を参照すると、将来的に運用で不便な面を解消できることがわかっている点
以上の観点から、将来的な運用においてもカスタマイズすることで課題解決が望めることから採用しました。
※今回は未実装

#### 実装上の注意点1
主に参考記事2を参考に実装しましたが、`rest`をインポートしてもコンパイルエラーとなっており、
原因を調査したところ、公式の実装例を確認すると使用されていないことがわかり、
公式に沿って実装を進めました。

[公式](https://mswjs.io/docs/quick-start)
[参考記事1](https://iret.media/189648)
[参考記事2](https://zenn.dev/ket8/articles/56223ffe7be928)

#### 実装上の注意点2
上記参考記事をもとに実装して、デバックしてみるとテーブル上に一件も表示されていない現象が起きていました。
Cursorで表示させるよう指示を出すと、下記コマンドを実行して
`mockServiceWorker.js`ファイルを作成してくれました。
公式の実装例のGitHubを確認すると確かに該当ファイルを見つけることができました。
他記事を調べてみると、mswの初期化が必要だったようで、そこが抜けていたためにモックサーバーが起動できていませんでした。

```zsh
pnpm exec msw init public --save
```

[参考記事](https://kentech.blog/blogs/5cs-vy6u9ks)
[GitHub](https://github.com/mswjs/examples/tree/main/examples/with-remix/public)
