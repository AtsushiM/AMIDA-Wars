/**
 * init game data
 * @name init
 * @function
 * @param config 
 */
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
	for(i = 0, len = chipset.length; i < len; i++) {
		chipset[i] = chipset[i].split('');
	}

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
