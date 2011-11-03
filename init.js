enchant();
var AW = (function(){
//private valiables
var GAME,
	GROUP = {
		USER: { UNIT: new Group(), CASTLE: new Group(), THUMB: new Group() },
		ENEMY: { UNIT: new Group(), CASTLE: new Group(), THUMB: new Group() }
	},
	USER_RACE = '',
	USER_ORDER = [],
	UNITS = { USER: {}, ENEMY: {}, no: 0 },
	THUMBS = { USER: [], ENEMY: [] },
	CASTLE = { USER: [], ENEMY: [] },
	MAP = { BASE: [], CASTLE: { USER: [], ENEMY: [] }, COLLISION: [] },
	TYPE = {
		LIGHT:'LIGHT',
		MIDIUM:'MIDIUM',
		HEAVY:'HEAVY',
		NOARMOR:'NOARMOR'
	},
	WEAK = {
		LIGHT:'HEAVY',
		MIDIUM:'MIDIUM',
		HEAVY:'NOARMOR',
		NOARMOR:'LIGHT'
	},
	/**
	 * Override object property
	 * @name propOverride
	 * @function
	 * @param {Object} prop overrided object
	 * @param {Object} config add
	 * @returns {Object}
	 */
	propOverride = function(prop,config){
		if(prop === undefined){
			prop = {};
		}
		for(var i in config){
			if(config.hasOwnProperty(i)){
				prop[i] = config[i];
			}
		}
		return prop;
	},
	/**
	 * Add a layer Sprite
	 * @name addLayer
	 * @function
	 * @param {Object} config / layer:target Group / sprite:add Sprite /
	 * @returns sprite 
	 */
	addLayer = function(config){
		config.layer.addChild(config.sprite);
		return config.sprite;
	},
	//return Public
	PUBLIC = {};
/**
 * Constant Valiables
 * @name CONST
 * @function
 * @returns {Object}
 */
var CONST = function(){
	return {
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
						WARRIOR:         { name:'WARRIOR',         frame:  0, hp:1, armor:1, speed:1, damage:1, reverse:1000, type:TYPE.MIDIUM },
						LANCER:          { name:'LANCER',          frame:  4, hp:1, armor:1, speed:1, damage:1, reverse:1000, type:TYPE.MIDIUM },
						KNIGHT:          { name:'KNIGHT',          frame:  8, hp:1, armor:1, speed:1, damage:1, reverse:1000, type:TYPE.MIDIUM },
						ARCHER:          { name:'ARCHER',          frame: 12, hp:1, armor:1, speed:1, damage:1, reverse:1000, type:TYPE.MIDIUM },
						CLELIC:          { name:'CLELIC',          frame: 48, hp:1, armor:1, speed:1, damage:1, reverse:1000, type:TYPE.MIDIUM },
						FIRE_MAGE:       { name:'FIRE_MAGE',       frame: 52, hp:1, armor:1, speed:1, damage:1, reverse:1000, type:TYPE.MIDIUM },
						FROST_MAGE:      { name:'FROST_MAGE',      frame: 56, hp:1, armor:1, speed:1, damage:1, reverse:1000, type:TYPE.MIDIUM },
						WIZARD:          { name:'WIZARD',          frame: 60, hp:1, armor:1, speed:1, damage:1, reverse:1000, type:TYPE.MIDIUM }
					},
					UNDEAD: {
						SKELTON_DOG:     { name:'SKELTON_DOG',     frame: 96, hp:1, armor:1, speed:1, damage:1, reverse:1000, type:TYPE.MIDIUM },
						SKELTON_WARRIER: { name:'SKELTON_WARRIER', frame:100, hp:1, armor:1, speed:1, damage:1, reverse:1000, type:TYPE.MIDIUM },
						SKELTON_ARCHER:  { name:'SKELTON_ARCHER',  frame:104, hp:1, armor:1, speed:1, damage:1, reverse:1000, type:TYPE.MIDIUM },
						SPECTOR:         { name:'SPECTOR',         frame:108, hp:1, armor:1, speed:1, damage:1, reverse:1000, type:TYPE.MIDIUM },
						SKELTON_SNAKE:   { name:'SKELTON_SNAKE',   frame:144, hp:1, armor:1, speed:1, damage:1, reverse:1000, type:TYPE.MIDIUM },
						GOLEM:           { name:'GOLEM',           frame:148, hp:1, armor:1, speed:1, damage:1, reverse:1000, type:TYPE.MIDIUM },
						SHADE:           { name:'SHADE',           frame:152, hp:1, armor:1, speed:1, damage:1, reverse:1000, type:TYPE.MIDIUM },
						UNDEAD_SPIDER:   { name:'UNDEAD_SPIDER',   frame:156, hp:1, armor:1, speed:1, damage:1, reverse:1000, type:TYPE.MIDIUM }
					}
				},
				AI: {
					USER: [ { direction:0, prop:'y', sign:-1, order:[1,3,0,2] },
							{ direction:3, prop:'x', sign:-1, order:[0,2,3,1] },
							{ direction:1, prop:'x', sign: 1, order:[0,2,1,3] },
							{ direction:2, prop:'y', sign: 1, order:[3,1,2,0] } ],
					ENEMY: [{ direction:2, prop:'y', sign: 1, order:[3,1,0,2] },
							{ direction:3, prop:'x', sign:-1, order:[2,0,3,1] },
							{ direction:1, prop:'x', sign: 1, order:[2,0,1,3] },
							{ direction:2, prop:'y', sign: 1, order:[3,1,0,2] } ]
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
		MAP: function(){
			return {
				IMAGE: 'map.gif',
				W: 320, H: 450, CHIP_SIZE: 32
			};
		},
		CASTLE: function(){
			return {
				FRAME: [ { NORMAL: 8, BRAKE: 9 }, { NORMAL: 10, BRAKE: 11 }, { NORMAL: 12, BRAKE: 13 }, { NORMAL: 14, BRAKE: 15 } ],
				PROP: { frame: 0, brake: 0, hp: 2, mhp: 2, unitX: 0, unitY: 0 }
			};
		},
		LAYER: function(){
			return {
				USER: { UNIT: GROUP.USER.UNIT, CASTLE: GROUP.USER.CASTLE, THUMB: GROUP.USER.THUMB },
				ENEMY: { UNIT: GROUP.ENEMY.UNIT, CASTLE: GROUP.ENEMY.CASTLE, THUMB: GROUP.ENEMY.THUMB }
			};
		},
		HAVE: function(){
			return {
				USER: 'USER', ENEMY: 'ENEMY'
			};
		},
		POINT: function(){ 
			return {
				UNIT: 100, CASTLE: 1000, WIN: 5000, LOSE: -5000
			};
		}
	};
},
CONST_CASH = CONST();
 /**
  * Game Init
  * @name init
  * @function
  */
PUBLIC.init = function(config){
	CONST_CASH = {
		UNIT: CONST_CASH.UNIT(),
		THUMB: CONST_CASH.THUMB(),
		MAP: CONST_CASH.MAP(),
		CASTLE: CONST_CASH.CASTLE(),
		LAYER: CONST_CASH.LAYER(),
		HAVE: CONST_CASH.HAVE(),
		POINT: CONST_CASH.POINT() 
	};
	var img = {
			UNIT: CONST_CASH.UNIT.IMAGE,
			THUMB: CONST_CASH.THUMB.IMAGE,
			MAP: CONST_CASH.MAP.IMAGE
		},
		size = {
			W: CONST_CASH.MAP.W,
			H: CONST_CASH.MAP.H
		},
		castle_point = MAP.CASTLE,
		collision = MAP.COLLISION,
		chipset;

	//set user race
	USER_RACE = config.race;

	//set user order
	USER_ORDER = config.order;

	//set map
	MAP.BASE = chipset = config.map;

	//mapdata init
	(function(){
		var datamap = {
				//don't move
				'0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '24': 0,
				//castle (25:enemy 26:user)
				'25': [0,0,1,0], '26': [1,0,0,0],
				//can move
				'16': [1,0,1,0],
				'17': [0,1,0,1],
				'18': [1,1,1,0],
				'19': [1,0,1,1],
				'20': [0,1,1,0],
				'21': [0,0,1,1],
				'22': [1,1,0,0],
				'23': [1,0,0,1]
			},
			map_start_line = '0111111112',
			map_end_line = '5666666667',
			i,j,ilen,jlen,calc1,calc2,res=[],
			txt2num = function(txt){
				if(txt === '│'){
					txt = 16;
				}
				else if(txt === '─') {
					txt = 17;
				}
				else if(txt === '├') {
					txt = 18;
				}
				else if(txt === '┤') {
					txt = 19;
				}
				else if(txt === '┌') {
					txt = 20;
				}
				else if(txt === '┐') {
					txt = 21;
				}
				else if(txt === '└') {
					txt = 22;
				}
				else if(txt === '┘') {
					txt = 23;
				}
				else if(txt === '×') {
					txt = 24;
				}
				else if(txt === '■') {
					txt = 25;
				}
				else if(txt === '□') {
					txt = 26;
				}
				return txt;
			};
		
		chipset = [].concat(map_start_line,chipset,map_end_line);
		
		for(i = 0, ilen = chipset.length; i < ilen; i++){
			calc1 = res[i] = [];
			calc2 = chipset[i];
			if(calc2 !== map_start_line && calc2 !== map_end_line){
				calc2 = '3'+calc2+'4';
			}
			calc2 = chipset[i] = calc2.split('');
			for(j = 0, jlen = calc2.length; j < jlen; j++){
				calc2[j] = txt2num(calc2[j]);
				calc1[j] = datamap[calc2[j]];
				if(calc2[j] === 25){
					castle_point.ENEMY.push([j,i]);
				}
				else if(calc2[j] === 26){
					castle_point.USER.push([j,i]);
					calc2[j] = 25;
				}
			}
		}
		MAP.BASE = chipset;
		MAP.COLLISION = res;
	}());

	//new Game
	GAME = new Game(size.W,size.H);
	//preload set
	GAME.preload(img.UNIT,img.THUMB,img.MAP);
	//Game onloadSet
	GAME.onload = AW.Amida;
	//Game Start
	GAME.start();
};
/**
  * Constant Valiables
  * @name CONST
  * @function
  * @returns {Object}
  */
PUBLIC.CONST = function(){
	return CONST();
};
/**
 * Create Amida Map
 * @name Amida
 * @function
 */
PUBLIC.Amida = function(){
	var	chip_size = CONST_CASH.MAP.CHIP_SIZE,
		chipset = MAP.BASE,
		map = new Map(chip_size,chip_size),
		group_user = GROUP.USER,
		user_castle = group_user.CASTLE,
		group_enemy = GROUP.ENEMY,
		enemy_castle = group_enemy.CASTLE,
		castle_frames = CONST_CASH.CASTLE.FRAME,
		thumb_num = CONST_CASH.THUMB.SET_NUMBER,
		thumb_position = CONST_CASH.THUMB.USER.POSITION,
		user_mode = CONST_CASH.HAVE.USER,
		castle_point = MAP.CASTLE,
		root = GAME.rootScene,
		unit_chip_size = CONST_CASH.UNIT.CHIP_SIZE,
		i,j,len,ary,label,castle,thumb;

	//map set
	map.image = GAME.assets[CONST_CASH.MAP.IMAGE];
	map.loadData(chipset);

	//depth set
	root.addChild(map);
	root.addChild(group_enemy.CASTLE);
	root.addChild(group_enemy.UNIT);
	root.addChild(group_user.UNIT);
	root.addChild(group_user.CASTLE);
	root.addChild(group_user.THUMB);
	root.addChild(group_enemy.THUMB);
	
	//castle set
	for(i in castle_point){
		if(castle_point.hasOwnProperty(i)){
			ary = castle_point[i];
			for(j = 0,len = ary.length; j < len; j++){
				castle = new AW.Castle({
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

	//user unit-thumbnail set
	for(i = 0, len = USER_ORDER.length; i < len; i++){
		label = USER_ORDER[i].toUpperCase();
		thumb = new AW.Thumb({
			mode: user_mode,
			name: label,
			frame: CONST_CASH.THUMB.FRAME[USER_RACE][label],
			x: thumb_position[i][0],
			y: thumb_position[i][1]
		});
	}
};
/**
 * Create Castle Object
 * @name Castle
 * @function
 * @param {Object} config / mode:'USER' || 'ENEMY' /
 * @returns {Object}
 */
PUBLIC.Castle = function(config){
	var size = CONST_CASH.MAP.CHIP_SIZE,
		image = GAME.assets[CONST_CASH.MAP.IMAGE],
		prop = CONST().CASTLE().PROP,
		mode = config.mode.toUpperCase(),
		sprite = new Sprite(size,size);

	//default override
	prop = propOverride(prop,config);

	//sprite setting
	sprite.image = image;
	sprite = propOverride(sprite,prop);

	//add array
	CASTLE[mode].push(sprite);

	//add Layer
	return addLayer({
		layer: CONST_CASH.LAYER[mode].CASTLE,
		sprite: sprite
	});
};
/**
 * Create Thumbnail Object
 * @name Thumb
 * @function
 * @param {Object} config / mode:'USER' || 'ENEMY' /
 * @returns {Object}
 */
PUBLIC.Thumb = function(config){
	var size = CONST_CASH.THUMB.CHIP_SIZE,
		image = GAME.assets[CONST_CASH.THUMB.IMAGE],
		prop = CONST().THUMB().PROP,
		unitData = CONST_CASH.UNIT.STATUS[USER_RACE][config.name],
		mode = config.mode.toUpperCase(),
		sprite = new Sprite(size,size),
		originX,originY,defaultX,defaultY,
		eEv = enchant.Event,
		hitMyCastle = function(obj){
			var hit = false,
				castles = CASTLE.USER,
				i,len;
			for(i = 0, len = castles.length; i<len; i++){
				if(obj.intersect(castles[i])){
					hit = castles[i];
					break;
				}
			}
			return hit;
		};

	//default override
	prop = propOverride(prop,config);

	//sprite setting
	sprite.image = image;
	sprite = propOverride(sprite,prop);

	//set unit data
	sprite.unit = {
		mode:mode
	};
	sprite.unit = propOverride(sprite.unit,unitData);

	//can drag flg
	sprite.canDrag = true;

	//set default
	defaultX = sprite.x;
	defaultY = sprite.y;

	//set drag action
	sprite.addEventListener(eEv.TOUCH_START, function(e){
		if(this.canDrag === true){
			originX = e.x - this.x;
			originY = e.y - this.y;
		}
	});
	sprite.addEventListener(eEv.TOUCH_MOVE, function(e){
		if(this.canDrag === true){
			this.x = e.x - originX;
			this.y = e.y - originY;
		}
	});
	sprite.addEventListener(eEv.TOUCH_END, function(e){
		if(this.canDrag === true){
			var hit = hitMyCastle(this);
			if(hit){
				//thumb can't drag
				this.canDrag = false;
				this.opacity = 0.5;

				//set unit point
				this.unit.x = hit.unitX;
				this.unit.y = hit.unitY;
				
				//create unit
				this.lastUnit = new AW.Unit(this.unit);
				this.lastUnit.thumb = this;
			}
			this.x = defaultX;
			this.y = defaultY;
		}
	});


	//sprite drag
	sprite.dragStart = function(){
		sprite.canDrag = true;
		sprite.opacity = 1;
	};

	//add array
	THUMBS[mode].push(sprite);

	//add Layer
	return addLayer({
		layer: CONST_CASH.LAYER[mode].THUMB,
		sprite: sprite
	});
};
/**
 * Create Unit Object
 * @name Unit 
 * @function
 * @param {Object} config 
 * @returns {Object}
 */
PUBLIC.Unit = function(config){
	var size = CONST_CASH.UNIT.CHIP_SIZE,
		map_chip_size = CONST_CASH.MAP.CHIP_SIZE,
		unit_size_diff_x = size / 2,
		unit_size_diff_y = size / 8,
		image = GAME.assets[CONST_CASH.UNIT.IMAGE],
		mode = config.mode.toUpperCase(),
		sprite = new Sprite(size,size),
		have = CONST_CASH.HAVE,
		line_num = CONST_CASH.UNIT.FRAME_LINE,
		walk_count = 0, walk_true = 0,
		ai = CONST_CASH.UNIT.AI[mode],
		chip_direction, default_frame,
		mapPoint,checkMoveSquere,getCollision,walk,move,kill;

	//can user override prop
	sprite.direction = 0;
	sprite.image = image;
	sprite = propOverride(sprite,config);

	default_frame = sprite.frame;

	/**
	 * Get the sprite's position on the map
	 * @name mapPoint
	 * @function
	 */
	mapPoint = function(){
		return {
			x: Math.floor(sprite.x/map_chip_size),
			y: Math.floor(sprite.y/map_chip_size)
		};
	};
	//set before map squere point
	sprite.beforePoint = mapPoint();

	/**
	 * unit move check
	 * @name checkMoveSquere
	 * @function
	 * @return 
	 */
	checkMoveSquere = function(){
		var ret = false;

		if(Math.floor(sprite.x - unit_size_diff_x) % map_chip_size === 0 && Math.floor(sprite.y - unit_size_diff_y) % map_chip_size === 0){
			var now = mapPoint(),
				before = sprite.beforePoint;
			if(now.x !== before.x || now.y !== before.y){
				before = now;
				ret = true;
			}
		}
		return ret;
	};
	/**
	 * Gets an array for collision detection
	 * @name getCollision
	 * @function
	 * @return 
	 */
	getCollision = function(){
		var unitPoint = mapPoint(),
			mc = MAP.COLLISION,
			ret = false;

		if((mc = mc[unitPoint.y]) && (mc = mc[unitPoint.x])){
			// TODO: hit enemy castle
			if(mc[0] === 0 && mc[1] === 0 && mc[2] === 1 && mc[3] === 0){
				ret = {CASTLE:have.ENEMY};
			} 
			// TODO: hit user castle
			else if(mc[0] === 1 && mc[1] === 0 && mc[2] === 0 && mc[3] === 0){
				ret = {CASTLE:have.USER};
			}
			else {
				ret = mc;
			}
		}
		return ret;
	};

	/**
	 * walk movie
	 * @name walk
	 * @function
	 */
	walk = function(){
		if(GAME.frame % 5 === 0){
			walk_count++;

			if(walk_count === 4){
				walk_count = 0;
				walk_true = -1;
			}
			else if(walk_count === 3){
				walk_true = 0;
			}
			walk_true++;
		}
		sprite.frame = default_frame + walk_true * line_num + sprite.direction;
	};

	move = function(){
		var d = sprite.direction,
			s = sprite.speed,
			i,len,aii,colision;

		for(i = 0,len = ai.length; i < len; i++) {
			aii = ai[i];
			if(d === aii.direction){
				sprite[aii.prop] += (s * aii.sign);
				if(checkMoveSquere()){
					colision = getCollision();
					var a= 1;
					if(colision !== false){
						if(!colision.CASTLE){
							if(colision[aii.order[0]] === 1){
								sprite.direction = aii.order[0];
								break;
							}
							else if(colision[aii.order[1]] === 1){
								sprite.direction = aii.order[1];
								break;
							}
							else if(colision[aii.order[2]] === 1){
								sprite.direction = aii.order[2];
								break;
							}
							else {
								sprite.direction = aii.order[3];
							}
						}
						else if(colision.CASTLE === have.ENEMY){
							// TODO:enemy
							kill();
						}
						else if(colision.CASTLE === have.USER){
							// TODO:user
							kill();
						}
					}
				}
			}
		}
	};

	/**
	 * unit kill
	 * @name kill
	 * @function
	 */
	kill = function(){
		console.dir(sprite);
		delete UNITS[mode][sprite.myNo];
		CONST_CASH.LAYER[mode].UNIT.removeChild(sprite);

		if(sprite.thumb){
			setTimeout(function(){
				sprite.thumb.dragStart();
			},sprite.reverse);
		}
	};

	//unit action
	sprite.addEventListener(enchant.Event.ENTER_FRAME,function(e){
		walk();
		move();
	});

	//add array
	sprite.myNo = UNITS.no;
	UNITS[mode][UNITS.no] = sprite;
	UNITS.no++;

	//add Layer
	return addLayer({
		layer: CONST_CASH.LAYER[mode].UNIT,
		sprite: sprite
	});
};
/**
 * Score display obj
 * @name Score
 * @function
 * @param {Object} config /mode:'USER' || 'ENEMY'/
 * @returns {Object}
 */
PUBLIC.Score = function(config){
	var total = 0,
		rate = 0,
		have = CONST_CASH.HAVE,
		mode = config.mode;
	
	if(mode === have.USER){
		rate = 1;
	}
	else if(mode === have.ENEMY){
		rate = 0.5;
	}

	return {
		total: total,
		rate: rate,
		point: AW.CONST().POINT
	};
};
	return PUBLIC;
}());
//AMIDA Wars init
AW.init({
	race: 'HUMAN',
	//unit order
	order: ['lancer','warrior','knight','archer',
			'clelic','fire_mage','frost_mage','wizard'],
	// easy map creater
	/*
	│─├┤┌┐└┘:road
	■:castle(enemy) !only first line
	□:castle(user) !only last line
	×:no way
	*/
	map: [  '■×■×■×■×',
			'├─┤×│×│×',
			'│×│×├─┤×',
			'│×└┐│×│×',
			'└┐×├┤×└┐',
			'×│×│└┐×│',
			'×├─┤×│×│',
			'×│×│×├─┤',
			'×□×□×□×□' ]
});

