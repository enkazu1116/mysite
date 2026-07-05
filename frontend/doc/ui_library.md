# Issue #21 UI選定

## 候補

- Chakra UI
- Mantine
- HeroUI
- PrimeReact
- shadcn/ui
- Headless UI
[参考](https://note.com/conta_engineer/n/n82d5f239c007)

### バンドルサイズ

#### 測定条件

- 環境: React 19 + Vite 8 + pnpm
- 共通コンポーネント: Button / Input / Checkbox / Select / Dialog の5つ
- 指標: production build の gzip圧縮後のサイズ

※補足
本番向けに最適化したビルドのサイズを指標とする。
ブラウザがファイルを受け取るときは、大体`gzip`で圧縮しているのでそれをベースとする。

#### 実測結果（5コンポーネント）  
以下、AIによる観測結果


| ライブラリ                      | JS (gzip) | CSS (gzip) | 合計 (gzip) | React 単体比の増分           |
| -------------------------- | --------- | ---------- | --------- | ---------------------- |
| shadcn/ui（Radix + ユーティリティ） | 97 KB     | 0 KB*      | ~97 KB    | +37 KB                 |
| Headless UI                | 98 KB     | 0 KB*      | ~98 KB    | +38 KB                 |
| Chakra UI v3               | 115 KB    | ほぼ 0**     | ~115 KB   | +55 KB                 |
| PrimeReact                 | 116 KB    | 19 KB      | ~135 KB   | +76 KB（+ フォント約 726 KB） |
| Mantine v9                 | 111 KB    | 32 KB      | ~143 KB   | +83 KB                 |
| HeroUI v3                  | 120 KB    | 37 KB      | ~157 KB   | +97 KB                 |


- React 単体ベースライン: JS 60 KB gzip（button + input のみ）
- Headless UI / shadcn はスタイルを Tailwind で書く前提。  
Tailwind 本体の CSS は別途（未使用クラスは purge される）
- Chakra v3 は Panda CSS ベースで、CSS が JS 側に寄る

#### Bundlephobia（全パッケージ import・参考値）
[外部サイトでの調査](https://bundlephobia.com/)

| パッケージ       | min      | gzip   |
| ----------- | -------- | ------ |
| Headless UI | 197 KB   | 60 KB  |
| Mantine     | 490 KB   | 145 KB |
| Chakra UI   | 1,051 KB | 282 KB |
| HeroUI      | 1,182 KB | 303 KB |
| PrimeReact  | 1,224 KB | 306 KB |


ライブラリ全体を import した最悪ケースであり、tree-shaking 下の実測とは大きく乖離する。

### CSSスタイリング工数

#### 優位性高
1. HeroUI
2. PrimeReact
3. Mantine

これらは、ある程度デザインが施されていてそのデザインに従うことで
CSSによるデザイン調整コストを削減することが望める。

#### 優位性低 = カスタマイズ性高
1. Headless UI
2. shacn/ui
3. chakra UI

自分でCSSをがっつりやるなら、これらがよい。
Vibe codeingで任せてもよいが、自身でバンドルサイズを気にする必要がある。

