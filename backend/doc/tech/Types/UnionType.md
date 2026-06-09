# Issue17 User Domain機能 戻り値の定義
## 戻り値の定義の検討
### 課題
Promise<string | null>
検索処理でUserが見つからない場合にnullで表現している。
型が使えるのに関わらず、表現性が下がっている。
またバグの温床になりかねない。

### 調査
**候補**
- Result型
Success時とFatle時の挙動で制御ができる。
ただし、try {} catch {}が必要
- タグ付きユニオン型
事前定義したタグで分岐させることができ、意図が明確になる。
ただし、型チェックを必ずする必要が生まれる。

[Result](https://software-architecture-ts-study.komiyamma.net/docs/err_model_ts/err_model_ts_study_017/)
[ユニオン型の分配法則](https://zenn.dev/mizchi/articles/union-condition-types)
[ユニオン型](https://tetsuyaohira.com/posts/2024-07-21-typescript-union/)
[タグ付ユニオン型のテクニック](https://speakerdeck.com/uhyo/tagufu-kiyunionxing-wobian-li-nishi-utekunitukutosonozhu-yi-dian?slide=19)
[Result型への注意喚起](https://qiita.com/devneko/items/48b0f438f7b48991a08b)
[Result型への妥協点](https://zenn.dev/praha/articles/2eb151a891be16)

### 結論
タグ付ユニオンが好ましいと考えられる。
Result型の場合、今回のケースでは望まないtry {} catch {}が生まれてしまい、
不必要なtry {} catch {}ができるため可読性が下がるだけでなく、本来の使用目的とは異なる。
他にもエコシステムとの統合がしずらいらしく、関数型言語と比べるとデメリットが大きい。
→ 使用する場合は、APIの呼び出しやtry {} catch {}が必要な場面で使用するのが良さそう。
  つまり適した使用方法としては、成功と失敗を表現するのに型を活用したいときに有用である。

一方タグ付ユニオンの場合、調査上で目立ったデメリットを主張されている方はいなかった。
タグをあらかじめ定義できるので、明確な意図を伝えることができる。
ただし、タグをたくさん定義した場合はSwitch文がかなりのコード量を占めることになり、読みづらくなる可能性がある。
また記述量は増えてしまう。
