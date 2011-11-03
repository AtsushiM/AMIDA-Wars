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
