/**
* CONSTANT Valiables
* @name CONST
* @function
*/
var CONST = function(){
    return {
        TIMELIMIT: function() {
            return 3 * 60;
        }, 
        FONT: function() {
            return 'monospace';
        }, 
        UNIT: function(){
            return {
                IMAGE: 'char.gif',
                CHIP_SIZE: 16,
                FRAME_SIZE: { W: 4, H: 3 },
                FRAME_LINE: 16,
                FRAME_BLOCK: 48,
                FRAME: {
                    HUMAN: { LANCER: 0, WARRIOR: 4, KNIGHT: 8, ARCHER: 12, CLELIC: 16, FIRE_MAGE: 20, FROST_MAGE: 24, WIZARD: 28 },
                    UNDEAD: { BONE_DOG: 32, BONE_WARRIER: 36, BONE_ARCHER: 40, SPECTOR: 44, BONE_SNAKE: 48, GOLEM: 52, SHADE: 56, ARACHNE: 60 }
                },
                STATUS: {
                    HUMAN: {
                        WARRIOR: {
                            name:'WARRIOR', frame: 0, hp: 3, armor: TYPE.MIDIUM, speed: 2, damage: 3, siege: 1, reverse: 5,
                            attacked: function(){},
                            dead: function(){}
                        },
                        LANCER: {
                            name: 'LANCER', frame: 4, hp: 4, armor: TYPE.MIDIUM, speed: 2, damage: 2, siege: 1, reverse: 3, 
                            attacked: function(){},
                            dead: function(){}
                        },
                        KNIGHT: {
                            name: 'KNIGHT', frame: 8, hp: 5, armor: TYPE.HEAVY, speed: 1.8, damage: 2, siege: 1, reverse: 8, 
                            attacked: function(){},
                            dead: function(){}
                        },
                        ARCHER: {
                            name: 'ARCHER', frame: 12, hp: 2, armor: TYPE.LIGHT, speed: 2.2, damage: 3, siege: 1, reverse: 4, 
                            attacked: function(){},
                            dead: function(){}
                        },
                        CLELIC: {
                            name: 'CLELIC', frame: 48, hp: 2, armor: TYPE.NOARMOR, speed: 1,   damage: 1, siege: 1, reverse: 3,
                            attacked: function(){},
                            dead: function(){}
                        },
                        FIRE_MAGE: {
                            name: 'FIRE_MAGE', frame: 52, hp: 2, armor: TYPE.NOARMOR, speed: 1.6, damage: 2, siege: 1, reverse: 4, 
                            attacked: function(){},
                            dead: function(obj){
                                // var mine = obj.mine, 
                                //     ef = new Effect({
                                //         type: mine.type.toUpperCase(), 
                                //         x: mine.x, 
                                //         y: mine.y, 
                                //         frames: CONST_CASH.EFFECT.FRAME.FIRE
                                //     });
                                //     
                                // addLayer({
                                //     layer: GROUP.EFFECT.UNIT, 
                                //     sprite: ef
                                // });
                            }
                        },
                        FROST_MAGE: {
                            name: 'FROST_MAGE', frame: 56, hp: 2, armor: TYPE.NOARMOR, speed: 1.6, damage: 2, siege: 1, reverse: 4, 
                            attacked: function(){},
                            dead: function(){}
                        },
                        WIZARD: { 
                            name:'WIZARD', frame: 60, hp: 2, armor: TYPE.NOARMOR, speed: 1.6, damage: 3, siege: 1, reverse: 5, 
                            attacked: function(){},
                            dead: function(){}
                        }
                    },
                    UNDEAD: {
                        BONE_DOG: {
                            name:'BONE_DOG', frame: 96, hp: 1, armor: TYPE.LIGHT, speed: 2.8, damage: 2, siege: 1, reverse: 1, 
                            attacked: function(){},
                            dead: function(){}
                        },
                        BONE_WARRIER: {
                            name:'BONE_WARRIER', frame: 100, hp: 2, armor: TYPE.MIDIUM,  speed: 2, damage: 2, siege: 1, reverse: 1, 
                            attacked: function(){},
                            dead: function(){}
                        },
                        BONE_ARCHER: { 
                            name:'BONE_ARCHER', frame: 104, hp: 1, armor: TYPE.MIDIUM,  speed: 2,   damage: 3, siege: 1, reverse: 1, 
                            attacked: function(){},
                            dead: function(){}
                        },
                        SHADE: { 
                            name:'SHADE', frame: 108, hp: 1, armor: TYPE.NOARMOR, speed: 1.8, damage: 0, siege: 9, reverse: 3, 
                            attacked: function(){},
                            dead: function(){}
                        },
                        BONE_SNAKE: {
                            name:'BONE_SNAKE', frame: 144, hp: 2, armor: TYPE.LIGHT,   speed: 2.6, damage: 1, siege: 1, reverse: 1,
                            attacked: function(){},
                            dead: function(){}
                        },
                        GOLEM: {
                            name:'GOLEM', frame: 148, hp: 7, armor: TYPE.HEAVY, speed: 1, damage: 2, siege: 1, reverse: 6, 
                            attacked: function(){},
                            dead: function(){}
                        },
                        SPECTOR: {
                            name:'SPECTOR', frame: 152, hp: 1, armor: TYPE.NOARMOR, speed: 1.8, damage: 9, siege: 0, reverse: 3, 
                            attacked: function(){},
                            dead: function(){}
                        },
                        ARACHNE: { 
                            name:'ARACHNE', frame: 156, hp: 3, armor: TYPE.MIDIUM,  speed: 2, damage: 3, siege: 1, reverse:4, 
                            attacked: function(obj){
                                var mine = obj.mine, 
                                    enemy = obj.enemy;
                                enemy.reverse = 9;
                                enemy.speed /= 2;
                            },
                            dead: function(){}
                        }
                    }
                },
                AI: {
                    USER: [ { direction:0, prop:'y', sign:-1, order:[1,3,0,2] },
                            { direction:3, prop:'x', sign:-1, order:[0,2,3,1] },
                            { direction:1, prop:'x', sign: 1, order:[0,2,1,3] },
                            { direction:2, prop:'y', sign: 1, order:[3,1,2,0] } ],
                    ENEMY: [{ direction:2, prop:'y', sign: 1, order:[3,1,2,0] },
                            { direction:3, prop:'x', sign:-1, order:[2,0,3,1] },
                            { direction:1, prop:'x', sign: 1, order:[2,0,1,3] },
                            { direction:0, prop:'y', sign: 1, order:[3,1,0,2] } ]
                }
            };
        },
        THUMB: function(){
            return {
                IMAGE: 'thumb.png',
                CHIP_SIZE: 48,
                FRAME: {
                    HUMAN: { LANCER: 0, WARRIOR: 1, KNIGHT: 2, ARCHER: 3, CLELIC: 4, FIRE_MAGE: 5, FROST_MAGE: 6, WIZARD: 7 },
                    UNDEAD: { BONE_DOG: 8, BONE_SNAKE: 9, BONE_WARRIER: 10, BONE_ARCHER: 11, GOLEM: 12, ARACHNE: 13, SHADE: 14, SPECTOR: 15 }
                },
                USER: { POSITION: [ [0, 384], [48, 384], [96, 384], [144, 384], [0, 432], [48, 432], [96, 432], [144, 432] ] },
                ENEMY: { }, PROP: { }
            };
        },
        SCORE: function(){
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
                IMAGE: 'window_status.png',
                POSITION: [192, 384], 
                BG_SIZE: [128, 96]
            };
        }, 
        MAP: function(){
            return {
                IMAGE: 'map.png',
                W: 320, H: 480, CHIP_SIZE: 32
            };
        },
        CASTLE: function(){
            return {
                FRAME: [ { NORMAL: 8, BRAKE: 9 }, { NORMAL: 10, BRAKE: 11 }, { NORMAL: 12, BRAKE: 13 }, { NORMAL: 14, BRAKE: 15 } ],
                PROP: { frame: 0, brake: 0, hp: 2, mhp: 2, unitX: 0, unitY: 0 }
            };
        },
        EFFECT: function(){
            return {
                IMAGE: 'effect.gif', 
                FRAME: {
                    EXPLOSION: {
                        start: 0, 
                        end: 5, 
                        rate: 3, 
                        loop: false
                    }, 
                    FIRE: {
                        start: 5, 
                        end: 7, 
                        rate: 50, 
                        loop: true
                    }, 
                    FROST: {
                        start: 5, 
                        end: 7, 
                        rate: 10, 
                        loop: true
                    }
                }
            };
        }, 
        SOUND: function() {
            return  {
                BGM: 'bgm.wav', 
                EFFECT:  {
                    EXPLOSION: 'explosion.wav'
                }
            };
        }, 
        TYPE: function(){
            return {
                CASTLE: 'CASTLE',
                THUMB: 'THUMB',
                UNIT: 'UNIT', 
                EFFECT: 'EFFECT'
            };
        },
        HAVE: function(){
            return {
                USER: 'USER', ENEMY: 'ENEMY'
            };
        },
        POINT: function(){ 
            return {
                UNIT: 10, CASTLE: 1000, WIN: 5000, LOSE: -5000, TIME: 100
            };
        }
    };
},
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
