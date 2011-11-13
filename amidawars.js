enchant();
var AW = (function(){
//private valiables
var GAME,
	GROUP = {
		USER: { UNIT: new Group(), CASTLE: new Group(), THUMB: new Group() },
		ENEMY: { UNIT: new Group(), CASTLE: new Group(), THUMB: new Group() },
		EFFECT:  { UNIT: new Group() }
	},
	USER_RACE = '',
	USER_ORDER = [],
	UNITS = { USER: {}, ENEMY: {}, no: 0 },
	THUMBS = { USER: [], ENEMY: [] },
	CASTLE = { USER: [], ENEMY: [] },
	LABEL =  { SCORE: {}},
	MAP = { BASE: [], CASTLE: { USER: [], ENEMY: [] }, COLLISION: [], PATH: {} },
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
						SPECTOR:         { name:'SPECTOR',         frame:108, hp:1, armor:TYPE.MIDIUM, speed:1, damage:1, reverse:1000 },
						SKELTON_SNAKE:   { name:'SKELTON_SNAKE',   frame:144, hp:1, armor:TYPE.MIDIUM, speed:1, damage:1, reverse:1000 },
						GOLEM:           { name:'GOLEM',           frame:148, hp:1, armor:TYPE.MIDIUM, speed:1, damage:1, reverse:1000 },
						SHADE:           { name:'SHADE',           frame:152, hp:1, armor:TYPE.MIDIUM, speed:1, damage:1, reverse:1000 },
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
		LAYER: function(){
			return {
				USER: { UNIT: GROUP.USER.UNIT, CASTLE: GROUP.USER.CASTLE, THUMB: GROUP.USER.THUMB },
				ENEMY: { UNIT: GROUP.ENEMY.UNIT, CASTLE: GROUP.ENEMY.CASTLE, THUMB: GROUP.ENEMY.THUMB },
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
				UNIT: 100, CASTLE: 1000, WIN: 5000, LOSE: -5000
			};
		}
	};
},
CONST_CASH = CONST();
CONST_CASH = {
	UNIT: CONST_CASH.UNIT(),
	THUMB: CONST_CASH.THUMB(),
	SCORE: CONST_CASH.SCORE(),
	MAP: CONST_CASH.MAP(),
	CASTLE: CONST_CASH.CASTLE(),
	EFFECT: CONST_CASH.EFFECT(),
	LAYER: CONST_CASH.LAYER(),
	TYPE: CONST_CASH.TYPE(),
	HAVE: CONST_CASH.HAVE(),
	POINT: CONST_CASH.POINT() 
};
 /**
  * Game Init
  * @name init
  * @function
  */
PUBLIC.init = function(config){
	var img = {
			UNIT: CONST_CASH.UNIT.IMAGE,
			THUMB: CONST_CASH.THUMB.IMAGE,
			MAP: CONST_CASH.MAP.IMAGE, 
			EFFECT: CONST_CASH.EFFECT.IMAGE
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
	GAME.preload(img.UNIT,img.THUMB,img.MAP,img.EFFECT);
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
		effect_unit = GROUP.EFFECT.UNIT,
		root = GAME.rootScene,
		unit_chip_size = CONST_CASH.UNIT.CHIP_SIZE,
		score_position = CONST_CASH.SCORE.POSITION,
		i, j, len, ary, name, castle, thumb, score, 
		copy_mizoue, copy_denzi;

	//map set
	map.image = GAME.assets[CONST_CASH.MAP.IMAGE];
	map.loadData(chipset);

	//score label set
	score = LABEL.SCORE = PUBLIC.Score({
		mode: user_mode, 
		x: score_position[0], 
		y: score_position[1]
	});

	//copy right set
	copy_mizoue = new Label();
	copy_mizoue.text = '(c) Atsushi Mizoue: <a href="http://www.facebook.com/atsushi.mizoue" target="_blank">www.facebook.com/atsushi.mizoue</a>';
	copy_mizoue.x = 10;
	copy_mizoue.y = 450;
	copy_mizoue.font = '10px cursive';

	copy_denzi = new Label();
	copy_denzi.text = 'Graphic: (c) Denzi日記: <a href="http://d.hatena.ne.jp/Denzi/" target="_blank">d.hatena.ne.jp/Denzi/</a>';
	copy_denzi.x = 10;
	copy_denzi.y = 463;
	copy_denzi.font = '10px cursive';

	//depth set
	root.addChild(map);
	root.addChild(group_enemy.CASTLE);
	root.addChild(group_enemy.UNIT);
	root.addChild(group_user.UNIT);
	root.addChild(group_user.CASTLE);
	root.addChild(group_user.THUMB);
	root.addChild(group_enemy.THUMB);
	root.addChild(effect_unit);
	root.addChild(score.label);
	root.addChild(copy_mizoue);
	root.addChild(copy_denzi);
	
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
		name = USER_ORDER[i].toUpperCase();
		thumb = new AW.Thumb({
			mode: user_mode,
			name: name,
			frame: CONST_CASH.THUMB.FRAME[USER_RACE][name],
			x: thumb_position[i][0],
			y: thumb_position[i][1]
		});
	}

	//map methods
	/**
	* Gets the point on the map.
	* @name getSquere
	* @function
	* @param obj 
	*/
	map.getSquere = function(obj){
		var x = Math.floor(obj.x/chip_size),
			y = Math.floor(obj.y/chip_size);

		return {
			x: x,
			y: y
		};
	};

	/**
	 * Gets the obj point Collision
	 * @name getCollision
	 * @function
	 * @param obj 
	 * @return 
	 */
	map.getCollision = function(obj){
		var unitPoint = map.getSquere(obj),
			mc = MAP.COLLISION,
			ret = false,
			calc = 0,
			i,j,len,castles,castle;

		if((mc = mc[unitPoint.y]) && (mc = mc[unitPoint.x])){
			calc = mc[0] + mc[1] + mc[2] + mc[3];
			if(calc === 1){
				for(i in CASTLE) {
					if(CASTLE.hasOwnProperty(i)){
						castles = CASTLE[i];
						for(j = 0,len = castles.length; j < len; j++){
							castle = castles[j];
							if(obj.intersect(castle)){
								ret = castle;
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

	//surveillant start
	Surveillant.init();
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

	//set type
	sprite.type = CONST_CASH.TYPE.CASTLE;

	//add array
	CASTLE[mode].push(sprite);

	// TODO: 
	/**
	 * castle damage
	 * @name damage
	 * @function
	 * @param unit 
	 */
	sprite.damage = function(unit) {
		sprite.hp -= unit.damage;
		if(sprite.hp <= 0) {
			sprite.hp = 0;
			sprite.opacity = 0;
		}
		else if(sprite.mhp / 2 >= sprite.hp) {
			sprite.frame = sprite.brake;
		}
	};
	/**
	 * 
	 * @name checkBreak
	 * @function
	 * @return boolean
	 */
	sprite.checkBreak = function(){
		if(sprite.hp === 0) {
			return true;
		}
		return false;
	};

	//add Layer
	return addLayer({
		layer: CONST_CASH.LAYER[mode].CASTLE,
		sprite: sprite
	});
};
/**
 * Create Thumbnail Class
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
		/**
		 * Check if hit in the castle
		 * @name hitMyCastle
		 * @function
		 * @param obj 
		 * @return 
		 */
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

	//set type
	sprite.type = CONST_CASH.TYPE.THUMB;

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
 * Create Unit Class
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
		mapPoint,checkMoveSquere,getCollision,walk,move;


	//can user override prop
	sprite.direction = 0;
	sprite.image = image;
	sprite = propOverride(sprite,config);

	//set Class
	sprite.type = CONST_CASH.TYPE.UNIT;

	/**
	 * attack Processing
	 * @name attack
	 * @function
	 * @param vsUnit 
	 * @return 
	 */
	sprite.attack = function(vsUnit) {
		vsUnit.hp -= sprite.damage;
		if(vsUnit.hp <= 0) {
			vsUnit.kill();
		}
		return vsUnit.hp;
	};
	/**
	 * unit kill
	 * @name kill
	 * @function
	 */
	sprite.kill = function(){
		var x = sprite.x, 
			y = sprite.y, 
			effect = new AW.Effect({
				type: sprite.type.toUpperCase(), 
				x: x, 
				y: y, 
				frames: CONST_CASH.EFFECT.FRAME.EXPLOSION
			});

		delete UNITS[mode][sprite.myNo];
		CONST_CASH.LAYER[mode].UNIT.removeChild(sprite);

		//thumb drag start
		if(sprite.thumb){
			setTimeout(function(){
				sprite.thumb.dragStart();
			},sprite.reverse);
		}
	};

	/**
	 * check unit death
	 * @name checkDeath
	 * @function
	 * @return 
	 */
	sprite.checkDeath = function() {
		if(sprite.hp === 0) {
			return true;
		}
		return false;
	};

	default_frame = sprite.frame;

	/**
	 * Get the sprite's position on the map
	 * @name mapPoint
	 * @function
	 */
	mapPoint = function(){
		return MAP.PATH.getSquere(sprite);
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
		return MAP.PATH.getCollision(sprite);
	};

	/**
	 * unit move
	 * @name move
	 * @function
	 */
	move = function(){
		var d = sprite.direction,
			s = sprite.speed,
			sprite_type = CONST_CASH.TYPE,
			i,len = ai.length,aii,colision;

		// animation
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

		// unit move
		for(i = 0; i < len; i++) {
			aii = ai[i];
			if(d === aii.direction){
				sprite[aii.prop] += (s * aii.sign);
				if(checkMoveSquere()){
					colision = getCollision();
					var a= 1;
					if(colision !== false){
						if(colision.type !== sprite_type.CASTLE){
							if(colision[aii.order[0]] === 1){
								sprite.direction = aii.order[0];
							}
							else if(colision[aii.order[1]] === 1){
								sprite.direction = aii.order[1];
							}
							else if(colision[aii.order[2]] === 1){
								sprite.direction = aii.order[2];
							}
							else {
								sprite.direction = aii.order[3];
							}
						}
						else {
							Battle.siege(sprite,colision);
						}
					}
				}

				break;
			}
		}
	};

	//unit action
	sprite.addEventListener(enchant.Event.ENTER_FRAME,function(e){
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
		//enemy point rate
		rate = 0.5,
		have = CONST_CASH.HAVE,
		mode = config.mode, 
		x = config.x, 
		y = config.y, 
		label = new Label(), 
		ret =  {}, 
		add = function(score) {
			ret.total += score;
			return ret.total;
		};

	//set label font
	label.font = '12px cursive';

	//set label position
	label.x = x;
	label.y = y;
	
	//enemy score
	ret = {
		label: label, 
		total: total,
		rate: rate,
		mode: mode, 
		point: AW.CONST().POINT, 
		/**
		 * add score
		 * @name add
		 * @function
		 * @param score 
		 * @return total score
		 */
		add: add, 
		/**
		 * update score label
		 * @name update
		 * @function
		 */
		update: function(){}
	};
	//override user
	if(mode === have.USER) {
		ret.update = function() {
			label.text = 'SCORE : ' + ret.total;
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
 * Create Effect Object
 * @name Effect
 * @function
 * @param {Object}
 * @returns {Object}
 */
PUBLIC.Effect = function(config){
	var size = CONST_CASH.UNIT.CHIP_SIZE, 
		frame_start = config.frames[0], 
		frame_end = config.frames[1], 
		type = config.type.toUpperCase(), 
		layer = CONST_CASH.LAYER.EFFECT[type], 
		sprite = new Sprite(size, size),
		effect = function(e) {
			if(GAME.frame % 3 === 0) {
				sprite.frame++;
				if(sprite.frame >= frame_end) {
					sprite.removeEventListener(enchant.Event.ENTER_FRAME, effect);
					layer.removeChild(sprite);
				}
			}
		};
	
	sprite.image = GAME.assets[CONST_CASH.EFFECT.IMAGE];
	sprite.x = config.x;
	sprite.y = config.y;
	sprite.frame = frame_start;

	//effect action
	sprite.addEventListener(enchant.Event.ENTER_FRAME, effect);

	//add Layer
	return addLayer({
		layer: layer,
		sprite: sprite
	});
};
var EnemyAction = {
	aiid: 0, 
	init: function() {
		var mode = CONST_CASH.HAVE.ENEMY, 
			castle, unit, r, 
			castles = CASTLE.ENEMY,
			unit_status = CONST_CASH.UNIT.STATUS.UNDEAD, 
			units = (function(){
				var ret = [], i;
				for (i in unit_status) {
					if(unit_status.hasOwnProperty(i)) {
						ret.push(i);
					}
				}
				return ret;
			}()), 
			castles_len = castles.length, 
			units_len = units.length;

		EnemyAction.aiid = setInterval(function() {
			r = Math.floor(Math.random() * castles_len);
			if(r >= castles_len) {
				r = castles_len - 1;
			}
			castle = castles[r];

			r = Math.floor(Math.random() * units_len);
			if(r >= units_len) {
				r = units_len - 1;
			}
			unit = unit_status[units[r]];

			r = {
				mode: mode, 
				direction: 2, 
				x: castle.unitX, 
				y: castle.unitY
			};

			r = propOverride(r, unit);

			unit = AW.Unit(r);
		}, 5000);
	}, 
	end: function() {
		clearInterval(EnemyAction.aiid);
	}
};
var Battle = {
	score: function(obj) {
		var have = CONST_CASH.HAVE, 
			obj_mode = obj.mode, 
			type = CONST_CASH.TYPE, 
			obj_type = obj.type, 
			score = LABEL.SCORE, 
			point = CONST_CASH.POINT;

		if((obj_type !== type.CASTLE && obj_mode === have.USER) || (obj_type === type.CASTLE && obj_mode === have.ENEMY)) {
			score.add(point[obj.type]);
		}
	}, 
	/**
	 * battle for unit and unit
	 * @name unitAndUnit
	 * @function
	 * @param unit1 
	 * @param unit2 
	 */
	unitAndUnit: function(unit1, unit2) {
		var unit1_hp = unit1.hp, 
			unit2_hp = unit2.hp;

		while(unit1_hp > 0 && unit2_hp > 0) {
			unit1_hp = unit1.attack(unit2);
			unit2_hp = unit2.attack(unit1);
		}

		//check death
		if(unit1.checkDeath()) {
			Battle.score(unit1);
		}
		if(unit2.checkDeath()) {
			Battle.score(unit2);
		}
	}, 
	/**
	 * 
	 * @name siege
	 * @function
	 * @param unit 
	 * @param castle 
	 */
	siege: function(unit, castle) {
		var m = unit.mode,
			have = CONST_CASH.HAVE;

		castle.damage(unit);
		unit.kill();

		if(castle.checkBreak()) {
			Battle.score(castle);
		}
	}
};
var Surveillant = {
	functions: {},
	exefunc: function(){
		var i, 
			funcs = Surveillant.functions;
		for(i in funcs) {
			if(funcs.hasOwnProperty(i)) {
				funcs[i]();
			}
		}
	}, 
	/**
	 * initialise surveillant
	 * @name init
	 * @function
	 */
	init: function() {
		var s = Surveillant;
		s.functions =  {
			playStart: s.playStart, 
			playEnd: s.playEnd, 
			battle: s.battle
		};
		GAME.addEventListener(enchant.Event.ENTER_FRAME, s.exefunc, false);
	}, 
	/**
	 * check play start
	 * @name playStart
	 * @function
	 * @return 
	 */
	playStart: function() {
		if(gameStart) {
			EnemyAction.init();
			delete Surveillant.functions.playStart;
			return true;
		}
		return false;
	}, 
	/**
	 * check play end
	 * @name playEnd
	 * @function
	 * @return 
	 */
	playEnd: function() {
		var i, j, castle, castles, len, count, 
			end = false, 
			have = CONST_CASH.HAVE;
		
		for(i in CASTLE) {
			if(CASTLE.hasOwnProperty(i)) {
				castles = CASTLE[i];
				len = castles.length;
				count = 0;
				for(j = 0; j < len; j++) {
					castle = castles[j];
					if(castle.hp > 0) {
						break;
					}
					else {
						count++;
					}
				}
				if(count === len) {
					end = i;
					break;
				}
			}
		}

		if(end !== false) {
			GAME.removeEventListener(enchant.Event.ENTER_FRAME, Surveillant.exefunc);
			EnemyAction.end();

			if(end === have.ENEMY) {
				end = 'WIN';
				score = CONST_CASH.POINT.WIN;
			}
			else if(end === have.USER) {
				end = 'LOSE';
				score = CONST_CASH.POINT.LOSE;
			}

			score = LABEL.SCORE.add(score);
			GAME.end(score, end+':'+score);
			alert(end+':'+score);
			return true;
		}
		return false;
	}, 
	/**
	 * check battle
	 * @name battle
	 * @function
	 */
	battle: function() {
		var units_user = UNITS.USER, 
			units_enemy = UNITS.ENEMY, 
			unit_user, unit_enemy, 
			i, j;

		for(i in units_enemy) {
			if(units_enemy.hasOwnProperty(i)) {
				unit_enemy = units_enemy[i];
				for(j in units_user) {
					if(units_user.hasOwnProperty(j)) {
						unit_user = units_user[j];
						if(unit_enemy.intersect(unit_user) && (unit_user.x === unit_enemy.x || unit_user.y === unit_enemy.y)) {
							Battle.unitAndUnit(unit_enemy, unit_user);
						}
					}
				}
			}
		}
	}
};
	return PUBLIC;
}());
//AMIDA Wars init
AW.init({
	//select race
	race: 'HUMAN',
	//race: 'UNDEAD',

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
