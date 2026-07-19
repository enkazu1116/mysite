# Branded Type(ブランド型)
TypeScriptの型定義による構造的型システムの限界に対して、使われる手法。<br />
型システムを拡張して**名前的型システム**の特性を模倣して、似た構造でも異なる役割を持つ型を区別できるようにする手法。

## OOP言語との違い
名前的型システムとは異なる概念として**構造的型システム**を採用している。<br />
TypeScriptでは、型の互換性は型の名前ではなく、その構造に基づいて判断される。<br />
サイトで簡単に一言でまとめられていたのは、<br />
  *同じ形をしていれば、同じ型とみなす。*

## 基本
既存の方に特別な**ブランド**を付与する。<br />
構造は同じでも、型システム上では区別できるようにする手法。<br />

### 実装方法
```typescript
// 1. 基本
type User = string & { readonly __brand: "user" };
type Guest = string & { readonly __brand: "guest" };

// 2. ジェネリック型を使用したパターン
// 再利用可能なブランド型
type Branded<T, Brand> = T & { readonly __brand: Brand };

// 具体化
// 任意の型 T とブランド識別子 Brandの組み合わせ
type Hours = Branded<number, "hours">;
type Seconds = Branded<number, "seconds">;

// 3. Symbol活用
declare const brandSymbol: unique symbol;

// 具体化
type PhoneNumber = string & { readonly [brandSymbol]: "phoneNumber" };
type EmailAddress = string & { readonly [brandSymbol]: "emailAddress" };

// 4. ブランド型ユーティリティ
type Branded<T, Brand extends string> = T & { readonly __brand: Brand };

type UserId = Branded<string, "userId">;
type GuestId = Branded<string, "guestId">;
```

#### Symbolを活用した方法の詳細
**Symbol**とは、プリミティブ型の1つ。<br />
説明文字列が同じ"id"でも、a・bはそれぞれ別の値である。<br />

**注意**
Symbolは任意のSymbol値を表す広い定義の型であるということ。下記の場合は、どちらも型としては`Symbol`。
```typescript
const a = Symbol("id");
const b = Symbol("id");

console.log(a == b); // false
```

**unique symbol**は、特定の1つのSymbolだけを表す型。上記に`unique`を付与すると別の型として扱われる。

[参考](https://zenn.dev/farstep/articles/typescript-branded-types)