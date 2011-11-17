/**
 * Constant Valiables
 * @name CONST
 * @function
 * @returns {Object}
 */
var CONST = function(){
	return {
		TIMELIMIT: 3*60, 
		UNIT: function(){
			return {
				IMAGE: 'char.gif',
				CHIP_SIZE: 16,
				FRAME_SIZE: { W: 4, H: 3 },
				FRAME_LINE: 16,
				FRAME_BLOCK: 48,
				FRAME: {
					HUMAN: { LANCER: 0, WARRIOR: 4, KNIGHT: 8, ARCHER: 12, CLELIC: 16, FIRE_MAGE: 20, FROST_MAGE: 24, WIZARD: 28 },
					UNDEAD: { SKELTON_DOG: 32, SKELTON_WARRIER: 36, SKELTON_ARCHER: 40, SPECTOR: 44, SKELTON_SNAKE: 48, GOLEM: 52, SHADE: 56, UNDEAD_SPIDER: 60 }
				},
				STATUS: {
					HUMAN: {
						WARRIOR:         { name:'WARRIOR',         frame:  0, hp:1, armor:TYPE.MIDIUM, speed:1, damage:1, reverse:1000 },
						LANCER:          { name:'LANCER',          frame:  4, hp:1, armor:TYPE.MIDIUM, speed:1, damage:1, reverse:1000 },
						KNIGHT:          { name:'KNIGHT',          frame:  8, hp:1, armor:TYPE.MIDIUM, speed:1, damage:1, reverse:1000 },
						ARCHER:          { name:'ARCHER',          frame: 12, hp:1, armor:TYPE.MIDIUM, speed:1, damage:1, reverse:1000 },
						CLELIC:          { name:'CLELIC',          frame: 48, hp:1, armor:TYPE.MIDIUM, speed:1, damage:1, reverse:1000 },
						FIRE_MAGE:       { name:'FIRE_MAGE',       frame: 52, hp:1, armor:TYPE.MIDIUM, speed:1, damage:1, reverse:1000 },
						FROST_MAGE:      { name:'FROST_MAGE',      frame: 56, hp:1, armor:TYPE.MIDIUM, speed:1, damage:1, reverse:1000 },
						WIZARD:          { name:'WIZARD',          frame: 60, hp:1, armor:TYPE.MIDIUM, speed:1, damage:1, reverse:1000 }
					},
					UNDEAD: {
						SKELTON_DOG:     { name:'SKELTON_DOG',     frame: 96, hp:1, armor:TYPE.MIDIUM, speed:1, damage:1, reverse:1000 },
						SKELTON_WARRIER: { name:'SKELTON_WARRIER', frame:100, hp:1, armor:TYPE.MIDIUM, speed:1, damage:1, reverse:1000 },
						SKELTON_ARCHER:  { name:'SKELTON_ARCHER',  frame:104, hp:1, armor:TYPE.MIDIUM, speed:1, damage:1, reverse:1000 },
						SHADE:           { name:'SHADE',           frame:108, hp:1, armor:TYPE.MIDIUM, speed:1, damage:1, reverse:1000 },
						SKELTON_SNAKE:   { name:'SKELTON_SNAKE',   frame:144, hp:1, armor:TYPE.MIDIUM, speed:1, damage:1, reverse:1000 },
						GOLEM:           { name:'GOLEM',           frame:148, hp:1, armor:TYPE.MIDIUM, speed:1, damage:1, reverse:1000 },
						SPECTOR:         { name:'SPECTOR',         frame:152, hp:1, armor:TYPE.MIDIUM, speed:1, damage:1, reverse:1000 },
						UNDEAD_SPIDER:   { name:'UNDEAD_SPIDER',   frame:156, hp:1, armor:TYPE.MIDIUM, speed:1, damage:1, reverse:1000 }
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
				IMAGE: 'thumb.gif',
				CHIP_SIZE: 32,
				FRAME: {
					HUMAN: { LANCER: 0, WARRIOR: 1, KNIGHT: 2, ARCHER: 3, CLELIC: 4, FIRE_MAGE: 5, FROST_MAGE: 6, WIZARD: 7 },
					UNDEAD: { SKELTON_DOG: 8, SKELTON_WARRIER: 9, SKELTON_ARCHER: 10, SPECTOR: 11, SKELTON_SNAKE: 12, GOLEM: 13, SHADE: 14, UNDEAD_SPIDER: 15 }
				},
				USER: { POSITION: [ [0, 352], [50, 352], [100, 352], [150, 352], [0, 392], [50, 392], [100, 392], [150, 392] ] },
				ENEMY: { }, PROP: { }
			};
		},
		SCORE: function(){
			return {
				POSITION: [5, 430]
			};
		},
		COUNTDOWN: function() {
			return {
				POSITION: [150, 430]
			};
		}, 
		STATUS_VIEWER: function() {
			return {
				POSITION: [200, 352]
			};
		}, 
		MAP: function(){
			return {
				IMAGE: 'map.gif',
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
				FRAME:  {
					EXPLOSION: [0, 5]
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
		LAYER: function(){
			return {
				USER: { UNIT: GROUP.USER.UNIT, CASTLE: GROUP.USER.CASTLE, THUMB: GROUP.USER.THUMB },
				ENEMY: { UNIT: GROUP.ENEMY.UNIT, CASTLE: GROUP.ENEMY.CASTLE, THUMB: GROUP.ENEMY.THUMB },
				MAP_OPTION:  { CASTLE_BASE: GROUP.MAP_OPTION.CASTLE_BASE }, 
				EFFECT:  { UNIT: GROUP.EFFECT.UNIT }
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
				UNIT: 100, CASTLE: 1000, WIN: 5000, LOSE: -5000, TIME: 10
			};
		}
	};
},
CONST_CASH = CONST();
CONST_CASH = {
	TIMELIMIT: CONST_CASH.TIMELIMIT, 
	UNIT: CONST_CASH.UNIT(),
	THUMB: CONST_CASH.THUMB(),
	SCORE: CONST_CASH.SCORE(),
	COUNTDOWN: CONST_CASH.COUNTDOWN(),
	STATUS_VIEWER: CONST_CASH.STATUS_VIEWER(),
	MAP: CONST_CASH.MAP(),
	CASTLE: CONST_CASH.CASTLE(),
	EFFECT: CONST_CASH.EFFECT(),
	SOUND: CONST_CASH.SOUND(), 
	LAYER: CONST_CASH.LAYER(),
	TYPE: CONST_CASH.TYPE(),
	HAVE: CONST_CASH.HAVE(),
	POINT: CONST_CASH.POINT() 
};
