// テストしたいクラス名を設定
describe('Amida クラスは', function() {
    //テストしたい変数名
    console.log(Amida);
    var amida = Amida();

    beforeEach(function() {
        //初期値
        amida = new Amida();
    });
    afterEach(function() {
        //テスト実行後の処理(DOM操作をした場合などに初期化するために使用するなど)
    });

    it('vibrateメソッドで振動する', function() {
        var v = amida.vibrate;
        //defined
        expect(v).toBeDefined();
    });
    it('getSquereで現在のマップ上での位置を取得できる', function() {
        var g = amida.getSquere;
        console.log(g);
        //defined
        expect(g).toBeDefined();
        //functionである
        expect(g).not.toBe(function() {});
        //戻り値がオブジェクト
        expect(g({
            x: 100,
            y: 200
        })).toBe({});
    });

    //テストのテンプレート
    /*
    it('XXXX は XXXXX で XXXXX', function() {
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
    */
});
