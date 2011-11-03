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
