describe('AW.Amidaクラスは ', function() {
    var Amida = new AW.Amida();
    beforeEach(function() {
        Amida = new AW.Amida();
    });
    afterEach(function() {
    });

    it('vibrate()で振動する', function() {
        expect(Amida.vibrate).toBeDefined();
    });
    it('getSquere()でオブジェクトのスクエア位置を返す', function() {
        expect(Amida.getSquere).toBeDefined();
        var ret = Amida.getSquere({
            x: 100,
            y: 100
        });
        expect(ret.x).toBeDefined();
        expect(ret.y).toBeDefined();
    });
    it('getCollision()で進行可能方向か、接触した障害物のオブジェクトを返す', function() {
        expect(Amida.getCollision).toBeDefined();

        var unit = new Sprite(16, 16);
        unit.x = 100,
        unit.y = 100;
        AW.GAME.rootScene.addChild(unit);

        var ret = Amida.getCollision(unit);

        expect(ret).toBeDefined();
        expect(ret.length).toEqual(4);

        unit.x = 35;
        unit.y = 65;

        ret = Amida.getCollision(unit);
        expect(ret).toBeDefined();
        expect(ret.type).toEqual('CASTLE');
    });
});
describe('AW.Castleクラスは ', function() {
    var Castle;
    beforeEach(function() {
        Castle = new AW.Castle({
            x: 32,
            y: 64,
            mode: 'user'
        });
    });
    afterEach(function() {
    });

    it('focusOn()で拡大する', function() {
        expect(Castle.focusOn).toBeDefined();
        Castle.focusOn();
        expect(Castle.focus).toBeTruthy();
    });
    it('focusOff()で拡大を元に戻す', function() {
        Castle.focusOn();
        expect(Castle.focusOff).toBeDefined();
        Castle.focusOff();
        expect(Castle.focus).toBeFalsy();
    });
    it('blinkOn()で点滅する', function() {
        expect(Castle.blinkOn).toBeDefined();
        Castle.blinkOn();
    });
    it('blinkOff()で点滅を解除する', function() {
        Castle.blinkOn();
        expect(Castle.blinkOn).toBeDefined();
        Castle.blinkOff();
    });
    it('damage()で城にダメージを与える', function() {
        var hp = Castle.hp;
        expect(Castle.damage).toBeDefined();
        Castle.damage({
            siege: 1
        });
        expect(Castle.hp).toEqual(hp - 1);
    });
    it('checkBreak()で城が破壊されていたtrue,そうでない場合falseを返す', function() {
        expect(Castle.checkBreak).toBeDefined();
        expect(Castle.checkBreak()).toBeFalsy();
        Castle.hp = 0;
        expect(Castle.checkBreak()).toBeTruthy();
    });
    it('broke()で城を破壊する', function() {
        expect(Castle.broke).toBeDefined();
        expect(Castle.hp).not.toEqual(0);
        Castle.broke();
        expect(Castle.hp).toEqual(0);
    });
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
