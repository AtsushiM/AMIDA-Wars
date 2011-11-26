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
		i, j, len, ary, name, castle, thumb, score;

	//map set
	map.image = map_image;
	map.loadData(chipset);

	//map methods
	map.getSquere = function(obj){
		var x = Math.floor(obj.x/chip_size),
			y = Math.floor(obj.y/chip_size);

		return {
			x: x,
			y: y
		};
	};

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
