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
	 * unit kill
	 * @name kill
	 * @function
	 */
	sprite.kill = function(){
		delete UNITS[mode][sprite.myNo];
		CONST_CASH.LAYER[mode].UNIT.removeChild(sprite);

		//thumb drag start
		if(sprite.thumb){
			setTimeout(function(){
				sprite.thumb.dragStart();
			},sprite.reverse);
		}
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
			sprite_type = CONST_CASH.TYPE,
			have = CONST_CASH.HAVE,
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
						else if(colision.TYPE === sprite_type.CASTLE){
							if(mode === have.ENEMY){
								// TODO:enemy
								sprite.kill();
							}
							else if(mode === have.USER){
								// TODO:user
								sprite.kill();
							}
						}
					}
				}
			}
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
