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
			effect = new PUBLIC.Effect({
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
