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
		chipset, order = config.order, i;

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
	GAME.onload = PUBLIC.Amida;
	//Game Start
	GAME.start();
};
