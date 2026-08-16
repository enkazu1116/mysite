# ReturnType<T>

## 概要
関数型Tの戻り値を取得するユーティリティ型

### 使用例
```typescript
type UserEmail = ReturnType<() => string | null>;

const isEven = (num: number) => {
  return num % 2 === 0;
};

// type isEvenRetType = boolean
type isEvenRetType = ReturnType<typeof isEven>;
```

[参考](https://typescriptbook.jp/reference/type-reuse/utility-types/return-type)