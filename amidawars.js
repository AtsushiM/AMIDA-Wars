enchant();
var AW = (function(W){
//set scroll
var doScroll = function() {
	if (W.pageYOffset === 0) {
		W.scrollTo(0,1);
	}
};
W.addEventListener('load', function() {
	setTimeout(doScroll, 100);
}, false);
W.onorientationchange = function(){
	setTimeout(doScroll, 100);
};
/* TODO:
☆各クラスの最適＆効率化（常時タスク）
・リザルト画面作成
・種族選択画面を作成
・敵種族をランダム選択（最終的にはAI選択）
・自分のAIを投稿するフォーム？（AIを書いてもらうor自動）
・ユニットのステータスを公開したページの作成
・ユニット再配置可能までの秒数を表示
・JSDOC編集
・クリア演出
・ユニットの性能設定
・効果音設定
・ユーザーの行動を保存する（AI作成のため）
・ランキング作成
・ヒーロー実装（自ユニットが死んだ回数や、敵城の状態等を見て使えるかどうか判断するなど）
・イラストを独自に


//ユニット性能原案
・見た目の印象と実際の操作の乖離を少なくする。
・ユーザーは説明をみない、という前提でゴリ押しでもなんとかなる調整を行う。
・RTSらしさ、を少しでもいいから残す。

■遠距離ユニットをどうするか

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
		MAP_OPTION:  { CASTLE_BASE: new Group(), THUMB_BASE: new Group() }, 
		EFFECT:  { UNIT: new Group() }
	},
	USER_RACE = '',
	USER_ORDER = [],
	UNITS = { USER: {}, ENEMY: {}, no: 0 },
	THUMBS = { USER: [], ENEMY: [] },
	CASTLE = { USER: [], ENEMY: [] },
	LABEL =  { SCORE: {}, COUNTDOWN: {}, STATUS_VIEWER:  {} },
	MAP = { BASE: [], CASTLE: { USER: [], ENEMY: [] }, COLLISION: [], PATH: {} },
	SOUND =  { BGM:  {}, EFFECT:  {} }, 
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
	addLayer = function(config){
		config.layer.addChild(config.sprite);
		return config.sprite;
	},
	//return Public
	PUBLIC = {};
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
PUBLIC.init = function(config){
	var img = {
			UNIT: CONST_CASH.UNIT.IMAGE,
			THUMB: CONST_CASH.THUMB.IMAGE,
			MAP: CONST_CASH.MAP.IMAGE, 
			EFFECT: CONST_CASH.EFFECT.IMAGE, 
			STATUS_VIEWER: CONST_CASH.STATUS_VIEWER.IMAGE
		},
		sound =  {
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
		chipset, order = config.order, i, len;

	//set user race
	USER_RACE = config.race;

	//set user order
	for(i = 0, len = order.length; i < len; i++) {
		USER_ORDER.push({
			name: order[i].toUpperCase(), 
			onMap: false
		});
	}

	//set map
	MAP.BASE = chipset = config.map;

	//mapdata init
	(function(){
		var datamap = {
				//don't move
				'0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '24': 0, '26': 0, '27': 0, '28': 0, '29': 0, '30': 0, '31': 0, '32': 0, '33': 0, '34': 0, '35': 0, '36': 0, '37': 0, '38': 0, '39': 0, '40': 0, '41': 0, '42': 0, '43': 0, '44': 0, '45': 0, '46': 0, '47': 0, '48': 0, '49': 0, '50': 0, '51': 0, '52': 0, 
				//castle (25:enemy 99:user)
				'25': [0,0,1,0], '99': [1,0,0,0],
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
			map_start_line = [
				[26, 27, 28, 29, 30, 31, 32, 33, 34, 35], 
				[ 0,  1,  1,  1,  1,  1,  1,  1,  1,  2]
			],
			map_end_line = [
				[ 5,  6,  6,  6,  6,  6,  6,  6,  6,  7], 
				[36, 37, 38, 39, 40, 41, 42, 43, 44, 45], 
				[46, 47, 48, 49, 50, 51, 52, 46, 47, 48], 
				[49, 50, 51, 52, 51, 52, 46, 47, 48, 49]
			],
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
					txt = 99;
				}
				return txt;
			};
		
		chipset = [].concat(map_start_line,chipset,map_end_line);
		
		for(i = 0, ilen = chipset.length; i < ilen; i++){
			calc1 = res[i] = [];
			calc2 = chipset[i];
			if(calc2.length === 8){
				chipset[i] = calc2 = ['3'].concat(calc2,'4');
				var a = 1;
			}
			/* calc2 = chipset[i] = calc2.split(''); */
			for(j = 0, jlen = calc2.length; j < jlen; j++){
				calc2[j] = txt2num(calc2[j]);
				calc1[j] = datamap[calc2[j]];

				if(calc2[j] === 25){
					castle_point.ENEMY.push([j,i]);
				}
				else if(calc2[j] === 99){
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
	/* GAME.preload(img.UNIT,img.THUMB,img.MAP,img.EFFECT, sound.BGM); */
	GAME.preload(img.UNIT,img.THUMB,img.MAP,img.EFFECT,img.STATUS_VIEWER, sound.EFFECT.EXPLOSION);
	//Game onloadSet
	GAME.onload = Amida;
	//Game Start
	GAME.start();
};
Amida = function(){
	var	chip_size = CONST_CASH.MAP.CHIP_SIZE,
		chipset = MAP.BASE,
		map = new Map(chip_size,chip_size),
		map_image = GAME.assets[CONST_CASH.MAP.IMAGE], 
		group_user = GROUP.USER,
		user_castle = group_user.CASTLE,
		group_enemy = GROUP.ENEMY,
		enemy_castle = group_enemy.CASTLE,
		castle_frames = CONST_CASH.CASTLE.FRAME,
		thumb_num = CONST_CASH.THUMB.SET_NUMBER,
		thumb_position = CONST_CASH.THUMB.USER.POSITION,
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
		i, j, len, ary, name, castle, thumb, score, animeID;

	DOM  = document.getElementById('enchant-stage');
	
	//map set
	map.image = map_image;
	map.loadData(chipset);

	//map vibration
	map.vibrate = function(num) {
		var style = DOM.style;

		num += 'px';

		clearInterval(animeID);
		animeID = setTimeout(function() {
			style.top = 0;
			style.left = num;
			animeID = setTimeout(function() {
				style.top = num;
				style.left = 0;
				animeID = setTimeout(function() {
					style.top = 0;
					style.left = '-'+num;
					animeID = setTimeout(function() {
						style.top = 0;
						style.left = 0;
					}, 30);
				}, 30);
			}, 30);
		}, 30);
	};

	//map methods
	map.getSquere = function(obj){
		var x, y, f = Math.floor;

		map.getSquere = function(obj) {
			x = f(obj.x/chip_size);
			y = f(obj.y/chip_size);
			return {
				x: x,
				y: y
			};
		};

		return map.getSquere(obj);
	};

	map.getCollision = function(obj){
		var unitPoint = map.getSquere(obj),
			mc = MAP.COLLISION,
			ret = false,
			calc = 0,
			i,j,len,castles,castle;

		if((mc = mc[unitPoint.y]) && (mc = mc[unitPoint.x])){
			if(mc[0] + mc[1] + mc[2] + mc[3] === 1){
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
	for(i in castle_point){
		if(castle_point.hasOwnProperty(i)){
			ary = castle_point[i];
			for(j = 0,len = ary.length; j < len; j++){
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

	//user unit-thumbnail set
	for(i = 0, len = USER_ORDER.length; i < len; i++){
		name = USER_ORDER[i].name;
		thumb = new Thumb({
			mode: user_mode,
			name: name,
			frame: CONST_CASH.THUMB.FRAME[USER_RACE][name],
			x: thumb_position[i][0],
			y: thumb_position[i][1]
		});
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
	SOUND.EFFECT.EXPLOSION = GAME.assets[CONST_CASH.SOUND.EFFECT.EXPLOSION];

	//Battle init
	Battle.init();

	//surveillant setting
	(function() {
		var end = false, 
			have = CONST_CASH.HAVE, 
			endAction = function() {
				GAME.removeEventListener(enchant.Event.ENTER_FRAME, Surveillant.exefunc);
				EnemyAction.end();

				if(end === have.ENEMY) {
					end = 'WIN';
					score = CONST_CASH.POINT.WIN +  countdown.getDiff() * CONST_CASH.POINT.TIME;
				}
				else if(end === have.USER) {
					end = 'LOSE';
					score = CONST_CASH.POINT.LOSE;
				}
				else {
					end = 'DRAW';
					score = 0;
				}

				//get time score

				score = LABEL.SCORE.add(score);
				GAME.end(score, end+':'+score);
				countdown.stop();
				alert(end+':'+score);
			};

		Surveillant.add(function() {
			if(gameStart) {
				var i, thumbs;
				thumbs = THUMBS.USER;
				EnemyAction.init();
				countdown.setAfter(function() {
					end = true;
					endAction();
					return true;
				});
				countdown.init();
				for(i in thumbs) {
					if(thumbs.hasOwnProperty(i)) {
						thumbs[i].init();
					}
				}
				delete Surveillant.functions.playStart;
				return true;
			}
			return false;
		}, 'playStart');
		Surveillant.add(function() {
			var i, j, len, castles, castle, count;

			if(end !== false) {
				endAction();
				return true;
			}
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
			return false;
		}, 'playEnd');
		Surveillant.init();
	}());
};
Castle = function(config){
	var size = CONST_CASH.MAP.CHIP_SIZE,
		image = GAME.assets[CONST_CASH.MAP.IMAGE],
		prop = CONST().CASTLE().PROP,
		mode = config.mode.toUpperCase(),
		sprite = new Sprite(size,size),
		castle_bases = GROUP.MAP_OPTION.CASTLE_BASE, 
		castle_base, opacity_sign = -1, opacityControll;

	//castle base set
	castle_base = new Sprite(size, size);
	castle_base.image = image;
	castle_base.frame = 24;
	if(mode === 'USER') {
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
	prop = propOverride(prop,config);

	//sprite setting
	sprite.image = image;
	sprite = propOverride(sprite,prop);

	//set type
	sprite.type = CONST_CASH.TYPE.CASTLE;

	//add array
	CASTLE[mode].push(sprite);

	//unit drop 
	sprite.focusOn = function() {
		sprite.scaleX = sprite.scaleY = 1.5;
		sprite.focus = true;
	};
	sprite.focusOff = function() {
		sprite.scaleX = sprite.scaleY = 1;
		sprite.focus = false;
	};

	//thumb Drag
	opacityControll = function() {
		if(GAME.frame % 4 === 0) {
			sprite.opacity += 0.1*opacity_sign;
			if(sprite.opacity <= 0.5) {
				opacity_sign = 1;
			}
			else if(sprite.opacity >= 1) {
				opacity_sign = -1;
			}
		}
	};
	sprite.blinkOn = function() {
		sprite.addEventListener(enchant.Event.ENTER_FRAME, opacityControll);
	};
	sprite.blinkOff = function() {
		sprite.removeEventListener(enchant.Event.ENTER_FRAME, opacityControll);
		sprite.opacity = 1;
	};

	sprite.damage = function(unit) {
		//TODO: ユニットごとに城に与えるダメージを決定
		/* sprite.hp -= unit.damage; */
		sprite.hp -= 1;

		if(sprite.hp <= 0) {
			sprite.broke();
		}
		else if(sprite.mhp / 2 >= sprite.hp) {
			sprite.frame = sprite.brake;
		}
	};
	sprite.broke = function() {
		sprite.hp = 0;
		sprite.opacity = 0;
		sprite.base.opacity = 0;
	};
	sprite.checkBreak = function(){
		if(sprite.hp === 0) {
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
Thumb = function(config){
	var size = CONST_CASH.THUMB.CHIP_SIZE,
		image = GAME.assets[CONST_CASH.THUMB.IMAGE],
		prop = CONST().THUMB().PROP,
		unitData = CONST_CASH.UNIT.STATUS[USER_RACE][config.name],
		mode = config.mode.toUpperCase(),
		sprite = new Sprite(size,size),
		bg = new Sprite(size, size), 
		originX,originY,defaultX,defaultY,
		eEv = enchant.Event,
		statusViwer = LABEL.STATUS_VIEWER,
		countdown = new Label(),
		focusMyCastle = function(obj) {
			var hit = false,
				castles = CASTLE.USER,
				castle, 
				i,len,flg = true;

			for(i = 0, len = castles.length; i<len; i++){
				castle = castles[i];
				if(flg === true && obj.intersect(castle)){
					castle.focusOn();
					flg = false;
				}
				else {
					castle.focusOff();
				}
			}
			return hit;
		}, 
		hitMyCastle = function(obj){
			var hit = false,
				castles = CASTLE.USER,
				castle, 
				i,len;

			for(i = 0, len = castles.length; i<len; i++){
				castle = castles[i];
				if(obj.intersect(castle)){
					hit = castle;
					break;
				}
			}
			return hit;
		},
		dragOnCastle = function() {
			var castles = CASTLE.USER, 
				castle, 
				i, len;

			for(i = 0, len = castles.length; i<len; i++){
				castle = castles[i];
				if(castle.checkBreak()  === false) {
					castle.blinkOn();
				}
			}
		}, 
		dragOffCastle = function() {
			var castles = CASTLE.USER, 
				castle, 
				i, len;

			for(i = 0, len = castles.length; i<len; i++){
				castle = castles[i];
				if(castle.checkBreak()  === false) {
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
	countdown.x = config.x+17;
	countdown.y = config.y+7;

	addLayer({
		layer: GROUP.MAP_OPTION.THUMB_BASE, 
		sprite: countdown
	});

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

	//set default
	defaultX = sprite.x;
	defaultY = sprite.y;

	//set drag action
	sprite.addEventListener(eEv.TOUCH_START, function(e){
		if(this.canDrag === true){
			originX = e.x - this.x;
			originY = e.y - this.y;
			dragOnCastle();
		}
		statusViwer.update(sprite.unit);
	});
	sprite.addEventListener(eEv.TOUCH_MOVE, function(e){
		if(this.canDrag === true){
			this.x = e.x - originX;
			this.y = e.y - originY;
			focusMyCastle(this);
		}
	});
	sprite.addEventListener(eEv.TOUCH_END, function(e){
		if(this.canDrag === true){
			var hit = hitMyCastle(this);
			if(hit){
				//thumb can't drag
				this.dragStop();

				//set unit point
				this.unit.x = hit.unitX;
				this.unit.y = hit.unitY;
				
				//create unit
				this.lastUnit = new Unit(this.unit);
				this.lastUnit.thumb = this;

				hit.focusOff();
			}
			this.x = defaultX;
			this.y = defaultY;
			dragOffCastle();
		}
	});

	//sprite drag
	sprite.dragStart = function(){
		sprite.canDrag = true;
		sprite.opacity = 1;
	};
	sprite.dragStop = function() {
		sprite.canDrag = false;
		sprite.opacity = 0;
	};

	//reverse
	sprite.reverse = function(unit) {
		var count = Math.ceil(unit.reverse), 
			id = setInterval(function() {
				count--;
				countdown.text = count;
				if(count === 0) {
					countdown.text = '';
					sprite.dragStart();
					clearInterval(id);
				}
			}, 1000);

		countdown.text = count;
		sprite.opacity = 0.3;
	};

	//add array
	THUMBS[mode].push(sprite);

	//set dragmode
	sprite.dragStop();
	sprite.opacity = 0.3;
	sprite.init = function() {
		sprite.reverse(sprite.unit);
	};

	//add Layer
	return addLayer({
		layer: GROUP[mode].THUMB,
		sprite: sprite
	});
};
Unit = function(config){
	var size = CONST_CASH.UNIT.CHIP_SIZE,
		map_chip_size = CONST_CASH.MAP.CHIP_SIZE,
		unit_size_diff_x = size / 2,
		unit_size_diff_y = size / 8,
		moveVal = unit_size_diff_x, 
		image = GAME.assets[CONST_CASH.UNIT.IMAGE],
		mode = config.mode.toUpperCase(),
		sprite = new Sprite(size,size),
		have = CONST_CASH.HAVE,
		line_num = CONST_CASH.UNIT.FRAME_LINE,
		walk_count = 0, walk_true = 0,  
		ai = CONST_CASH.UNIT.AI[mode],
		chip_direction, default_frame,
		mapPoint,checkMoveSquere,getCollision,walk,move;

	if(mode === have.USER) {
		moveVal = -moveVal;
	}


	//can user override prop
	sprite.direction = 0;
	sprite.image = image;
	sprite = propOverride(sprite,config);

	//set Class
	sprite.type = CONST_CASH.TYPE.UNIT;

	sprite.attack = function(vsUnit) {
		vsUnit.hp -= sprite.damage;
		if(vsUnit.hp <= 0) {
			vsUnit.kill();
		}
		return vsUnit.hp;
	};
	sprite.kill = function(){
		var x = sprite.x, 
			y = sprite.y, 
			effect = new Effect({
				type: sprite.type.toUpperCase(), 
				x: x, 
				y: y, 
				frames: CONST_CASH.EFFECT.FRAME.EXPLOSION
			});

		SOUND.EFFECT.EXPLOSION.play();

		delete UNITS[mode][sprite.myNo];
		GROUP[mode].UNIT.removeChild(sprite);

		//after action
		if(typeof sprite.after_death === 'function') {
			setTimeout(function() {
				sprite.after_death(sprite);
			}, sprite.reverse);
		}

		if(sprite.thumb){
			sprite.thumb.reverse(sprite);
		}
	};

	sprite.checkDeath = function() {
		if(sprite.hp === 0) {
			return true;
		}
		return false;
	};

	default_frame = sprite.frame;

	sprite.changeUnit = function(unit) {
		default_frame = unit.frame;
	};

	mapPoint = function(){
		return MAP.PATH.getSquere(sprite);
	};
	//set before map squere point
	sprite.beforePoint = mapPoint();

	checkMoveSquere = function(){
		var ret = false;

		if(moveVal >= map_chip_size){
			var now,
				before = sprite.beforePoint;

			moveVal = moveVal - map_chip_size;
			if(moveVal > 0) {
				if(sprite.direction  === 0) {
					sprite.y += moveVal;
				}
				else if(sprite.direction  === 1) {
					sprite.x -= moveVal;
				}
				else if(sprite.direction  === 2) {
					sprite.y -= moveVal;
				}
				else {
					sprite.x += moveVal;
				}
				sprite.y = Math.round(sprite.y);
				sprite.x = Math.round(sprite.x);
			}
			moveVal = 0;

			now = mapPoint();

			if(now.x !== before.x || now.y !== before.y){
				before = now;
				ret = true;
			}
		}
		return ret;
	};
	getCollision = function(){
		return MAP.PATH.getCollision(sprite);
	};

	walk = function() {
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
	};

	move = function(){
		var d = sprite.direction,
			s = sprite.speed,
			sprite_type = CONST_CASH.TYPE,
			i,len = ai.length,aii,colision;

		move = function() {
			walk();
			moveVal += s;
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
		move();
	};

	//unit action
	sprite.addEventListener(enchant.Event.ENTER_FRAME,move);

	sprite.stay = function() {
		sprite.removeEventListener(enchant.Event.ENTER_FRAME, move);
		sprite.addEventListener(enchant.Event.ENTER_FRAME, function() {
			walk();
		});
	};

	//add array
	sprite.myNo = UNITS.no;
	UNITS[mode][UNITS.no] = sprite;
	UNITS.no++;

	//add Layer
	return addLayer({
		layer: GROUP[mode].UNIT,
		sprite: sprite
	});
};
Score = function(config){
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
Countdown = function(config){
	var label = new Label(), 
		timelimit = CONST_CASH.TIMELIMIT, 
		sec = 0, 
		limitID, 
		after = function() {},
		count = function() {
			sec++;
			if(sec >= timelimit) {
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

	label.update = function() {
		label.text = 'TIME-LIMIT : ' + (timelimit - sec);
	};

	label.init = function() {
		label.stop();
		limitID = setInterval(function() {
			count();
			label.update();
		}, 1000);
	};

	label.setAfter = function(func) {
		after = func;
	};

	label.getDiff = function() {
		return timelimit - sec;
	};

	label.stop = function() {
		clearInterval(limitID);
	};
	
	return label;
};
Effect = function(config){
	var size = CONST_CASH.UNIT.CHIP_SIZE, 
		frame_start = config.frames[0], 
		frame_end = config.frames[1], 
		type = config.type.toUpperCase(), 
		layer = GROUP.EFFECT[type], 
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
	/* race: 'UNDEAD', */
	/* race: 'HUMAN', */ 
	race: '', 
	/* order: ['LANCER','WARRIOR','KNIGHT','ARCHER', 'CLELIC','FIRE_MAGE','FROST_MAGE','WIZARD'], */
	/* order: ['SKELTON_DOG', 'SKELTON_WARRIER', 'SKELTON_ARCHER', 'SHADE', 'SKELTON_SNAKE', 'GOLEM', 'SPECTOR', 'UNDEAD_SPIDER'], */
	order: [],
	init: function() {
		var ea = EnemyAction, 
			mode = CONST_CASH.HAVE.ENEMY, 
			castle, unit, r, 
			castles = CASTLE.ENEMY,
			castles_len = castles.length,
			unit_status = CONST_CASH.UNIT.STATUS,
			order, order_len, unit_name;

		if(USER_RACE === 'HUMAN') {
			ea.race = 'UNDEAD';
			ea.order = ['SKELTON_DOG', 'SKELTON_WARRIER', 'SKELTON_ARCHER', 'SHADE', 'SKELTON_SNAKE', 'GOLEM', 'SPECTOR', 'UNDEAD_SPIDER'];
		}
		else {
			ea.race = 'HUMAN';
			ea.order = ['LANCER','WARRIOR','KNIGHT','ARCHER', 'CLELIC','FIRE_MAGE','FROST_MAGE','WIZARD'];
		}
		unit_status = unit_status[ea.race];
		order = ea.order;

		ea.aiid = setInterval(function() {
			order_len = order.length;
			if(order_len > 0) {
				r = Math.floor(Math.random() * castles_len);
				if(r >= castles_len) {
					r = castles_len - 1;
				}
				castle = castles[r];

				r = Math.floor(Math.random() * order_len);
				if(r >= order_len) {
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
		}, 3000);
	}, 
	end: function() {
		clearInterval(EnemyAction.aiid);
	}
};
var Battle = {
	init: function() {
		var func = function() {
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
		};
		Surveillant.add(func, 'battle');
	}, 
	score: function(obj) {
		var have = CONST_CASH.HAVE, 
			obj_mode = obj.mode, 
			type = CONST_CASH.TYPE, 
			obj_type = obj.type, 
			score = LABEL.SCORE, 
			point = CONST_CASH.POINT;

		if((obj_type !== type.CASTLE && obj_mode === have.USER) || (obj_type === type.CASTLE && obj_mode === have.ENEMY)) {
			score.add(point[obj_type]);
		}
		else if(obj_type === type.CASTLE && obj_mode === have.USER) {
			score.add(-point[obj_type]);
		}
	}, 
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

		MAP.PATH.vibrate(1);
	}, 
	siege: function(unit, castle) {
		castle.damage(unit);
		unit.kill();

		MAP.PATH.vibrate(3);

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
	add: function(func, key) {
		Surveillant.functions[key] = func;
	}, 
	init: function() {
		GAME.addEventListener(enchant.Event.ENTER_FRAME, Surveillant.exefunc, false);
	}
};
StatusViwer = function(config){
	var label = new Label(), 
		group = new Group(), 
		unit, 
		cons = CONST_CASH.STATUS_VIEWER, 
		pos = cons.POSITION, 
		bg_image = GAME.assets[cons.IMAGE], 
		bg_size = cons.BG_SIZE, 
		bg = new Sprite(bg_size[0], bg_size[1]), 
		statuslist = CONST_CASH.UNIT.STATUS[USER_RACE], 
		user_have = CONST_CASH.HAVE.USER, 
		viewcash =  {}, 
		i, sta, br = '<br />';

	for(i in statuslist) {
		if(statuslist.hasOwnProperty(i)) {
			sta = statuslist[i];
			viewcash[i] = '<b>' + sta.name + '</b>' + br +
			'HP: ' + sta.hp + br +
			'Armor: ' + sta.armor + br +
			'Damage: ' + sta.damage + br +
			'Speed: ' + sta.speed + br +
			'DownTime: ' + sta.reverse + 'sec';
		}
	}
	group.x = pos[0];
	group.y = pos[1];

	bg.image = bg_image;
	bg.frame = 0;

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
		};

		group.update(obj);
	};

	group.addChild(bg);
	group.addChild(label);
	group.addChild(unit);

	return group;
};
	return PUBLIC;
}(window));
//AMIDA Wars init
AW.init({
	//select race
	race: 'HUMAN',
	//race: 'UNDEAD',

	//unit order
	order: ['lancer','warrior','knight','archer',
			'clelic','fire_mage','frost_mage','wizard'],
	// order: ['skelton_dog','skelton_snake','skelton_warrier','skelton_archer',
	// 		'golem','undead_spider','spector','shade'],

	// easy map creater
	/*
	│─├┤┌┐└┘:road
	■:castle(enemy) !only first line
	□:castle(user) !only last line
	×:no way
	*/
	map: [
'■×■×■×■×'.split(''), 
'├─┤×│×│×'.split(''),
'│×│×├─┤×'.split(''),
'│×└┐│×│×'.split(''),
'└┐×├┤×└┐'.split(''),
'×│×│└┐×│'.split(''),
'×├─┤×│×│'.split(''),
'×│×│×├─┤'.split(''),
'×□×□×□×□'.split('')
]
});

