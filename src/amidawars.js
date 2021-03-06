//init enchant.js
enchant();
var AW = (function(W) {
//set scroll
var doScroll = function() {
    if (W.pageYOffset === 0) {
        W.scrollTo(0, 1);
    }
};
W.onorientationchange = function() {
    setTimeout(doScroll, 100);
};
W.addEventListener('load', W.onorientationchange, false);
/* TODO:
☆各クラスの最適＆効率化（常時タスク）
・ユニットの上部にHPを表示（パーソナルカラーで色分け）
・チーム制の導入を考える（GPS座標など）
・国力の要素を入れるか（シンプルさを崩さない実装）
・リザルト画面作成
・種族選択画面を作成
・敵種族をランダム選択（最終的にはAI選択）
・自分のAIを投稿するフォーム？（AIを書いてもらうor自動）
・ユニットのステータスを公開したページの作成
・クリア演出
・ユニットの性能設定
・ユーザーの行動を保存する（AI作成のため）
・ランキング作成
・ヒーロー実装（自ユニットが死んだ回数や、敵城の状態等を見て使えるかどうか判断するなど）
・イラストを独自に
・ループボタン設置
・表示内容の再検討（攻撃力は表示すべきか否か）
・ログを取るデータを再検討
・ステータス内容を再考（攻撃力・防御力・HPではなく、強さに統一）

//ユニット性能原案
・見た目の印象と実際の操作の乖離を少なくする。
・ユーザーは説明をみない、という前提でゴリ押しでもなんとかなる調整を行う。
・RTSらしさ、を少しでもいいから残す。


▼Human
バランス型
性能は基本を抑えた使いやすい種族という設定を保つ。
他のユニットとの組み合わせで敵を掃討する特性をもたせる。

・WIZARDはランダム効果（時間を増減させる、敵を強制移動させるなど？）
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

//private valiables
var GAME,
    DOM,
    GROUP = {
        USER: { UNIT: new Group(), CASTLE: new Group(), THUMB: new Group() },
        ENEMY: { UNIT: new Group(), CASTLE: new Group(), THUMB: new Group() },
        MAP_OPTION: {
            CASTLE_BASE: new Group(),
            THUMB_BASE: new Group()
        },
        EFFECT: {
            UNIT: new Group()
        }
    },
    USER_RACE = '',
    USER_ORDER = [],
    UNITS = { USER: {}, ENEMY: {}, no: 0 },
    THUMBS = { USER: [], ENEMY: [] },
    CASTLE = { USER: [], ENEMY: [] },
    LABEL = {
        SCORE: {},
        COUNTDOWN: {},
        STATUS_VIEWER: {}
    },
    MAP = {
        BASE: [],
        CASTLE: {
            USER: [],
            ENEMY: []
        },
        COLLISION: [],
        PATH: {}
    },
    SOUND = {
        BGM: {},
        EFFECT: {}
    },
    TYPE = {
        LIGHT: 'LIGHT',
        MIDIUM: 'MIDIUM',
        HEAVY: 'HEAVY',
        NOARMOR: 'NOARMOR'
    },
    WEAK = {
        LIGHT: 'HEAVY',
        MIDIUM: 'MIDIUM',
        HEAVY: 'NOARMOR',
        NOARMOR: 'LIGHT'
    },
    /**
     * override object property
     * @param {Object} prop Property Object.
     * @param {Object} config Config Object.
     * @return {Object} Property Object.
     */
    propOverride = function(prop, config) {
        var i;
        if (prop === undefined) {
            prop = {};
        }
        for (i in config) {
            if (config.hasOwnProperty(i) === true) {
                prop[i] = config[i];
            }
        }
        return prop;
    },
    /**
     * add object to layer
     * @param {Object} config Config Object.
     * @return {Object} Sprite Object.
     */
    addLayer = function(config) {
        config.layer.addChild(config.sprite);
        return config.sprite;
    };
    //return Public
    PUBLIC = {};
/**
* CONSTANT Valiables
* @return {Object} CONSTANT Value.
*/
var CONST = function() {
    return {
        TIMELIMIT: function() {
            return 3 * 60;
        },
        FONT: function() {
            return 'monospace';
        },
        UNIT: function() {
            return {
                IMAGE: 'img/char.gif',
                CHIP_SIZE: 16,
                FRAME_SIZE: {
                    W: 4,
                    H: 3
                },
                FRAME_LINE: 16,
                FRAME_BLOCK: 48,
                FRAME: {
                    HUMAN: {
                        LANCER: 0,
                        WARRIOR: 4,
                        KNIGHT: 8,
                        ARCHER: 12,
                        CLELIC: 16,
                        FIRE_MAGE: 20,
                        FROST_MAGE: 24,
                        WIZARD: 28
                    },
                    UNDEAD: {
                        BONE_DOG: 32,
                        BONE_WARRIER: 36,
                        BONE_ARCHER: 40,
                        SPECTOR: 44,
                        BONE_SNAKE: 48,
                        GOLEM: 52,
                        SHADE: 56,
                        ARACHNE: 60
                    }
                },
                STATUS: {
                    HUMAN: {
                        WARRIOR: {
                            name: 'WARRIOR',
                            race: 'HUMAN',
                            frame: 0,
                            hp: 3,
                            speed: 2,
                            siege: 1,
                            reverse: 5,
                            attacked: function() {},
                            dead: function() {}
                        },
                        LANCER: {
                            name: 'LANCER',
                            race: 'HUMAN',
                            frame: 0,
                            frame: 4,
                            hp: 4,
                            speed: 2,
                            siege: 1,
                            reverse: 3,
                            attacked: function() {},
                            dead: function() {}
                        },
                        KNIGHT: {
                            name: 'KNIGHT',
                            race: 'HUMAN',
                            frame: 0,
                            frame: 8,
                            hp: 5,
                            speed: 1.8,
                            siege: 1,
                            reverse: 8,
                            attacked: function() {},
                            dead: function() {}
                        },
                        ARCHER: {
                            name: 'ARCHER',
                            race: 'HUMAN',
                            frame: 0,
                            frame: 12,
                            hp: 2,
                            speed: 2.2,
                            siege: 1,
                            reverse: 4,
                            attacked: function() {},
                            dead: function() {}
                        },
                        CLELIC: {
                            name: 'CLELIC',
                            race: 'HUMAN',
                            frame: 0,
                            frame: 48,
                            hp: 2,
                            speed: 1,
                            siege: 1,
                            reverse: 3,
                            attacked: function() {},
                            dead: function() {}
                        },
                        FIRE_MAGE: {
                            name: 'FIRE_MAGE',
                            race: 'HUMAN',
                            frame: 0,
                            frame: 52,
                            hp: 2,
                            speed: 1.6,
                            siege: 1,
                            reverse: 4,
                            attacked: function() {},
                            dead: function(obj) {
                                var mine = obj.mine,
                                    ef = new Effect({
                                        type: mine.type.toUpperCase(),
                                        etype: 'FIRE',
                                        x: mine.x,
                                        y: mine.y,
                                        frames: CONST_CASH.EFFECT.FRAME.FIRE
                                    });

                                setTimeout(function() {
                                    ef.end();
                                }, 10000);
                            }
                        },
                        FROST_MAGE: {
                            name: 'FROST_MAGE',
                            race: 'HUMAN',
                            frame: 0,
                            frame: 56,
                            hp: 2,
                            speed: 1.6,
                            siege: 1,
                            reverse: 4,
                            attacked: function() {},
                            dead: function(obj) {
                                var mine = obj.mine,
                                    ef = new Effect({
                                        type: mine.type.toUpperCase(),
                                        etype: 'FROST',
                                        x: mine.x,
                                        y: mine.y,
                                        frames: CONST_CASH.EFFECT.FRAME.FROST
                                    });

                                setTimeout(function() {
                                    ef.end();
                                }, 10000);
                            }
                        },
                        WIZARD: {
                            name: 'WIZARD',
                            race: 'HUMAN',
                            frame: 0,
                            frame: 60,
                            hp: 2,
                            speed: 1.6,
                            siege: 1,
                            reverse: 5,
                            attacked: function() {},
                            dead: function() {}
                        }
                    },
                    UNDEAD: {
                        BONE_DOG: {
                            name: 'BONE_DOG',
                            race: 'UNDEAD',
                            frame: 0,
                            frame: 96,
                            hp: 1,
                            speed: 2.8,
                            siege: 1,
                            reverse: 1,
                            attacked: function() {},
                            dead: function() {}
                        },
                        BONE_WARRIER: {
                            name: 'BONE_WARRIER',
                            race: 'UNDEAD',
                            frame: 100,
                            hp: 2,
                            speed: 2,
                            siege: 1,
                            reverse: 1,
                            attacked: function() {},
                            dead: function(obj) {
                                var mine = obj.mine,
                                    ef = new Effect({
                                        type: mine.type.toUpperCase(),
                                        etype: 'BONE',
                                        x: mine.x,
                                        y: mine.y,
                                        frames: CONST_CASH.EFFECT.FRAME.BONE
                                    });

                                setTimeout(function() {
                                    new Unit(
                                        propOverride({
                                            mode: mine.mode,
                                            x: mine.x - 16,
                                            y: mine.y - 16,
                                            moveVal: mine.moveVal
                                        }, CONST_CASH.UNIT.STATUS[mine.race][mine.name])
                                    );
                                    ef.end();
                                }, 5000);
                            }
                        },
                        BONE_ARCHER: {
                            name: 'BONE_ARCHER',
                            race: 'UNDEAD',
                            frame: 104,
                            hp: 1,
                            speed: 2,
                            siege: 1,
                            reverse: 1,
                            attacked: function() {},
                            dead: function() {}
                        },
                        SHADE: {
                            name: 'SHADE',
                            race: 'UNDEAD',
                            frame: 108,
                            hp: 1,
                            speed: 1.8,
                            siege: 9,
                            reverse: 3,
                            attacked: function() {},
                            dead: function() {}
                        },
                        BONE_SNAKE: {
                            name: 'BONE_SNAKE',
                            race: 'UNDEAD',
                            frame: 144,
                            hp: 2,
                            speed: 2.6,
                            siege: 1,
                            reverse: 1,
                            attacked: function() {},
                            dead: function() {}
                        },
                        GOLEM: {
                            name: 'GOLEM',
                            race: 'UNDEAD',
                            frame: 148,
                            hp: 7,
                            speed: 1,
                            siege: 1,
                            reverse: 6,
                            attacked: function() {},
                            dead: function() {}
                        },
                        SPECTOR: {
                            name: 'SPECTOR',
                            race: 'UNDEAD',
                            frame: 152,
                            hp: 1,
                            speed: 1.8,
                            siege: 0,
                            reverse: 3,
                            attacked: function() {},
                            dead: function() {}
                        },
                        ARACHNE: {
                            name: 'ARACHNE',
                            race: 'UNDEAD',
                            frame: 156,
                            hp: 3,
                            speed: 2,
                            siege: 1,
                            reverse: 4,
                            attacked: function(obj) {
                                var mine = obj.mine,
                                    enemy = obj.enemy;
                                enemy.reverse = 9;
                                enemy.speed /= 2;
                            },
                            dead: function() {}
                        }
                    }
                },
                AI: {
                    USER: [
                        {
                            direction: 0,
                            prop: 'y',
                            sign: -1,
                            order: [
                                1,
                                3,
                                0,
                                2
                            ]
                        },
                        {
                            direction: 3,
                            prop: 'x',
                            sign: -1,
                            order: [
                                0,
                                2,
                                3,
                                1
                            ]
                        },
                        {
                            direction: 1,
                            prop: 'x',
                            sign: 1,
                            order: [
                                0,
                                2,
                                1,
                                3
                            ]
                        },
                        {
                            direction: 2,
                            prop: 'y',
                            sign: 1,
                            order: [
                                3,
                                1,
                                2,
                                0
                            ]
                        }
                    ],
                    ENEMY: [
                        {
                            direction: 2,
                            prop: 'y',
                            sign: 1,
                            order: [
                                3,
                                1,
                                2,
                                0
                            ]
                        },
                        {
                            direction: 3,
                            prop: 'x',
                            sign: -1,
                            order: [
                                2,
                                0,
                                3,
                                1
                            ]
                        },
                        {
                            direction: 1,
                            prop: 'x',
                            sign: 1,
                            order: [
                                2,
                                0,
                                1,
                                3
                            ]
                        },
                        {
                            direction: 0,
                            prop: 'y',
                            sign: -1,
                            order: [
                                3,
                                1,
                                0,
                                2
                            ]
                        }
                    ]
                }
            };
        },
        THUMB: function() {
            return {
                IMAGE: 'img/thumb.png',
                CHIP_SIZE: 48,
                FRAME: {
                    HUMAN: {
                        LANCER: 0,
                        WARRIOR: 1,
                        KNIGHT: 2,
                        ARCHER: 3,
                        CLELIC: 4,
                        FIRE_MAGE: 5,
                        FROST_MAGE: 6,
                        WIZARD: 7
                    },
                    UNDEAD: {
                        BONE_DOG: 8,
                        BONE_SNAKE: 9,
                        BONE_WARRIER: 10,
                        BONE_ARCHER: 11,
                        GOLEM: 12,
                        ARACHNE: 13,
                        SHADE: 14,
                        SPECTOR: 15
                    }
                },
                USER: {
                    POSITION: [
                        [0, 384],
                        [48, 384],
                        [96, 384],
                        [144, 384],
                        [0, 432],
                        [48, 432],
                        [96, 432],
                        [144, 432]
                    ]
                },
                ENEMY: {},
                PROP: {}
            };
        },
        SCORE: function() {
            return {
                POSITION: [20, 7]
            };
        },
        COUNTDOWN: function() {
            return {
                POSITION: [200, 7]
            };
        },
        STATUS_VIEWER: function() {
            return {
                IMAGE: 'img/window_status.png',
                POSITION: [192, 384],
                BG_SIZE: [128, 96]
            };
        },
        MAP: function() {
            return {
                IMAGE: 'img/map.png',
                W: 320, H: 480, CHIP_SIZE: 32
            };
        },
        CASTLE: function() {
            return {
                FRAME: [
                    {
                        NORMAL: 8,
                        BRAKE: 9
                    },
                    {
                        NORMAL: 10,
                        BRAKE: 11
                    },
                    {
                        NORMAL: 12,
                        BRAKE: 13
                    },
                    {
                        NORMAL: 14,
                        BRAKE: 15
                    }
                ],
                PROP: {
                    frame: 0,
                    brake: 0,
                    hp: 2,
                    mhp: 2,
                    unitX: 0,
                    unitY: 0
                }
            };
        },
        EFFECT: function() {
            return {
                IMAGE: 'img/effect.gif',
                FRAME: {
                    EXPLOSION: {
                        start: 0,
                        end: 5,
                        rate: 3,
                        loop: false
                    },
                    FIRE: {
                        start: 6,
                        end: 8,
                        rate: 50,
                        loop: true
                    },
                    FROST: {
                        start: 12,
                        end: 12,
                        rate: 1000,
                        loop: true
                    },
                    BONE: {
                        start: 18,
                        end: 18,
                        rate: 1000,
                        loop: true
                    }
                }
            };
        },
        SOUND: function() {
            return {
                BGM: 'sound/bgm.wav',
                EFFECT: {
                    EXPLOSION: 'sound/explosion.wav'
                }
            };
        },
        TYPE: function() {
            return {
                CASTLE: 'CASTLE',
                THUMB: 'THUMB',
                UNIT: 'UNIT',
                EFFECT: 'EFFECT'
            };
        },
        HAVE: function() {
            return {
                USER: 'USER',
                ENEMY: 'ENEMY'
            };
        },
        POINT: function() {
            return {
                UNIT: 10,
                CASTLE: 1000,
                WIN: 5000,
                LOSE: -5000,
                TIME: 100
            };
        }
    };
};

CONST_CASH = CONST();
CONST_CASH = {
    TIMELIMIT: CONST_CASH.TIMELIMIT(),
    FONT: CONST_CASH.FONT(),
    UNIT: CONST_CASH.UNIT(),
    THUMB: CONST_CASH.THUMB(),
    SCORE: CONST_CASH.SCORE(),
    COUNTDOWN: CONST_CASH.COUNTDOWN(),
    STATUS_VIEWER: CONST_CASH.STATUS_VIEWER(),
    MAP: CONST_CASH.MAP(),
    CASTLE: CONST_CASH.CASTLE(),
    EFFECT: CONST_CASH.EFFECT(),
    SOUND: CONST_CASH.SOUND(),
    TYPE: CONST_CASH.TYPE(),
    HAVE: CONST_CASH.HAVE(),
    POINT: CONST_CASH.POINT()
};
/**
 * game init
 * @param {Object} config Config Object.
 */
var init = function(config) {
    var img = {
            UNIT: CONST_CASH.UNIT.IMAGE,
            THUMB: CONST_CASH.THUMB.IMAGE,
            MAP: CONST_CASH.MAP.IMAGE,
            EFFECT: CONST_CASH.EFFECT.IMAGE,
            STATUS_VIEWER: CONST_CASH.STATUS_VIEWER.IMAGE
        },
        sound = {
            BGM: CONST_CASH.SOUND.BGM,
            EFFECT: {
                EXPLOSION: CONST_CASH.SOUND.EFFECT.EXPLOSION
            }
        },
        size = {
            W: CONST_CASH.MAP.W,
            H: CONST_CASH.MAP.H
        },
        castle_point = MAP.CASTLE,
        collision = MAP.COLLISION,
        chipset, i, len;

    //set map
    /* MAP.BASE = chipset = RandamMap(); */
    MAP.BASE = chipset = config.map;

    for (i = 0, len = chipset.length; i < len; i++) {
        chipset[i] = chipset[i].split('');
    }

    //mapdata init
    (function() {
        var datamap = {
                //don't move
                '0': 0,
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                '5': 0,
                '6': 0,
                '7': 0,
                '24': 0,
                '26': 0,
                '27': 0,
                '28': 0,
                '29': 0,
                '30': 0,
                '31': 0,
                '32': 0,
                '33': 0,
                '34': 0,
                '35': 0,
                '36': 0,
                '37': 0,
                '38': 0,
                '39': 0,
                '40': 0,
                '41': 0,
                '42': 0,
                '43': 0,
                '44': 0,
                '45': 0,
                '46': 0,
                '47': 0,
                '48': 0,
                '49': 0,
                '50': 0,
                '51': 0,
                '52': 0,
                //castle (25:enemy 99:user)
                '25': [0, 0, 1, 0],
                '99': [1, 0, 0, 0],
                //can move
                '16': [1, 0, 1, 0],
                '17': [0, 1, 0, 1],
                '18': [1, 1, 1, 0],
                '19': [1, 0, 1, 1],
                '20': [0, 1, 1, 0],
                '21': [0, 0, 1, 1],
                '22': [1, 1, 0, 0],
                '23': [1, 0, 0, 1]
            },
            map_start_line = [
                [26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 2]
            ],
            map_end_line = [
                [5, 6, 6, 6, 6, 6, 6, 6, 6, 7],
                [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
                [46, 47, 48, 49, 50, 51, 52, 46, 47, 48],
                [49, 50, 51, 52, 51, 52, 46, 47, 48, 49]
            ],
            i,
            j,
            ilen,
            jlen,
            calc1,
            calc2,
            res = [],
            txt2num = function(txt) {
                switch (txt) {
                    case '│':
                        txt = 16;
                        break;
                    case '─':
                        txt = 17;
                        break;
                    case '├':
                        txt = 18;
                        break;
                    case '┤':
                        txt = 19;
                        break;
                    case '┌':
                        txt = 20;
                        break;
                    case '┐':
                        txt = 21;
                        break;
                    case '└':
                        txt = 22;
                        break;
                    case '┘':
                        txt = 23;
                        break;
                    case '×':
                        txt = 24;
                        break;
                    case '■':
                        txt = 25;
                        break;
                    case '□':
                        txt = 99;
                        break;
                    default:
                        break;
                }
                return txt;
            };

        chipset = [].concat(map_start_line, chipset, map_end_line);

        for (i = 0, ilen = chipset.length; i < ilen; i++) {
            calc1 = res[i] = [];
            calc2 = chipset[i];
            if (calc2.length === 8) {
                chipset[i] = calc2 = ['3'].concat(calc2, '4');
                var a = 1;
            }
            /* calc2 = chipset[i] = calc2.split(''); */
            for (j = 0, jlen = calc2.length; j < jlen; j++) {
                calc2[j] = txt2num(calc2[j]);
                calc1[j] = datamap[calc2[j]];

                switch (calc2[j]) {
                    case 25:
                        castle_point.ENEMY.push([j, i]);
                        break;
                    case 99:
                        castle_point.USER.push([j, i]);
                        calc2[j] = 25;
                        break;
                    default:
                        break;
                }
            }
        }
        MAP.BASE = chipset;
        MAP.COLLISION = res;
    }());

    //new Game
    AW.GAME = GAME = new Game(size.W, size.H);
    //preload set
    GAME.preload(
        img.UNIT,
        img.THUMB,
        img.MAP,
        img.EFFECT,
        img.STATUS_VIEWER,
        /* sound.BGM, */
        sound.EFFECT.EXPLOSION
    );
    //Game onloadSet
    GAME.onload = Amida;
    //Game Start
    GAME.start();
};
var RandamMap = function() {
    var map = [
        ['■', '×', '■', '×', '■', '×', '■', '×'],
        ['×', '×', '×', '×', '×', '×', '×', '×'],
        ['×', '×', '×', '×', '×', '×', '×', '×'],
        ['×', '×', '×', '×', '×', '×', '×', '×'],
        ['×', '×', '×', '×', '×', '×', '×', '×'],
        ['×', '×', '×', '×', '×', '×', '×', '×'],
        ['×', '×', '×', '×', '×', '×', '×', '×'],
        ['×', '×', '×', '×', '×', '×', '×', '×'],
        ['×', '□', '×', '□', '×', '□', '×', '□']
    ],
    LINES = 3, // 引く本数
    castleNum = 4,
    castleBeyond = map.length - 2,
    canputline = map[0].length - 2,
    arr = [],
    i, j, x, y, r, a, len, chip, chip0, chip1, chip2, chip3, flg,
    MF = Math.floor, MR = Math.random;

    // 敵と味方の城を結びつける
    for (i = 0; i < castleNum; i++) {
        y = i * 2; // 水平方向の位置
        r = MF(MR() * castleBeyond) + 1; // 曲がる場所

        for (j = 1; j <= castleBeyond; j++) {
            chip = map[j];
            if (j === r) {
                chip[y] = '└';
                chip[y + 1] = '┐';
                y = y + 1; // 横にひとつずれる
            }
            else {
                chip[y] = '│';
            }
        }
    }

    // 横線が引ける場所を把握
    for (i = 0; i < canputline; i++) {
        for (j = 1; j <= castleBeyond; j++) {
            chip = map[j];
            chip0 = chip[i];
            if (chip0 === '│') {
                chip1 = chip[i + 1];
                chip2 = chip[i + 2];
                chip3 = chip[i + 3];

                // 横線が引けるのは 3 パターン。適当に網羅。
                if (
                    chip1 === '│' ||
                    (
                        chip1 === '×' &&
                        chip2 === '│'
                    ) || (
                        i + 3 <= 7 &&
                        chip1 === '×' &&
                        chip2 === '×' &&
                        chip3 === '│'
                    )
                ) {
                    arr.push({
                        x: i,
                        y: j
                    });
                }
            }
        }
    }

    // 横線が引ける場所をランダムに並べ替え
    len = arr.length - 1;
    for (i = 0; i < 100; i++) {
        r = MF(MR() * len) + 1;
        a = arr[0];
        arr[0] = arr[r];
        arr[r] = a;
    }

    // 横線を引く
    for (i = 0; i < arr.length && i < LINES; i++) {
        chip = arr[i];
        x = chip.x;
        y = chip.y;

        chip = map[y];
        chip1 = x + 1;
        chip2 = x + 2;
        chip3 = x + 3;

        // 横線が引けるのは 3 パターン。例によって網羅。
        // 隣に縦線の場合
        if (chip[x] === '│' && chip[chip1] === '│') {
            chip[x] = '├';
            chip[chip1] = '┤';
        }
        // ひとつ空けて縦線の場合
        else if (
            chip[x] === '│' &&
            chip[chip1] === '×' &&
            chip[chip2] === '│'
        ) {
            chip[x] = '├';
            chip[chip1] = '─';
            chip[chip2] = '┤';
        }
        // ふたつ空けて縦線の場合
        else if (
            chip[x] === '│' &&
            chip[chip1] === '×' &&
            chip[chip2] === '×' &&
            chip[chip3] === '│'
        ) {
            chip[x] = '├';
            chip[chip1] = '─';
            chip[chip2] = '─';
            chip[chip3] = '┤';
        }
        // 横線が引けなくなってた場合（他に横線を引いた影響で）
        else {
            arr.splice(i, 1);
            i--;
        }
    }

    // 2 次元配列を 1 次元配列に
    for (i = 0, len = map.length; i < len; i++) {
        map[i] = map[i].join('');
    }
    return map;
};
var RaceSelect = function() {
    var thumbcons = CONST_CASH.THUMB,
        chip_size = thumbcons.CHIP_SIZE,
        sta_human = thumbcons.FRAME.HUMAN,
        sta_undead = thumbcons.FRAME.UNDEAD,
        scene = new Scene(),
        image = GAME.assets[thumbcons.IMAGE],
        bg_image = GAME.assets[CONST_CASH.STATUS_VIEWER.IMAGE],
        human = new Group(),
        human_thumb = new Sprite(chip_size, chip_size),
        human_label = new Label(),
        human_txt = new Label(),
        human_bg = new Sprite(250, 100),
        undead = new Group(),
        undead_thumb = new Sprite(chip_size, chip_size),
        undead_label = new Label(),
        undead_txt = new Label(),
        undead_bg = new Sprite(250, 100),
        selectAfter = function(config) {
            var i,
                len,
                name,
                order,
                pos,
                id,
                numlabel = new Label(),
                thumbs = THUMBS.USER,
                user_mode = CONST_CASH.HAVE.USER,
                cons_user = thumbcons.USER,
                positions = cons_user.POSITION,
                frames = thumbcons.FRAME;

            //set user race
            USER_RACE = config.race;

            //set order
            order = config.order;

            //set user order
            for (i = 0, len = order.length; i < len; i++) {
                name = order[i].toUpperCase();
                pos = positions[i];
                USER_ORDER[i] = {
                    name: name,
                    onMap: false
                };
                thumbs[i] = new Thumb({
                    mode: user_mode,
                    name: name,
                    frame: frames[USER_RACE][name],
                    x: pos[0],
                    y: pos[1]
                });
            }

            numlabel.text = '③';
            numlabel.font = '150px/1.5 ' + CONST_CASH.FONT;
            numlabel.color = '#fff';
            numlabel.x = 90;
            numlabel.y = 100;

            GAME.rootScene.addChild(numlabel);
            LABEL.STATUS_VIEWER.init();

            GAME.popScene();
            aid = setTimeout(function() {
                numlabel.text = '②';
                aid = setTimeout(function() {
                    numlabel.text = '①';
                    aid = setTimeout(function() {
                        MAP.PATH.vibrate(3);

                        //set user order
                        for (i = 0, len = order.length; i < len; i++) {
                            thumbs[i].init();
                        }
                        Log.init();
                        EnemyAction.init();
                        LABEL.COUNTDOWN.init();
                        GAME.rootScene.removeChild(numlabel);
                    }, 1000);
                }, 1000);
            }, 1000);

            return USER_RACE;
        };

    //scene config
    scene.backgroundColor = 'rgba(0,0,0,0.3)';

    //set image
    human_thumb.image = undead_thumb.image = image;
    human_bg.image = undead_bg.image = bg_image;
    human_bg.frame = undead_bg.frame = 1;

    //set bg
    human.addChild(human_bg);
    undead.addChild(undead_bg);

    //set position
    human.x = undead.x = 35;
    human.y = 100;
    undead.y = 220;

    //set frame
    human_thumb.frame = sta_human.KNIGHT;
    undead_thumb.frame = sta_undead.BONE_WARRIER;
    human_thumb.x = undead_thumb.x = 5;
    human_thumb.y = undead_thumb.y = 5;

    //set label
    human_label.font =
    human_txt.font =
    undead_label.font =
    undead_txt.font = '12px/1.5 ' + CONST_CASH.FONT;
    human_label.color =
    human_txt.color =
    undead_label.color =
    undead_txt.color = '#ddd';
    human_label.text = '<b>HUMAN</b>';
    undead_label.text = '<b>UNDEAD</b>';
    human_txt.text = '使いやすく、高性能な種族。バランスが良く扱いやすい。';
    undead_txt.text = '扱いづらい尖った性能を持つユニットが多い種族。<br />操作量に自信がある人向け。';
    human_label.x = undead_label.x = 50;
    human_label.y = undead_label.y = 5;
    human_txt.width = undead_txt.width = 200;
    human_txt.x = undead_txt.x = 50;
    human_txt.y = undead_txt.y = 23;

    //add child
    human.addChild(human_thumb);
    human.addChild(human_label);
    human.addChild(human_txt);
    undead.addChild(undead_thumb);
    undead.addChild(undead_label);
    undead.addChild(undead_txt);

    //set scene
    scene.addChild(human);
    scene.addChild(undead);

    human.addEventListener(enchant.Event.TOUCH_END, function() {
        return selectAfter({
            race: 'HUMAN',
            order: [
                'LANCER',
                'WARRIOR',
                'KNIGHT',
                'ARCHER',
                'CLELIC',
                'FIRE_MAGE',
                'FROST_MAGE',
                'WIZARD'
            ]
        });
    });
    undead.addEventListener(enchant.Event.TOUCH_END, function() {
        return selectAfter({
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
    });

    GAME.pushScene(scene);

    return {
        select: selectAfter
    };
};
var Amida = function() {
    var chip_size = CONST_CASH.MAP.CHIP_SIZE,
        chipset = MAP.BASE,
        map = new Map(chip_size, chip_size),
        map_image = GAME.assets[CONST_CASH.MAP.IMAGE],
        group_user = GROUP.USER,
        user_castle = group_user.CASTLE,
        group_enemy = GROUP.ENEMY,
        enemy_castle = group_enemy.CASTLE,
        castle_frames = CONST_CASH.CASTLE.FRAME,
        user_mode = CONST_CASH.HAVE.USER,
        castle_point = MAP.CASTLE,
        castle_bases = GROUP.MAP_OPTION.CASTLE_BASE,
        thumb_bases = GROUP.MAP_OPTION.THUMB_BASE,
        effect_unit = GROUP.EFFECT.UNIT,
        root = GAME.rootScene,
        unit_chip_size = CONST_CASH.UNIT.CHIP_SIZE,
        score_position = CONST_CASH.SCORE.POSITION,
        countdown, countdown_position = CONST_CASH.COUNTDOWN.POSITION,
        statusviewer, statusviewer_position = CONST_CASH.STATUS_VIEWER.POSITION,
        i, j, len, ary, castle, score, animeID,
        DOMStyle;

    DOM = document.getElementById('enchant-stage');
    DOMStyle = DOM.style;

    //map set
    map.image = map_image;
    map.loadData(chipset);

    //map vibration
    /**
     * vibration map
     * @param {Number} num vibrate value.
     */
    map.vibrate = function(num) {
        num += 'px';

        clearInterval(animeID);
        animeID = setTimeout(function() {
            DOMStyle.top = 0;
            DOMStyle.left = num;
            animeID = setTimeout(function() {
                DOMStyle.top = num;
                DOMStyle.left = 0;
                animeID = setTimeout(function() {
                    DOMStyle.top = 0;
                    DOMStyle.left = '-' + num;
                    animeID = setTimeout(function() {
                        DOMStyle.top = 0;
                        DOMStyle.left = 0;
                    }, 30);
                }, 30);
            }, 30);
        }, 30);
    };

    //map methods
    /**
     * get naw squere
     * @param {Object} obj object point object.
     * @return {Object} x & y object.
     */
    map.getSquere = function(obj) {
        var x, y, f = Math.floor;

        map.getSquere = function(obj) {
            x = f(obj.x / chip_size);
            y = f(obj.y / chip_size);

            return {
                x: x,
                y: y
            };
        };

        return map.getSquere(obj);
    };

    /**
     * get map colision
     * @param {Object} obj object collision check.
     * @return {Boolean|Object} false or collision object.
     */
    map.getCollision = function(obj) {
        var unitPoint = map.getSquere(obj),
            mc = MAP.COLLISION,
            ret = false,
            calc = 0,
            i,
            j,
            len,
            castles,
            castle;

        if (
            (mc = mc[unitPoint.y]) &&
            (mc = mc[unitPoint.x])
        ) {
            if (mc[0] + mc[1] + mc[2] + mc[3] === 1) {
                for (i in CASTLE) {
                    if (CASTLE.hasOwnProperty(i) === true) {
                        castles = CASTLE[i];
                        for (j = 0, len = castles.length; j < len; j++) {
                            castle = castles[j];
                            if (obj.intersect(castle) === true) {
                                if (castle.checkBreak() === true) {
                                    if (castle.mode !== user_mode) {
                                        ret = [0, 0, 1, 0];
                                    }
                                    else {
                                        ret = [1, 0, 0, 0];
                                    }
                                }
                                else {
                                    ret = castle;
                                }
                                break;
                            }
                        }
                    }
                }
            }
            else {
                ret = mc;
            }
        }
        return ret;
    };
    //set global
    MAP.PATH = map;

    //status viewer set
    statusViewer = LABEL.STATUS_VIEWER = new StatusViwer({
        mode: user_mode,
        x: statusviewer_position[0],
        y: statusviewer_position[1]
    });

    //score label set
    score = LABEL.SCORE = new Score({
        mode: user_mode,
        x: score_position[0],
        y: score_position[1]
    });

    //countdown label set
    countdown = LABEL.COUNTDOWN = new Countdown({
        x: countdown_position[0],
        y: countdown_position[1]
    });
    countdown.update();

    //castle set
    for (i in castle_point) {
        if (castle_point.hasOwnProperty(i) === true) {
            ary = castle_point[i];
            for (j = 0, len = ary.length; j < len; j++) {
                castle = new Castle({
                    mode: i,
                    frame: castle_frames[j].NORMAL,
                    brake: castle_frames[j].BRAKE,
                    x: ary[j][0] * chip_size,
                    y: ary[j][1] * chip_size
                });
                castle.unitX = castle.x + unit_chip_size / 2;
                castle.unitY = castle.y + unit_chip_size / 2;
            }
        }
    }

    //depth set
    root.addChild(map);
    root.addChild(castle_bases);
    root.addChild(statusViewer);
    root.addChild(thumb_bases);
    root.addChild(group_enemy.CASTLE);
    root.addChild(group_enemy.UNIT);
    root.addChild(group_user.UNIT);
    root.addChild(group_user.CASTLE);
    root.addChild(group_user.THUMB);
    root.addChild(group_enemy.THUMB);
    root.addChild(effect_unit);
    root.addChild(score.label);
    root.addChild(countdown);

    //set sound
    SOUND.EFFECT.EXPLOSION =
    GAME.assets[CONST_CASH.SOUND.EFFECT.EXPLOSION];

    //Battle init
    Battle.init();

    //surveillant setting
    (function() {
        var end = false,
            have = CONST_CASH.HAVE,
            /**
             * game end action
             */
            endAction = function() {
                var result = new Result(end);

                Surveillant.end();
                EnemyAction.end();
                countdown.stop();
                GAME.end();
                Log.end();
            };

        Surveillant.add(function() {
            if (gameStart === true) {
                var raceSelect = new RaceSelect();
                countdown.setAfter(function() {
                    end = true;
                    endAction();
                    return true;
                });
                Surveillant.remove('playStart');
                return true;
            }
            return false;
        }, 'playStart');
        Surveillant.add(function() {
            var i, j, len, castles, castle, count;

            if (end !== false) {
                endAction();
                return true;
            }
            for (i in CASTLE) {
                if (CASTLE.hasOwnProperty(i) === true) {
                    castles = CASTLE[i];
                    len = castles.length;
                    count = 0;
                    for (j = 0; j < len; j++) {
                        castle = castles[j];
                        if (castle.hp > 0) {
                            break;
                        }
                        else {
                            count++;
                        }
                    }
                    if (count === len) {
                        end = i;
                        break;
                    }
                }
            }
            return false;
        }, 'playEnd');
        Surveillant.init();
    }());

    return map;
};
/**
 * Create castle object
 * @param {Object} config Config object.
 * @return {Object} castle object.
 */
var Castle = function(config) {
    var size = CONST_CASH.MAP.CHIP_SIZE,
        image = GAME.assets[CONST_CASH.MAP.IMAGE],
        prop = CONST().CASTLE().PROP,
        mode = config.mode.toUpperCase(),
        have = CONST_CASH.HAVE,
        sprite = new Sprite(size, size),
        castle_bases = GROUP.MAP_OPTION.CASTLE_BASE,
        castle_base, opacity_sign = -1, blinkControll;

    //castle base set
    castle_base = new Sprite(size, size);
    castle_base.image = image;
    castle_base.frame = 24;
    if (mode === have.USER) {
        castle_base.frame = 16;
    }
    castle_base.x = config.x;
    castle_base.y = config.y;
    addLayer({
        layer: castle_bases,
        sprite: castle_base
    });
    prop.base = castle_base;

    //default override
    prop = propOverride(prop, config);

    //sprite setting
    sprite.image = image;
    sprite = propOverride(sprite, prop);

    //set type
    sprite.type = CONST_CASH.TYPE.CASTLE;

    //add array
    CASTLE[mode].push(sprite);

    //unit drop
    /**
     * touch over thumb
     */
    sprite.focusOn = function() {
        sprite.scaleX = sprite.scaleY = 1.4;
        sprite.focus = true;
    };
    /**
     * touch out thumb
     */
    sprite.focusOff = function() {
        sprite.scaleX = sprite.scaleY = 1;
        sprite.focus = false;
    };

    /**
     * opacity toggle
     */
    blinkControll = function() {
        if (GAME.frame % 2 === 0) {
            sprite.opacity += 0.1 * opacity_sign;
            if (sprite.opacity <= 0.5) {
                opacity_sign = 1;
            }
            else if (sprite.opacity >= 1) {
                opacity_sign = -1;
            }
        }
    };
    /**
     * set enterframe blink
     */
    sprite.blinkOn = function() {
        sprite.addEventListener(enchant.Event.ENTER_FRAME, blinkControll);
    };
    /**
     * remove enterframe blink
     */
    sprite.blinkOff = function() {
        sprite.removeEventListener(enchant.Event.ENTER_FRAME, blinkControll);
        sprite.opacity = 1;
    };

    /**
     * damage process
     * @param {Object} unit Unit object.
     */
    sprite.damage = function(unit) {
        sprite.hp -= unit.siege;

        if (sprite.hp <= 0) {
            sprite.hp = 0;
            sprite.broke();
        }
        else if (sprite.mhp / 2 >= sprite.hp) {
            sprite.frame = sprite.brake;
        }
    };
    /**
     * unit break process
     */
    sprite.broke = function() {
        sprite.hp = sprite.opacity = sprite.base.opacity = 0;
    };
    /**
     * check unit break
     * @return {Boolean} return break flg.
     */
    sprite.checkBreak = function() {
        if (sprite.hp === 0) {
            return true;
        }
        return false;
    };

    //add Layer
    return addLayer({
        layer: GROUP[mode].CASTLE,
        sprite: sprite
    });
};
/**
 * Create thumbnail object
 * @param {Object} config Config Object.
 * @return {Object} Thumb Object.
 */
var Thumb = function(config) {
    var size = CONST_CASH.THUMB.CHIP_SIZE,
        image = GAME.assets[CONST_CASH.THUMB.IMAGE],
        prop = CONST().THUMB().PROP,
        unitData = CONST_CASH.UNIT.STATUS[USER_RACE][config.name],
        mode = config.mode.toUpperCase(),
        sprite = new Sprite(size, size),
        bg = new Sprite(size, size),
        originX, originY,
        defaultX, defaultY,
        eEv = enchant.Event,
        statusViwer = LABEL.STATUS_VIEWER,
        countdown = new Label(),
        /**
         * effect focus castle
         * @param {Object} obj Castle Object.
         * @return {Object|Boolean} focus flg or castle.
         */
        focusMyCastle = function(obj) {
            var hit = false,
                castles = CASTLE.USER,
                castle,
                i, len,
                flg = true;

            for (i = 0, len = castles.length; i < len; i++) {
                castle = castles[i];
                if (flg === true && obj.intersect(castle) === true) {
                    castle.focusOn();
                    flg = false;
                }
                else {
                    castle.focusOff();
                }
            }
            return hit;
        },
        /**
         * hit thumbnail to castle
         * @param {Object} obj Castle Object.
         * @return {Object|Boolean} hit flg or castle.
         */
        hitMyCastle = function(obj) {
            var hit = false,
                castles = CASTLE.USER,
                castle,
                i,
                len;

            for (i = 0, len = castles.length; i < len; i++) {
                castle = castles[i];
                if (obj.intersect(castle) === true) {
                    hit = castle;
                    break;
                }
            }
            return hit;
        },
        /**
         * effect drag process
         */
        dragOnCastle = function() {
            var castles = CASTLE.USER,
                castle,
                i, len;

            for (i = 0, len = castles.length; i < len; i++) {
                castle = castles[i];
                if (castle.checkBreak() === false) {
                    castle.blinkOn();
                }
            }
        },
        /**
         * stop effect drag process
         */
        dragOffCastle = function() {
            var castles = CASTLE.USER,
                castle,
                i,
                len;

            for (i = 0, len = castles.length; i < len; i++) {
                castle = castles[i];
                if (castle.checkBreak() === false) {
                    castle.blinkOff();
                }
            }
        };

    //thumb bg set
    bg.image = image;
    bg.frame = 16;
    bg.x = config.x;
    bg.y = config.y;

    addLayer({
        layer: GROUP.MAP_OPTION.THUMB_BASE,
        sprite: bg
    });

    //countdown set
    countdown.text = Math.ceil(unitData.reverse);
    countdown.font = '24px ' + CONST_CASH.FONT;
    countdown.color = '#ccc';
    countdown.x = config.x + 17;
    countdown.y = config.y + 7;

    addLayer({
        layer: GROUP.MAP_OPTION.THUMB_BASE,
        sprite: countdown
    });

    //default override
    prop = propOverride(prop, config);

    //sprite setting
    sprite.image = image;
    sprite = propOverride(sprite, prop);

    //set unit data
    sprite.unit = {
        mode: mode
    };
    sprite.unit = propOverride(sprite.unit, unitData);

    //set type
    sprite.type = CONST_CASH.TYPE.THUMB;

    //set default
    defaultX = sprite.x;
    defaultY = sprite.y;

    //set drag action
    sprite.addEventListener(eEv.TOUCH_START, function(e) {
        if (this.canDrag === true) {
            originX = e.x - this.x;
            originY = e.y - this.y;
            /* dragOnCastle(); */
        }
        statusViwer.update(sprite.unit);
    });
    sprite.addEventListener(eEv.TOUCH_MOVE, function(e) {
        if (this.canDrag === true) {
            this.x = e.x - originX;
            this.y = e.y - originY;
            /* focusMyCastle(this); */
        }
    });
    sprite.addEventListener(eEv.TOUCH_END, function(e) {
        if (this.canDrag === true) {
            var hit = hitMyCastle(this);
            if (hit !== false) {
                //thumb can't drag
                this.dragStop();

                //set unit point
                this.unit.x = hit.unitX;
                this.unit.y = hit.unitY;

                //create unit
                this.lastUnit = new Unit(this.unit);
                this.lastUnit.thumb = this;

                /* hit.focusOff(); */
            }
            this.x = defaultX;
            this.y = defaultY;
            /* dragOffCastle(); */
        }
    });

    //sprite drag
    /**
     * can sprite drag
     */
    sprite.dragStart = function() {
        sprite.canDrag = true;
        sprite.opacity = 1;
    };
    /**
     * can't sprite drag
     */
    sprite.dragStop = function() {
        sprite.canDrag = false;
        sprite.opacity = 0;
    };

    //reverse
    /**
     * reverse process
     * @param {Object} unit Unit object.
     */
    sprite.reverse = function(unit) {
        var count = Math.ceil(unit.reverse),
            id = setInterval(function() {
                count--;
                countdown.text = count;
                if (count === 0) {
                    countdown.text = '';
                    sprite.dragStart();
                    clearInterval(id);
                }
            }, 1000);

        countdown.text = count;
        sprite.opacity = 0.3;
        return true;
    };

    //add array
    THUMBS[mode].push(sprite);

    //set dragmode
    sprite.dragStop();
    sprite.opacity = 0.3;

    /**
     * init unit object
     */
    sprite.init = function() {
        return sprite.reverse(sprite.unit);
    };

    //add Layer
    return addLayer({
        layer: GROUP[mode].THUMB,
        sprite: sprite
    });
};
/**
 * Create unit object
 * @param  {Object} config Config Object.
 * @return  {Object} Unit Object.
 */
var Unit = function(config) {
    var size = CONST_CASH.UNIT.CHIP_SIZE,
        map_chip_size = CONST_CASH.MAP.CHIP_SIZE,
        unit_size_diff_x = size / 2,
        unit_size_diff_y = size / 8,
        moveVal = unit_size_diff_x,
        image = GAME.assets[CONST_CASH.UNIT.IMAGE],
        mode = config.mode.toUpperCase(),
        sprite = new Sprite(size, size),
        hplabel = new Label(),
        have = CONST_CASH.HAVE,
        line_num = CONST_CASH.UNIT.FRAME_LINE,
        walk_count = 0, walk_true = 0,
        ai = CONST_CASH.UNIT.AI[mode],
        chip_direction, default_frame,
        mapPoint,
        checkMoveSquere,
        getCollision,
        walk,
        move;

    //can user override prop
    sprite.direction = 0;
    sprite.image = image;
    sprite = propOverride(sprite, config);

    if (sprite.moveVal) {
        moveVal = sprite.moveVal;
    }

    //hp label
    sprite.hplabel = hplabel;
    hplabel.x = config.x - 2;
    hplabel.y = config.y - 14;
    hplabel.font = '9px ' + CONST_CASH.FONT;
    hplabel.color = '#FAA';
    hplabel.backgroundColor = 'rgba(0,0,0,0.5)';
    hplabel.width = 20;
    hplabel.update = function() {
        hplabel.text = '†' + sprite.hp;
    };
    hplabel.update();

    addLayer({
        layer: GROUP[mode].UNIT,
        sprite: hplabel
    });

    //set Class
    sprite.type = CONST_CASH.TYPE.UNIT;

    /**
     * unit attack process
     * @param {Object} vsUnit Unit Object.
     * @param {Number} damage damage point.
     * @return {Number} vsUnit hit point.
     */
    sprite.attack = function(vsUnit, damage) {
        vsUnit.hp -= damage;
        sprite.attacked({
            mine: vsUnit,
            enemy: sprite
        });
        vsUnit.hplabel.update();
        if (vsUnit.hp <= 0) {
            vsUnit.moveVal = moveVal;
            vsUnit.dead({
                mine: vsUnit,
                enemy: sprite
            });
            vsUnit.kill();
        }
        return vsUnit.hp;
    };
    /**
     * unit kill process
     * @return {Boolean} true.
     */
    sprite.kill = function() {
        var x = sprite.x,
            y = sprite.y,
            effect = new Effect({
                type: sprite.type.toUpperCase(),
                x: x,
                y: y,
                frames: CONST_CASH.EFFECT.FRAME.EXPLOSION
            });

        //TODO: Effectクラスに移動
        SOUND.EFFECT.EXPLOSION.play();

        delete UNITS[mode][sprite.myNo];
        GROUP[mode].UNIT.removeChild(sprite);
        GROUP[mode].UNIT.removeChild(hplabel);

        //after action
        if (typeof sprite.after_death === 'function') {
            setTimeout(function() {
                sprite.after_death(sprite);
            }, sprite.reverse * 1000);
        }

        if (sprite.thumb !== undefined) {
            sprite.thumb.reverse(sprite);
        }

        sprite.removeEventListener(enchant.Event.ENTER_FRAME, move);
        sprite.removeEventListener(enchant.Event.ENTER_FRAME, walk);

        setTimeout(function() {
            size =
            map_chip_size =
            unit_size_diff_x =
            unit_size_diff_y =
            moveVal =
            image =
            mode =
            hplabel =
            have =
            line_num =
            walk_count =
            ai =
            chip_direction =
            mapPoint =
            checkMoveSquere =
            getCollision =
            walk =
            move = null;
        }, 10);
        return true;
    };

    /**
     * check unit death
     * @return {Boolean} death flg.
     */
    sprite.checkDeath = function() {
        if (sprite.hp <= 0) {
            return true;
        }
        return false;
    };

    default_frame = sprite.frame;

    /**
     * change sprite view
     * @param {Object} unit Unit Object.
     * @return {Boolean} true.
     */
    sprite.changeUnit = function(unit) {
        default_frame = unit.frame;
        return true;
    };

    /**
     * get sprite map-point
     * @return {Object} Map point Object.
     */
    mapPoint = function() {
        return MAP.PATH.getSquere(sprite);
    };
    //set before map squere point
    sprite.beforePoint = mapPoint();

    /**
     * check unit moved squere
     * @return {Boolean} move flg.
     */
    checkMoveSquere = function() {
        var ret = false;

        if (moveVal >= map_chip_size) {
            var now,
                before = sprite.beforePoint;

            moveVal = moveVal - map_chip_size;
            if (moveVal > 0) {
                switch (sprite.direction) {
                    case 0:
                        sprite.y += moveVal;
                        break;
                    case 1:
                        sprite.x -= moveVal;
                        break;
                    case 2:
                        sprite.y -= moveVal;
                        break;
                    case 3:
                        sprite.x += moveVal;
                        break;
                    default:
                        break;
                }
                sprite.y = Math.round(sprite.y);
                sprite.x = Math.round(sprite.x);
            }
            moveVal = 0;

            now = mapPoint();

            if (now.x !== before.x || now.y !== before.y) {
                before = now;
                ret = true;
            }
        }
        return ret;
    };
    /**
     * get map collision
     * @return {Object} Collision Object.
     */
    getCollision = function() {
        return MAP.PATH.getCollision(sprite);
    };

    /**
     * effect unit walk
     */
    walk = function() {
        // animation
        if (GAME.frame % 5 === 0) {
            walk_count++;

            switch (walk_count) {
                case 4:
                    walk_count = 0;
                    walk_true = -1;
                    break;
                case 3:
                    walk_true = 0;
                    break;
                default:
                    break;
            }
            walk_true++;
        }
        sprite.frame = default_frame + walk_true * line_num + sprite.direction;
    };

    /**
     * unit move action
     */
    move = function() {
        var d = sprite.direction,
            s = sprite.speed,
            sprite_type = CONST_CASH.TYPE,
            i, len = ai.length,
            aii, colision;

        move = function() {
            if (GAME.frame % 3 === 0) {
                moveVal += s;
                // unit move
                for (i = 0; i < len; i++) {
                    aii = ai[i];
                    if (d === aii.direction) {
                        sprite[aii.prop] += (s * aii.sign);
                        hplabel[aii.prop] += (s * aii.sign);
                        if (checkMoveSquere() === true) {
                            colision = getCollision();
                            if (colision !== false) {
                                if (colision.type !== sprite_type.CASTLE) {
                                    if (colision[aii.order[0]] === 1) {
                                        sprite.direction = aii.order[0];
                                    }
                                    else if (colision[aii.order[1]] === 1) {
                                        sprite.direction = aii.order[1];
                                    }
                                    else if (colision[aii.order[2]] === 1) {
                                        sprite.direction = aii.order[2];
                                    }
                                    else {
                                        sprite.direction = aii.order[3];
                                    }
                                }
                                else {
                                    Battle.siege(sprite, colision);
                                }
                            }
                        }

                        break;
                    }
                }
            }
        };
        move();
    };

    //unit action
    sprite.addEventListener(enchant.Event.ENTER_FRAME, move);
    sprite.addEventListener(enchant.Event.ENTER_FRAME, walk);

    /**
     * unit stop and walk effect
     * @return {Boolean} true.
     */
    sprite.stay = function() {
        GROUP[mode].UNIT.removeChild(hplabel);
        sprite.removeEventListener(enchant.Event.ENTER_FRAME, move);
        return true;
    };

    //add array
    sprite.myNo = UNITS.no;
    UNITS[mode][UNITS.no] = sprite;
    UNITS.no++;

    if (mode === have.USER) {
        moveVal = -moveVal;
        hplabel.color = '#AAF';
    }

    Log.unit(sprite);

    //add Layer
    return addLayer({
        layer: GROUP[mode].UNIT,
        sprite: sprite
    });
};
var Score = function(config) {
    var total = 0,
        //enemy point rate
        rate = 0.5,
        have = CONST_CASH.HAVE,
        mode = config.mode,
        x = config.x,
        y = config.y,
        label = new Label(),
        ret = {},
        add = function(score) {
            ret.total += score;
            return ret.total;
        };

    //set label font
    label.font = '12px ' + CONST_CASH.FONT;
    label.color = '#ccc';

    //set label position
    label.x = x;
    label.y = y;

    //enemy score
    ret = {
        label: label,
        total: total,
        rate: rate,
        mode: mode,
        point: CONST().POINT,
        add: add,
        update: function() {}
    };
    //override user
    if (mode === have.USER) {
        ret.update = function() {
            label.text = 'SCORE : ' + ret.total;
        };
        ret.get = function() {
            return ret.total;
        };
        ret.add = function(score) {
            add(score);
            ret.update();
            return ret.total;
        };
        ret.rate = 1;
    }

    ret.update();

    return ret;
};
/**
 * Create Countdown label
 * @param {Object} config Config object.
 * @return {Object} Countdown Object.
 */
var Countdown = function(config) {
    var label = new Label(),
        timelimit = CONST_CASH.TIMELIMIT,
        sec = 0,
        limitID,
        after = function() {},
        count = function() {
            sec++;
            if (sec >= timelimit) {
                after();
                label.stop();
            }
        };

    //set label font
    label.font = '12px ' + CONST_CASH.FONT;
    label.color = '#ccc';

    //set label position
    label.x = config.x;
    label.y = config.y;

    /**
     * view update
     * @return {String} timelimit text.
     */
    label.update = function() {
        label.text = 'TIME-LIMIT : ' + (timelimit - sec);
        return label.text;
    };

    /**
     * countdown start
     * @return {Boolean} true.
     */
    label.init = function() {
        label.stop();
        limitID = setInterval(function() {
            count();
            label.update();
        }, 1000);
        return true;
    };

    /**
     * set after
     * @param {Function} func after function.
     * @return {Function} set function.
     */
    label.setAfter = function(func) {
        after = func;
        return after;
    };

    /**
     * get diff time
     * @return {Number} time diff.
     */
    label.getDiff = function() {
        return timelimit - sec;
    };

    /**
     * stop countdown process
     * @return {Boolean} true.
     */
    label.stop = function() {
        clearInterval(limitID);
        return true;
    };

    return label;
};
/**
 * Create Effect Object
 * @param {Object} config Config object.
 * @return {Object} Effect object.
 */
var Effect = function(config) {
    var size = CONST_CASH.UNIT.CHIP_SIZE,
        frames = config.frames,
        frame_start = frames.start,
        frame_end = frames.end,
        rate = frames.rate,
        loop = frames.loop,
        type = config.type.toUpperCase(),
        layer = GROUP.EFFECT[type],
        sprite = new Sprite(size, size),
        effect;

    if (loop === true) {
        effect = function(e) {
            if (GAME.frame % rate === 0) {
                if (sprite.frame < frame_end) {
                    sprite.frame++;
                }
                else {
                    sprite.frame = frame_start;
                }
            }
        };
    }
    else {
        effect = function(e) {
            if (GAME.frame % rate === 0) {
                if (sprite.frame >= frame_end) {
                    sprite.end();
                }
                else {
                    sprite.frame++;
                }
            }
        };
    }

    sprite.image = GAME.assets[CONST_CASH.EFFECT.IMAGE];
    sprite.x = config.x;
    sprite.y = config.y;
    sprite.frame = frame_start;
    sprite.effect = effect;
    sprite.endFlg = false;

    //effect action
    sprite.addEventListener(enchant.Event.ENTER_FRAME, effect);

    //effect end
    sprite.end = function() {
        sprite.removeEventListener(enchant.Event.ENTER_FRAME, effect);
        layer.removeChild(sprite);
        sprite.endFlg = true;

        setTimeout(function() {
            size =
            frames =
            frame_start =
            frame_end =
            rate =
            loop =
            type =
            layer =
            sprite =
            effect = null;
        }, 10);
        return true;
    };

    //add Layer
    return addLayer({
        layer: layer,
        sprite: sprite
    });
};
//Enemy AI
var EnemyAction = {
    aiid: null,
    /* race: 'UNDEAD', */
    /* race: 'HUMAN', */
    race: '',
    order: [],
    /**
     * start enemy action
     */
    init: function() {
        var ea = EnemyAction,
            mode = CONST_CASH.HAVE.ENEMY,
            castle,
            unit,
            r,
            castles = CASTLE.ENEMY,
            castles_len = castles.length,
            unit_status = CONST_CASH.UNIT.STATUS,
            order, order_len, unit_name;

        switch (USER_RACE) {
            case 'HUMAN':
                ea.race = 'UNDEAD';
                ea.order = [
                    'BONE_DOG',
                    'BONE_WARRIER',
                    'BONE_ARCHER',
                    'SHADE',
                    'BONE_SNAKE',
                    'GOLEM',
                    'SPECTOR',
                    'ARACHNE'
                ];
                break;

            /* case 'UNDEAD': */
            default:
                ea.race = 'HUMAN';
                ea.order = [
                    'LANCER',
                    'WARRIOR',
                    'KNIGHT',
                    'ARCHER',
                    'CLELIC',
                    'FIRE_MAGE',
                    'FROST_MAGE',
                    'WIZARD'
                ];
                /* break; */

                break;
        }
        unit_status = unit_status[ea.race];
        order = ea.order;

        ea.aiid = setInterval(function() {
            order_len = order.length;
            if (order_len > 0) {
                r = Math.floor(Math.random() * castles_len);
                if (r >= castles_len) {
                    r = castles_len - 1;
                }
                castle = castles[r];

                r = Math.floor(Math.random() * order_len);
                if (r >= order_len) {
                    r = order_len - 1;
                }
                unit_name = order[r];
                unit = unit_status[unit_name];
                order.splice(r, 1);

                r = {
                    mode: mode,
                    direction: 2,
                    x: castle.unitX,
                    y: castle.unitY,
                    after_death: function(unit) {
                        order.push(unit.name);
                    }
                };

                r = propOverride(r, unit);

                unit = new Unit(r);
            }
        }, 6000);
    },
    /**
     * stop enemy action
     */
    end: function() {
        clearInterval(EnemyAction.aiid);
        EnemyAction.aiid = null;
    }
};
var Battle = {
    /**
     * Battle init
     * @return {Function} Surveillant function.
     */
    init: function() {
        var func = function() {
            var units_user = UNITS.USER,
                units_enemy = UNITS.ENEMY,
                unit_user, unit_enemy,
                i, j;

            func = function() {
                for (i in units_enemy) {
                    if (units_enemy.hasOwnProperty(i) === true) {
                        unit_enemy = units_enemy[i];
                        for (j in units_user) {
                            if (units_user.hasOwnProperty(j) === true) {
                                unit_user = units_user[j];
                                if (
                                    unit_enemy.intersect(unit_user) === true &&
                                    (
                                        unit_user.x === unit_enemy.x ||
                                        unit_user.y === unit_enemy.y
                                    )
                                ) {
                                    Battle.unitAndUnit(unit_enemy, unit_user);
                                }
                            }
                        }
                    }
                }
            };
            return func();
        };
        Surveillant.add(func, 'battle');
        return func;
    },
    /**
     * @param {Object} obj Sprite object.
     * @return {Number} score.
     */
    score: function(obj) {
        var have = CONST_CASH.HAVE,
            type = CONST_CASH.TYPE,
            score = LABEL.SCORE,
            point = CONST_CASH.POINT,
            obj_mode,
            obj_type,
            ret;

        Battle.score = function(obj) {
            obj_mode = obj.mode;
            obj_type = obj.type;
            ret = null;

            if (
                (
                    obj_type !== type.CASTLE &&
                    obj_mode === have.USER
                ) || (
                    obj_type === type.CASTLE &&
                    obj_mode === have.ENEMY
                )
            ) {
                ret = point[obj_type];
            }
            else if (obj_type === type.CASTLE && obj_mode === have.USER) {
                ret = -point[obj_type];
            }

            score.add(ret);
            return ret;
        };

        return Battle.score(obj);
    },
    /**
     * battole unit and unit
     * @param {Object} unit1 unit object.
     * @param {Object} unit2 unit object.
     */
    unitAndUnit: function(unit1, unit2) {
        var unit1_hp = unit1.hp,
            unit2_hp = unit2.hp,
            damage1 = unit1_hp,
            damage2 = unit2_hp;

        while (unit1_hp > 0 && unit2_hp > 0) {
            unit1_hp = unit1.attack(unit2, damage1);
            unit2_hp = unit2.attack(unit1, damage2);
        }

        //check death
        if (unit1.checkDeath() === true) {
            Log.death(unit1);
            Battle.score(unit1);
        }
        if (unit2.checkDeath() === true) {
            Log.death(unit2);
            Battle.score(unit2);
        }

        MAP.PATH.vibrate(1);
    },
    /**
     * battle unit and castle
     * @param {Object} unit Unit object.
     * @param {Object} castle Castle object.
     */
    siege: function(unit, castle) {
        Log.siege(castle);
        castle.damage(unit);
        unit.kill();

        MAP.PATH.vibrate(3);

        if (castle.checkBreak() === true) {
            Log.castle(castle);
            Battle.score(castle);
        }
    }
};
var Surveillant = {
    functions: {},
    //process surveillant
    exefunc: function() {
        var i,
            ret = [],
            funcs = Surveillant.functions;

        for (i in funcs) {
            if (funcs.hasOwnProperty(i) === true) {
                ret.push(funcs[i]());
            }
        }

        return ret;
    },
    /**
     * add surveillant process
     * @param {Function} func  set function.
     * @param {String} key key name.
     */
    add: function(func, key) {
        Surveillant.functions[key] = func;
    },
    /**
     * remove surveillant process
     * @param {String} key key name.
     */
    remove: function(key) {
        delete Surveillant.functions[key];
    },
    /**
     * start surveillant process
     */
    init: function() {
        GAME.addEventListener(
            enchant.Event.ENTER_FRAME,
            Surveillant.exefunc,
            false
        );
    },
    /**
     * stop surveillant process
     */
    stop: function() {
        GAME.removeEventListener(
            enchant.Event.ENTER_FRAME,
            Surveillant.exefunc,
            false
        );
    },
    end: function() {
        Surveillant.functions = {};
        Surveillant.stop();
    }
};
/**
 * Create StatusViewer Object
 * @param {Object} config Config Object.
 * @return {Object} StatisViwer Object.
 */
var StatusViwer = function(config) {
    var label = new Label(),
        group = new Group(),
        unit,
        cons = CONST_CASH.STATUS_VIEWER,
        pos = cons.POSITION,
        bg_image = GAME.assets[cons.IMAGE],
        bg_size = cons.BG_SIZE,
        bg = new Sprite(bg_size[0], bg_size[1]),
        statuslist = CONST_CASH.UNIT.STATUS,
        user_have = CONST_CASH.HAVE.USER,
        viewcash = {};

    group.x = pos[0];
    group.y = pos[1];

    bg.image = bg_image;
    bg.frame = 0;
    bg.opacity = 0;

    //set label font
    label.font = '9px/1.5 ' + CONST_CASH.FONT;
    label.color = '#fff';
    label.text = '';

    //set label position
    label.x = 45;
    label.y = 8;

    //unit view
    unit = new Unit({
        mode: user_have,
        x: 15,
        y: 15,
        opacity: 0
    });
    unit.frame = 0;
    unit.direction = 2;
    unit.stay();

    group.update = function(obj) {
        unit.opacity = 1;

        group.update = function(obj) {
            label.text = viewcash[obj.name];
            unit.changeUnit(obj);

            return true;
        };

        return group.update(obj);
    };

    group.init = function() {
        var i, sta, statsies = statuslist[USER_RACE], br = '<br />', ws = ' ';
        for (i in statsies) {
            if (statsies.hasOwnProperty(i) === true) {
                sta = statsies[i];
                viewcash[i] = '<b>' + sta.name + '</b>' + br +
                '†: ' + sta.hp + br +
                '⇒: ' + sta.speed + '/frame' + br +
                '×: ' + sta.reverse + 'sec';
            }
        }
        bg.opacity = 1;
        return viewcash;
    };

    group.addChild(bg);
    group.addChild(label);
    group.addChild(unit);

    return group;
};
//loged user action
var Log = {
    logid: 0,
    data: {
        time: 0,
        victory: 0,
        unit: {
            USER: 0,
            ENEMY: 0
        },
        death: {
            USER: 0,
            ENEMY: 0
        },
        siege: {
            USER: 0,
            ENEMY: 0
        },
        castle: {
            USER: 0,
            ENEMY: 0
        }
    },
    unit: function(unit) {
        Log.data.unit[unit.mode]++;
    },
    death: function(unit) {
        Log.data.death[unit.mode]++;
    },
    siege: function(castle) {
        Log.data.siege[castle.mode]++;
    },
    castle: function(castle) {
        Log.data.castle[castle.mode]++;
    },
    send: function() {
        Log.data.time = LABEL.COUNTDOWN.getDiff();

        //TODO: DBにデータ保存
        // httpRequest = false;
        // if (window.XMLHttpRequest) {
        //     // Firefox, Opera など
        //     httpRequest = new XMLHttpRequest();
        //     httpRequest.overrideMimeType('text/xml');
        // }
        // else if (window.ActiveXObject) {
        //     // IE
        //     try {
        //         httpRequest = new ActiveXObject('Msxml2.XMLHTTP');
        //     } catch (e) {
        //         httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
        //     }
        // }
        // httpRequest.open('POST', '/amidawars/log.php', true);
        // httpRequest.onreadystatechange = function(e) {
        //     console.log(e);
        // };
        // httpRequest
        // .setRequestHeader(
        //         'Content-Type',
        //         'application/x-www-form-urlencoded'
        // );
        // httpRequest.send('log=' + JSON.stringify(Log.data));
        return true;
    },
    reset: function() {
        Log.data = {
            time: 0,
            victory: 0,
            unit: {
                USER: 0,
                ENEMY: 0
            },
            death: {
                USER: 0,
                ENEMY: 0
            },
            siege: {
                USER: 0,
                ENEMY: 0
            },
            castle: {
                USER: 0,
                ENEMY: 0
            }
        };
    },
    init: function() {
        Log.reset();
        /* Log.end(); */
        /* Log.logid = setInterval(Log.send, 30000); */
        return true;
    },
    end: function() {
        Log.send();
        clearInterval(Log.logid);
        return true;
    }
};
var Result = function(end) {
    var resultView = new Scene(),
        title = new Label(),
        result = new Label(),
        have = CONST_CASH.HAVE,
        score = LABEL.SCORE.get(),
        score_txt = (function() {
            var point = CONST_CASH.POINT,
                txt, calc, br = '<br>';

            txt = 'SCORE: ' + score + br;

            switch (end) {
                case have.ENEMY:
                    end = 'WIN';
                    Log.data.victory = 1;
                    calc = LABEL.COUNTDOWN.getDiff() * point.TIME;
                    txt += '&nbsp;WIN: ' + point.WIN + br +
                            '&nbsp;CLEAR TIME BONUS: ' + calc;

                    score += point.WIN + calc;
                    break;
                case have.USER:
                    end = 'LOSE';
                    Log.data.victory = -1;
                    txt += '&nbsp;LOSE: ' + point.LOSE;

                    score += point.LOSE;
                    break;
                default:
                    end = 'DRAW';
                    txt += '&nbsp;DRAW: 0';
                    break;
            }

            txt += br + br + '<b>TOTAL: ' + score + '</b>';

            return txt;
        }()),
        font = CONST_CASH.FONT,
        font_color = '#fff';



    title.font = '20px/1.5 ' + font;
    title.color = font_color;
    title.text = 'RESULT';
    title.x = 100;
    title.y = 100;

    result.font = '12px/1.5 ' + font;
    result.color = font_color;
    result.text = score_txt;
    result.x = 100;
    result.y = 150;

    resultView.addChild(title);
    resultView.addChild(result);
    resultView.backgroundColor = 'rgba(0,0,0,0.3)';
    resultView.result = end;

    GAME.pushScene(resultView);
    GAME.end(score, end + ':' + score);

    return resultView;
};
    PUBLIC = {
        GAME: GAME,
        Amida: Amida,
        Battle: Battle,
        Castle: Castle,
        CONST: CONST_CASH,
        Countdown: Countdown,
        Effect: Effect,
        EnemyAction: EnemyAction,
        init: init,
        Log: Log,
        RaceSelect: RaceSelect,
        RandamMap: RandamMap,
        Result: Result,
        Score: Score,
        StatusViwer: StatusViwer,
        Surveillant: Surveillant,
        Thumb: Thumb,
        Unit: Unit
    };
    return PUBLIC;
}(window));
//AMIDA Wars init
AW.init({
    // easy map creater
    /*
    │─├┤┌┐└┘:road
    ■:castle(enemy) !only first line
    □:castle(user) !only last line
    ×:no way
    */
    map: [
'■×■×■×■×',
'├─┤×│×│×',
'│×│×├─┤×',
'│×└┐│×│×',
'└┐×├┤×└┐',
'×│×│└┐×│',
'×├─┤×│×│',
'×│×│×├─┤',
'×□×□×□×□'
]
});
