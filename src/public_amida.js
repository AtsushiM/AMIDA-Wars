/**
 * Create Amida Map
 * @name Amida
 * @function
 */
PUBLIC.Amida = function(){
	var	chip_size = CONST_CASH.MAP.CHIP_SIZE,
		chipset = MAP.BASE,
		map = new Map(chip_size,chip_size),
		map_image = GAME.assets[CONST_CASH.MAP.IMAGE], 
		castle_bases = new Group(),
		castle_base,
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
	map.image = map_image;
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


	//castle base set

	//depth set
	root.addChild(map);
	root.addChild(castle_bases);
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
				castle_base = new Sprite(chip_size, chip_size);
				castle_base.image = map_image;
				castle_base.frame = 24;
				castle_base.x = ary[j][0] * chip_size;
				castle_base.y = ary[j][1] * chip_size;
				addLayer({
					layer: castle_bases, 
					sprite: castle_base
				});
				castle = new PUBLIC.Castle({
					mode: i,
					frame: castle_frames[j].NORMAL,
					brake: castle_frames[j].BRAKE,
					x: ary[j][0] * chip_size,
					y: ary[j][1] * chip_size, 
					base: castle_base
				});
				castle.unitX = castle.x + unit_chip_size / 2;
				castle.unitY = castle.y + unit_chip_size / 2;
			}
		}
	}

	//user unit-thumbnail set
	for(i = 0, len = USER_ORDER.length; i < len; i++){
		name = USER_ORDER[i].toUpperCase();
		thumb = new PUBLIC.Thumb({
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

	//Battle init
	Battle.init();

	//surveillant start
	Surveillant.add(function() {
		if(gameStart) {
			EnemyAction.init();
			delete Surveillant.functions.playStart;
			return true;
		}
		return false;
	}, 'playStart');
	Surveillant.add(function() {
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
	}, 'playEnd');
	Surveillant.init();
};
