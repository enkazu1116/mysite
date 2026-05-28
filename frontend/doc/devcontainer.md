# devcontainer環境構築
## frontend
### 取り組み1
`Dockerfile`を最小構成で作成。
[参考元](https://zenn.dev/mutex_inc/articles/nodejs-ts-docker-best-practice)

**問題1**
`pnpm`がベースイメージにない。
`node:24.15.0-trixie`には、pnpmが入っていないようである。

*解決*
1. `RUN corepack enable`を追加
**corepack**はNode.jsに組み込まれていたパッケージマネージャーの管理ツール。
ただし、Node.jsから削除されており、非推奨の可能性がある。
2. pnpmの機能を利用
packege.jsonファイルに`"packageManager": "pnpm@9.15.0"`を追加する。
.npmrcファイルに`manage-package-manager-versions=true`と記載する。
pnpm version 11以上から下記の書き方で、バージョンを指定できる。
範囲も可能である。
ただし、`pnpm install`コマンドを実行させる必要がある。

```json
"devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "11.0.0",
      "onFail": "download"
    }
  }
```

**結論**
corepackは使用せず、コンテナ内でnpm installを*バージョンを指定*して実行する。
pnpmのpackageManagerを記載してバージョンを固定する。

### 取り組み2
pnpmのセキュリティのため、ネイティブビルドスクリプトをデフォルトでブロックする機能への対策
[参考](https://qiita.com/Hashimoto-Noriaki/items/c04c1e6d6c69f27d6230)

```Dockerfile
RUN pnpm approve-builds sharp
```

実際に動作確認をすると、今回使用しているライブラリのインストール段階でエラーが起きた。
記事をちゃんと細かく見ていなかったため気付かなかったが、`sharp`はライブラリだった。
コマンドでライブラリを指定するのは現実的ではないのでほかの方法を探す

**最終対策**
pnpm-workspace.yamlの記載内容を修正する。
```yaml
allowBuilds:
  msw: false
```

### 取り組み3
**.pnpm-storeとTurborepoの活用**
1. .pnpm-storeの役割
ハードリンクで共有ストアを使う仕組みを採用しており、インストールの高速化とディスク使用量の節約を実現する
2. Turborepoの役割
モノレポ向けの高速タスクランナー

*なぜTurborepoを使用するのか？*
問題提起の発火場所となったサイトを見ると、異なるマウントポイント間でハードリンクを作成できない制約があるということだった。
Turborepoは`turbo prune`というコマンドを使用すると、
そのアプリのビルドには必要ないアプリやパッケージを消した状態のモノレポを作ってくれるコマンドだそう。
結果として、リンク切れになる現象に対してnode_modulesにコピーできるので解決することができる。

[公式](https://pnpm.io/docker)
[参考](https://qiita.com/boxfish_jp/items/2388a5eb04908da3d5b9)
[問題提起の発火場所となったサイト](https://zenn.dev/umyanka/articles/bd6d78415a0d8d)