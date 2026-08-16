# Partial<T>

## 概要
オブジェクトの型Tのすべてのプロパティをオプションプロパティにするユーティリティ型

## オプションプロパティとは？
プロパティ名の後ろに `?` を付けて定義するもの。
オブジェクトのプロパティがあってもなくても良い任意の値であることを明示する。

### 実装例
```typescript
type Person = {
    name?: string;
    phoneNumber?: string;
    email?: string;
}

type ParitalPerson = Parital<Person>;
```

上記二つの型は同義の内容となる。

### テストでの使用例
```typescript
function createMockUsersRepository(
    overrides: Partial<UsersRepository> = {},
): UsersRepository {

}
```

