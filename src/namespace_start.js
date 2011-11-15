enchant();
var AW = (function(){
/* TODO:
☆各クラスの最適＆効率化（常時タスク）
・敵AIをルールに則った仕様に変更
・制限時間の設定
・制限時間の表示
・ステータス表示
・ユニットの性能設定
・効果音設定
・城破壊エフェクト
・サムネイルドラッグ中に城にドロップできる事を明確に表示する
・ユーザーの行動を保存する（AI作成のため）
・ランキング作成
・得点の調整（自城破壊時のマイナス含む）
・ヒーロー実装（自ユニットが死んだ回数や、敵城の状態等を見て使えるかどうか判断するなど）
・イラストを独自に


//ユニット性能原案
・見た目の印象と実際の操作の乖離を少なくする。
・ユーザーは説明をみない、という前提でゴリ押しでもなんとかなる調整を行う。
・RTSらしさ、を少しでもいいから残す。

■遠距離ユニットをどうするか

▼Human
バランス型
性能は基本を抑えた使いやすい種族という設定を保つ。
他のユニットとの組み合わせで敵を掃討する特性をもたせる。

・WIZARDは一度だけ敵との戦闘を回避する
・FROST-MAGEは敵を戦闘場所に一定時間停止させ、攻撃できなくする。
・FIRE-MAGEは敵の防御力を0にする。
・CLELICはマップに出ていない場合、自軍の復活速度を早くする


▼Undead
ピーキーな設定にする。
尖った性能のユニットを多数作り、慣れれば強い、というバランスを目指す。

・骨系は復活を早くする代わりに弱い。
・ゴーレムは城を一撃で壊すが遅い。
・蜘蛛は攻撃したユニットの行動＆復活を遅くする
・シェードは城のみ攻撃可能で足が遅く、ユニットからは一方的にダメージを受ける
・スペクターは敵のみ攻撃可能で足が遅く、必ずユニットと相打ちになる

*/

