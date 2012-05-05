describe('AWWは', function() {
    it('マップ生成用の名前空間である', function() {
        expect(AWW).toBeDefined();
    });
});
// テストしたいクラス名を設定
/*
describe('XXXXX クラスは', function() {
    //テストしたい変数名
    var a = null,
        b = null;
    beforeEach(function() {
        //初期値
        a = 'test';
        b = 'test';
    });
    afterEach(function() {
        //テスト実行後の処理(DOM操作をした場合などに初期化するために使用するなど)
    });

    //テストのテンプレート
    it('XXXX は XXXXX で XXXXX', function() {
        //非同期処理
        runs(function() {
            //add code.
        });
        waits(1000);
        runs(function() {
            //add code.
        });

        //aがbと同じである
        expect(a).toEqual(b);
        //aがbと同じでない
        expect(a).not.toEqual(b);

        //aがbと同じオブジェクトである
        expect(a).toBe(b);
        //aがbと同じオブジェクトでない
        expect(a).not.toBe(b);

        //aがundefinedでない
        expect(a).toBeDefined();
        //aがundefinedである
        expect(a).not.toBeDefined();

        //aがnullである
        expect(a).toBeNull();
        //aがnullでない
        expect(a).not.toBeNull();

        //aがtrueである
        expect(a).toBeTruthy();
        //aがfalseである
        expect(a).toBeFalsy();

        //aにbが含まれている
        expect(a).toBeContain(b);
        //aにbが含まれてない
        expect(a).not.toBeContain(b);

        //aがbより小さい
        expect(a).toBeLessThan(b);
        //aがbより大きい
        expect(a).toBeGreaterThan(b);

        //a（function）が例外をスロー
        expect(a).toThrow(e);
        //a（function）が例外をスローしない
        expect(a).not.toThrow(e);
    });
});
*/
