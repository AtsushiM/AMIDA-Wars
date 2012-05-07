describe('AW.Amidaクラスは ', function() {
    var Amida = new AW.Amida();
    beforeEach(function() {
        Amida = new AW.Amida();
    });
    afterEach(function() {
        Amida = null;
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
        ret = null;
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

        unit = ret = null;
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
        Castle = null;
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

        hp = null;
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

describe('AW.RaceSelectクラスは ', function() {
    var RS;
    beforeEach(function() {
        RS = new AW.RaceSelect();
    });
    afterEach(function() {
        RS = null;
    });

    it('使用する種族を選択する', function() {
        expect(RS.select).toBeDefined();

        var ret = RS.select({
            race: 'UNDEAD',
            order: [
                'BONE_WARRIER',
                'BONE_ARCHER',
                'BONE_DOG',
                'BONE_SNAKE',
                'GOLEM',
                'ARACHNE',
                'SHADE',
                'SPECTOR'
            ]
        });

        expect(ret).toEqual('UNDEAD');

        ret = null;
    });
});

describe('AW.Thumbクラスは ', function() {
    var Thumb;
    beforeEach(function() {
        Thumb = new AW.Thumb({
            mode: 'USER',
            name: 'BONE_WARRIER'
        });
    });
    afterEach(function() {
        Thumb = null;
    });

    it('dragStart()でドラッグを開始する', function() {
        expect(Thumb.dragStart).toBeDefined();
        Thumb.dragStart();
        expect(Thumb.canDrag).toBeTruthy();
    });
    it('dragStop()でドラッグを終了する', function() {
        expect(Thumb.dragStop).toBeDefined();
        Thumb.dragStop();
        expect(Thumb.canDrag).toBeFalsy();
    });
    it('reverse()で使用不可のサムネイルを復帰させる', function() {
        runs(function() {
            expect(Thumb.reverse).toBeDefined();
            expect(Thumb.canDrag).toBeFalsy();
            Thumb.reverse({
                reverse: 1
            });
        });
        waits(1100);
        runs(function() {
            expect(Thumb.canDrag).toBeTruthy();
        });
    });
    it('init()でサムネイルの初期表示のカウントダウンを行う', function() {
        expect(Thumb.init).toBeDefined();
        expect(Thumb.init()).toBeTruthy();
    });
});

describe('AW.Unitクラスは ', function() {
    var Unit;
    beforeEach(function() {
        Unit = new AW.Unit({
            x: 32,
            y: 64,
            mode: 'user',
            frame: 0,
            attacked: function() {
            }
        });
    });
    afterEach(function() {
        Unit = null;
    });

    it('checkDeath()で死亡確認する', function() {
        expect(Unit.checkDeath).toBeDefined();
        Unit.hp = 1;
        expect(Unit.checkDeath()).toBeFalsy();
        Unit.hp = 0;
        expect(Unit.checkDeath()).toBeTruthy();
    });
    it('kill()で死亡する', function() {
        expect(Unit.kill).toBeDefined();
        expect(Unit.kill()).toBeTruthy();
    });
    it('attack()で敵ユニットに攻撃を行う', function() {
        expect(Unit.attack).toBeDefined();

        var enemy = {
                hp: 3,
                attacked: function(obj) {
                    expect(obj.mine).toBe(Unit);
                    expect(obj.enemy).toBe(enemy);
                },
                hplabel: {
                    update: function() {
                    }
                }
            };
        expect(Unit.attack(enemy, 2)).toEqual(1);

        enemy = null;
    });
    it('changeUnit()で見た目を変更する', function() {
        expect(Unit.changeUnit).toBeDefined();
        expect(Unit.changeUnit({
            frame: 1
        })).toBeTruthy();
    });
    it('stay()で移動を停止し、HP表示を取り除く', function() {
        expect(Unit.stay).toBeDefined();
        expect(Unit.stay()).toBeTruthy();
    });
});

describe('AW.Scoreクラスは ', function() {
    var Score;
    beforeEach(function() {
        Score = new AW.Score({
            x: 32,
            y: 64,
            mode: 'USER'
        });
    });
    afterEach(function() {
        Score = null;
    });

    it('add()で得点を追加する', function() {
        expect(Score.add).toBeDefined();
        expect(Score.add(100)).toEqual(100);
    });
    it('update()で得点表示を更新する', function() {
        expect(Score.update).toBeDefined();
        Score.total = 200;
        expect(Score.label.text).toEqual('SCORE : 0');
        Score.update();
        expect(Score.label.text).toEqual('SCORE : 200');
    });
    it('get()で現在の得点を取得する', function() {
        expect(Score.get).toBeDefined();
        expect(Score.get()).toEqual(0);
        Score.add(100);
        expect(Score.get()).toEqual(100);
    });
});

describe('AW.EnemyActionクラスは ', function() {
    var EA;
    beforeEach(function() {
        EA = {};
        for (var i in AW.EnemyAction) {
            EA[i] = AW.EnemyAction[i];
        }
    });
    afterEach(function() {
        EA = null;
    });

    it('init()でAIを起動する', function() {
        expect(EA.init).toBeDefined();
        EA.init();
        expect(EA.aiid).not.toEqual(0);
    });
    it('end()でAIを停止する', function() {
        expect(EA.end).toBeDefined();
        EA.init();
        EA.end();
        expect(AW.EnemyAction.aiid).toEqual(null);
    });
});

describe('AW.Surveillantクラスは ', function() {
    var SU;
    beforeEach(function() {
        SU = {};
        for (var i in AW.Surveillant) {
            SU[i] = AW.Surveillant[i];
        }
    });
    afterEach(function() {
        SU = null;
    });

    it('add()で監視実行する関数を登録する', function() {
        expect(SU.add).toBeDefined();
        expect(SU.functions.test).not.toBeDefined();
        SU.add(function() {
            return true;
        }, 'test');
        expect(SU.functions.test).toBeDefined();
    });
    it('remove()で監視する関数を削除する', function() {
        expect(SU.remove).toBeDefined();
        SU.add(function() {
            return true;
        }, 'test');
        SU.remove('test');
        expect(SU.functions.test).not.toBeDefined();
    });
    it('exefunc()で監視する関数を実行する', function() {
        expect(SU.exefunc).toBeDefined();
        SU.add(function() {
            return true;
        }, 'test');
        var count = 0;
        for (var i in SU.functions) {
            count++;
        }
        var save = SU.exefunc();
        expect(save.length).toEqual(count);

        count = save = null;
    });
    it('init()で監視を開始する', function() {
        var save = false;
        runs(function() {
            expect(SU.init).toBeDefined();
            SU.functions = {};
            SU.add(function() {
                save = true;
            }, 'test');
            SU.init();
            expect(save).toBeFalsy();
        });
        waits(500);
        runs(function() {
            expect(save).toBeTruthy();

            save = null;
        });
    });
    it('stop()で監視を停止する', function() {
        var save = false;
        runs(function() {
            expect(SU.stop).toBeDefined();
            SU.functions = {};
            SU.add(function() {
                save = true;
            }, 'test');
            SU.init();
            SU.stop();
        });
        waits(500);
        runs(function() {
            expect(save).toBeFalsy();

            save = null;
        });
    });
    it('end()で監視関数を削除し、監視を停止する', function() {
        var save = false;
        runs(function() {
            expect(SU.stop).toBeDefined();
            SU.functions = {};
            SU.add(function() {
                save = true;
            }, 'test');
            SU.init();
            SU.end();

            var count = 0;
            for (var i in SU.functions) {
                count++;
            }
            expect(count).toEqual(0);

            count = null;
        });
        waits(500);
        runs(function() {
            expect(save).toBeFalsy();

            save = null;
        });
    });
});

describe('AW.Battleクラスは ', function() {
    var Battle;
    beforeEach(function() {
        Battle = {};
        for (var i in AW.Battle) {
            Battle[i] = AW.Battle[i];
        }
    });
    afterEach(function() {
        Battle = null;
    });

    it('init()で戦闘の監視を開始する', function() {
        expect(Battle.init).toBeDefined();
        var count = 0;
        for (var i in AW.Surveillant.functions) {
            count++;
        }
        Battle.init();

        var before = 0;
        for (var i in AW.Surveillant.functions) {
            before++;
        }
        expect(count + 1).toBeDefined(before);

        count = before = null;
    });
    it('score()で戦闘結果のスコアを登録する', function() {
        expect(Battle.score).toBeDefined();
        var save = Battle.score({
            type: 'UNIT',
            mode: 'USER'
        });
        expect(typeof(save)).toEqual('number');

        save = Battle.score({
            type: 'CASTLE',
            mode: 'ENEMY'
        });
        expect(typeof(save)).toEqual('number');

        save = null;
    });
    it('unitAndUnit()でユニット同士の戦闘を行う', function() {
        expect(Battle.unitAndUnit).toBeDefined();
        var unit1 = new AW.Unit({
                x: 32,
                y: 64,
                hp: 1,
                mode: 'user',
                frame: 0,
                attacked: function() {
                },
                dead: function() {
                }
            }),
            unit2 = new AW.Unit({
                x: 32,
                y: 64,
                hp: 2,
                mode: 'user',
                frame: 0,
                attacked: function() {
                },
                dead: function() {
                }
            });

        Battle.unitAndUnit(unit1, unit2);

        expect(unit1.checkDeath()).toBeTruthy();
        expect(unit2.checkDeath()).toBeFalsy();

        unit1 = unit2 = null;
    });
    it('siege()でユニットから城に対して攻撃を行う', function() {
        expect(Battle.siege).toBeDefined();
        var unit = new AW.Unit({
                x: 32,
                y: 64,
                hp: 1,
                mode: 'user',
                frame: 0,
                siege: 1,
                attacked: function() {
                },
                dead: function() {
                }
            }),
            castle = new AW.Castle({
                mode: 'enemy',
                frame: AW.CONST.CASTLE.FRAME.NORMAL,
                brake: AW.CONST.CASTLE.FRAME.BRAKE,
                x: 1 * 32,
                y: 1 * 32,
                hp: 2
            });

        Battle.siege(unit, castle);
        expect(unit.hp).toEqual(1);
        expect(castle.hp).toEqual(1);

        unit = castle = null;
    });
});

describe('AW.StatusViwerクラスは ', function() {
    var SV;
    beforeEach(function() {
        SV = new AW.StatusViwer({
            mode: 'USER',
            x: 100,
            y: 100
        });
    });
    afterEach(function() {
        SV = null;
    });

    it('init()でユニットステータスを登録する', function() {
        expect(SV.init).toBeDefined();
        var save = SV.init();
        expect(save).toBeDefined();

        save = null;
    });
    it('update()でユニット表示を切り替える', function() {
        expect(SV.update).toBeDefined();
        expect(SV.update({
            name: 'skelton_warrier'
        })).toBeDefined();
        expect(SV.update({
            name: 'skelton_warrier'
        })).toBeDefined();
    });
});

describe('AW.Logクラスは ', function() {
    var Log;
    beforeEach(function() {
        Log = AW.Log;
        Log.reset();
    });
    afterEach(function() {
        Log.reset();
    });

    it('unit()でユニット撃破数を1増やす', function() {
        expect(Log.unit).toBeDefined();
        Log.unit({
            mode: 'USER'
        });
        expect(Log.data.unit.USER).toEqual(1);
        Log.unit({
            mode: 'USER'
        });
        expect(Log.data.unit.USER).toEqual(2);
        Log.unit({
            mode: 'ENEMY'
        });
        expect(Log.data.unit.ENEMY).toEqual(1);
        Log.unit({
            mode: 'ENEMY'
        });
        expect(Log.data.unit.ENEMY).toEqual(2);
    });
    it('death()でユニット死亡数を1増やす', function() {
        expect(Log.death).toBeDefined();
        Log.death({
            mode: 'USER'
        });
        expect(Log.data.death.USER).toEqual(1);
        Log.death({
            mode: 'USER'
        });
        expect(Log.data.death.USER).toEqual(2);
        Log.death({
            mode: 'ENEMY'
        });
        expect(Log.data.death.ENEMY).toEqual(1);
        Log.death({
            mode: 'ENEMY'
        });
        expect(Log.data.death.ENEMY).toEqual(2);
    });
    it('siege()で攻城回数を1増やす', function() {
        expect(Log.siege).toBeDefined();
        Log.siege({
            mode: 'USER'
        });
        expect(Log.data.siege.USER).toEqual(1);
        Log.siege({
            mode: 'USER'
        });
        expect(Log.data.siege.USER).toEqual(2);
        Log.siege({
            mode: 'ENEMY'
        });
        expect(Log.data.siege.ENEMY).toEqual(1);
        Log.siege({
            mode: 'ENEMY'
        });
        expect(Log.data.siege.ENEMY).toEqual(2);
    });
    it('castle()で城破壊数を1増やす', function() {
        expect(Log.castle).toBeDefined();
        Log.castle({
            mode: 'USER'
        });
        expect(Log.data.castle.USER).toEqual(1);
        Log.castle({
            mode: 'USER'
        });
        expect(Log.data.castle.USER).toEqual(2);
        Log.castle({
            mode: 'ENEMY'
        });
        expect(Log.data.castle.ENEMY).toEqual(1);
        Log.castle({
            mode: 'ENEMY'
        });
        expect(Log.data.castle.ENEMY).toEqual(2);
    });
    it('send()でデータをDBに保存する', function() {
        //TODO
        expect(Log.send).toBeDefined();
        expect(Log.send()).toBeTruthy();
        expect(Log.data.time).not.toEqual(0);
    });
    it('reset()で保存していたログをリセットする', function() {
        expect(Log.reset).toBeDefined();

        expect(Log.data.time).toEqual(0);
        expect(Log.data.victory).toEqual(0);
        expect(Log.data.unit.USER).toEqual(0);
        expect(Log.data.unit.ENEMY).toEqual(0);
        expect(Log.data.death.USER).toEqual(0);
        expect(Log.data.death.ENEMY).toEqual(0);
        expect(Log.data.siege.USER).toEqual(0);
        expect(Log.data.siege.ENEMY).toEqual(0);
        expect(Log.data.castle.USER).toEqual(0);
        expect(Log.data.castle.ENEMY).toEqual(0);

        Log.unit({
            mode: 'USER'
        });
        Log.death({
            mode: 'USER'
        });
        Log.siege({
            mode: 'USER'
        });
        Log.castle({
            mode: 'USER'
        });

        Log.unit({
            mode: 'ENEMY'
        });
        Log.death({
            mode: 'ENEMY'
        });
        Log.siege({
            mode: 'ENEMY'
        });
        Log.castle({
            mode: 'ENEMY'
        });

        Log.data.victory = 1;

        Log.send();

        expect(Log.data.time).not.toEqual(0);
        expect(Log.data.victory).toEqual(1);
        expect(Log.data.unit.USER).toEqual(1);
        expect(Log.data.unit.ENEMY).toEqual(1);
        expect(Log.data.death.USER).toEqual(1);
        expect(Log.data.death.ENEMY).toEqual(1);
        expect(Log.data.siege.USER).toEqual(1);
        expect(Log.data.siege.ENEMY).toEqual(1);
        expect(Log.data.castle.USER).toEqual(1);
        expect(Log.data.castle.ENEMY).toEqual(1);

        Log.reset();

        expect(Log.data.time).toEqual(0);
        expect(Log.data.victory).toEqual(0);
        expect(Log.data.unit.USER).toEqual(0);
        expect(Log.data.unit.ENEMY).toEqual(0);
        expect(Log.data.death.USER).toEqual(0);
        expect(Log.data.death.ENEMY).toEqual(0);
        expect(Log.data.siege.USER).toEqual(0);
        expect(Log.data.siege.ENEMY).toEqual(0);
        expect(Log.data.castle.USER).toEqual(0);
        expect(Log.data.castle.ENEMY).toEqual(0);
    });

    it('init()でLogデータの監視、送信を行う', function() {
        //TODO
        expect(Log.init).toBeDefined();
        expect(Log.init()).toBeTruthy();
    });

    it('end()でLogデータの監視を停止し、最終状態を送信する', function() {
        //TODO
        expect(Log.end).toBeDefined();
        expect(Log.end()).toBeTruthy();
    });
});

describe('AW.Resultクラスは ', function() {
    var RE = AW.Result;
    beforeEach(function() {
    });
    afterEach(function() {
    });

    it('結果を表示する', function() {
        expect(RE).toBeDefined();
        expect(new RE('USER').result).toBeDefined('WIN');
        expect(new RE('ENEMY').result).toBeDefined('LOSE');
        expect(new RE().result).toBeDefined('DRAW');
    });
});

describe('AW.Effectクラスは ', function() {
    AW.GAME.start();
    var EffectLoop, EffectUnLoop,
        Gframe = AW.GAME.frame;
    beforeEach(function() {
        EffectLoop = new AW.Effect({
            type: 'unit',
            x: 64,
            y: 64,
            frames: {
                start: 0,
                end: 5,
                rate: 3,
                loop: true
            }
        });
        EffectUnLoop = new AW.Effect({
            type: 'unit',
            x: 64,
            y: 64,
            frames: {
                start: 0,
                end: 5,
                rate: 3,
                loop: false
            }
        });
    });
    afterEach(function() {
        EffectLoop = null;
        EffectUnLoop = null;
        AW.GAME.frame = Gframe;
    });

    it('frames.loopオプションでループするかどうかが決定する', function() {
        expect(EffectLoop.endFlg).toBeFalsy();
        expect(EffectUnLoop.endFlg).toBeFalsy();

        //テスト用
        AW.GAME.frame = 3;

        EffectLoop.effect();
        EffectLoop.effect();
        EffectLoop.effect();
        EffectLoop.effect();
        EffectLoop.effect();

        expect(EffectLoop.endFlg).toBeFalsy();

        EffectUnLoop.effect();
        EffectUnLoop.effect();
        EffectUnLoop.effect();
        EffectUnLoop.effect();
        EffectUnLoop.effect();
        EffectUnLoop.effect();

        expect(EffectUnLoop.endFlg).toBeTruthy();
    });
    it('end()でアニメーションを停止する', function() {
        expect(EffectLoop.end).toBeDefined();
        expect(EffectLoop.end()).toBeTruthy();
        expect(EffectUnLoop.end()).toBeTruthy();
    });
});

describe('AW.Countdownクラスは ', function() {
    var Countdown;
    beforeEach(function() {
        Countdown = new AW.Countdown({
            x: 32,
            y: 64
        });
    });
    afterEach(function() {
        Countdown = null;
    });

    it('update()で時間を更新する', function() {
        expect(Countdown.update).toBeDefined();
        Countdown.text = 1;
        expect(Countdown.update(2)).not.toEqual(1);
    });
    it('init()でカウントダウンを開始する', function() {
        var save;
        runs(function() {
            expect(Countdown.init).toBeDefined();
            save = Countdown.text;
            expect(Countdown.init()).toBeTruthy();
        });
        waits(1500);
        runs(function() {
            expect(Countdown.text).not.toEqual(save);

            save = null;
        });
    });
    it('setAfter()でカウントダウン終了時の処理を設定する', function() {
        expect(Countdown.setAfter).toBeDefined();
        var test = function() {
            return true;
        };
        expect(Countdown.setAfter(test)).toEqual(test);
    });
    it('getDiff()で開始からの秒数を取得する', function() {
        var save;
        runs(function() {
            expect(Countdown.getDiff).toBeDefined();
            save = Countdown.getDiff();
            Countdown.init();
            expect(Countdown.init()).toBeTruthy();
        });
        waits(1500);
        runs(function() {
            expect(Countdown.getDiff()).toEqual(save - 1);

            save = null;
        });
    });
    it('stop()でカウントダウンを停止する', function() {
        var save;
        runs(function() {
            expect(Countdown.stop).toBeDefined();
            save = Countdown.getDiff();
            Countdown.init();
            Countdown.stop();
        });
        waits(1500);
        runs(function() {
            expect(Countdown.getDiff()).toEqual(save);

            save = null;
        });
    });
});

//テストのテンプレート
/*
describe('AW.Castleクラスは ', function() {
    var XXXX;
    beforeEach(function() {
        XXXX = new YYYY({
        });
    });
    afterEach(function() {
        XXXX = null;
    });

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
});
*/
