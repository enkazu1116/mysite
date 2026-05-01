# API取得
## 現状
バックエンド中心に開発を行なってきており、APIを使用した開発というのが少ないのが現状であります。
恥ずかしながらフロントエンドでのAPIを呼び出す方法について理解はさほどしていない状況です。
そこで今回改めて理解を深める目的で1から理解します。

## 実装
```typescript
const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/skills');
        const json = await response.json();

        setSkills(json);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (skills.length === 0) {
    return <p>No skills found.</p>;
  }
```

記事を参考に実装をしましたがまだ腹落ちしていないので、より深掘りをしてみます。
[参考記事](https://zenn.dev/kei1225/articles/e20c40e8232c2a)

## 深掘り
### useState()
`useState`は、コンポーネントに`state変数`を追加するためのReactフックです。

**構文**
`const[state, setState] = useState(initialState)`
- state: State値を格納するための変数
- setState: State値を更新するための関数
- initialState: Stateの初期値
[公式](https://ja.react.dev/reference/react/useState)

**State値とは？**
コンポーネント内の状態を表す変数。
ユーザー入力や処理によって変化していく状態を管理していく

**useStateのアンチパパターン**
今回は簡単な実装内容なため、useStateの使用回数は少ないので問題がないが、
より複雑な実装を行う場合にはuseStateの回数が増えることになるかもしれない。
stateを適切に構造化する必要があります。
他にもアンチパターンがあるので、実装を進めながら読み進めていきます。

ちなみに参考記事は逆コンパイルできないか調べた時に見つけました。
逆コンパイル方法は不明です。
[参考記事](https://zenn.dev/t_keshi/books/you-and-cleaner-react/viewer/preface)

### useEffect()
`useEffect`は、コンポーネントを外部システムと同期させるためのReactフックです。
副作用フックとも呼ばれ、コンポーネントの状態が変化したタイミングで実行すべき処理を定義できる。

**構文**
`useEffect(() => { statement }, deps)`
- statement: (再)描画時に実行する処理
- deps: 依存する変数

**使用上の注意**
公式でも述べており、読んでいる本でも書かれていることでReactの外側と連携する状況でのみ使用するべきです。
記事の多くでも安易に使用することを警告しています。

[参考記事](https://zenn.dev/t_keshi/books/you-and-cleaner-react/viewer/for-asynchronous-processing)