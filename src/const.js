var CONST = function(){
	return {
		TIMELIMIT: function() {
			return 3 * 60;
		}, 
		FONT: function() {
			return 'tahoma,verdana,arial,sans-serif';
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
					UNDEAD: { SKELTON_DOG: 32, SKELTON_WARRIER: 36, SKELTON_ARCHER: 40, SPECTOR: 44, SKELTON_SNAKE: 48, GOLEM: 52, SHADE: 56, UNDEAD_SPIDER: 60 }
				},
				STATUS: {
					HUMAN: {
						WARRIOR:         { name:'WARRIOR',         frame:  0, hp:2, armor:TYPE.MIDIUM, speed:1, damage:3, reverse:4 },
						LANCER:          { name:'LANCER',          frame:  4, hp:3, armor:TYPE.MIDIUM, speed:1, damage:2, reverse:2 },
						KNIGHT:          { name:'KNIGHT',          frame:  8, hp:4, armor:TYPE.HEAVY, speed:0.9, damage:2, reverse:7 },
						ARCHER:          { name:'ARCHER',          frame: 12, hp:1, armor:TYPE.LIGHT, speed:1.1, damage:3, reverse:3 },
						CLELIC:          { name:'CLELIC',          frame: 48, hp:1, armor:TYPE.NOARMOR, speed:0.5, damage:1, reverse:2 },
						FIRE_MAGE:       { name:'FIRE_MAGE',       frame: 52, hp:1, armor:TYPE.NOARMOR, speed:0.8, damage:2, reverse:3 },
						FROST_MAGE:      { name:'FROST_MAGE',      frame: 56, hp:1, armor:TYPE.NOARMOR, speed:0.8, damage:2, reverse:3 },
						WIZARD:          { name:'WIZARD',          frame: 60, hp:1, armor:TYPE.NOARMOR, speed:0.8, damage:3, reverse:4 }
					},
					UNDEAD: {
						SKELTON_DOG:     { name:'SKELTON_DOG',     frame: 96, hp:1, armor:TYPE.LIGHT, speed:1.4, damage:2, reverse:1 },
						SKELTON_WARRIER: { name:'SKELTON_WARRIER', frame:100, hp:2, armor:TYPE.MIDIUM, speed:1, damage:2, reverse:1 },
						SKELTON_ARCHER:  { name:'SKELTON_ARCHER',  frame:104, hp:1, armor:TYPE.MIDIUM, speed:1, damage:3, reverse:1 },
						SHADE:           { name:'SHADE',           frame:108, hp:1, armor:TYPE.NOARMOR, speed:0.7, damage:1, reverse:3 },
						SKELTON_SNAKE:   { name:'SKELTON_SNAKE',   frame:144, hp:2, armor:TYPE.LIGHT, speed:1.3, damage:1, reverse:1 },
						GOLEM:           { name:'GOLEM',           frame:148, hp:5, armor:TYPE.HEAVY, speed:0.5, damage:2, reverse:6 },
						SPECTOR:         { name:'SPECTOR',         frame:152, hp:1, armor:TYPE.NOARMOR, speed:0.7, damage:1, reverse:3 },
						UNDEAD_SPIDER:   { name:'UNDEAD_SPIDER',   frame:156, hp:3, armor:TYPE.MIDIUM, speed:1, damage:2, reverse:4 }
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
					UNDEAD: { SKELTON_DOG: 8, SKELTON_SNAKE: 9, SKELTON_WARRIER: 10, SKELTON_ARCHER: 11, GOLEM: 12, UNDEAD_SPIDER: 13, SHADE: 14, SPECTOR: 15 }
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
