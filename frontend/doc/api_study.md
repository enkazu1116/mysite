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

## 実装
```typescript
const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
        const data = await fetchSkillsApi();
        setSkills(data);
    } catch (error: unknown) {
        setError(error instanceof Error ? error : new Error("Unknown error"));
    } finally {
        setLoading(false);
    }
}, []);
```

### 詳細
#### useCallback
再レンダー間で関数定義をキャッシュできるようにするフック
パフォーマンスを向上させるために関数インスタンスを再生成を抑制し、再描画を減らす。

**構文**
`useCallback(func, deps)`
- func: メモ化する関数
- deps: 依存する変数
引数depsには、関数が依存する変数を列挙する。

今回の場合は、`fetchSkills`という関数の変数に、`useCallback()`を渡している。
`useCallback()`はasync関数と[]を引数に関数定義をキャッシュ化している。
[公式](https://ja.react.dev/reference/react/useCallback#usecallback)

#### 処理内容
`fetchSkillsApi()`で関数の処理結果を受け取り、`setSkills()`でStateに管理をさせる。

## TanstackQuery(旧: React Query)
非同期の状態管理ライブラリ
キャッシュの管理・状態管理・再取得など簡単にさせてくれるらしい。
ただし、Tanstack Query自体はデータフェッチは行なっていないです。

### Install
```zsh
pnpm add @tanstack/react-query
```

### useQuery()
```typescript
const { data, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodoList
})
```

**引数**
- queryKey(必須): データを再取得する時やキャッシュ管理などで利用される一意のキー。
  データが保存される場所
- queryFn(必須): Promiseを返す関数
他にも必要に応じて引数を設定可能。
[useQuery公式](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)

#### 詳細
`useQuery`では、引数を指定して変数に処理結果を格納するだけで、簡単に実装が可能。
その前に実装していた内容は、`useState`, `useCallback`で状態変数を設定し、async関数を定義してから
`useEffect`で実行していた。
なのでかなり簡略化ができている。

[参考記事1](https://qiita.com/A-Yuki28/items/1224e19c86bbcd4d4890)
[参考記事2](https://zenn.dev/tsunadog/articles/61c27e1add4580)
[公式](https://tanstack.com/query/latest)