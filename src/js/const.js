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
