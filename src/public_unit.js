/**
 * Create Unit Object
 * @name Unit 
 * @function
 * @param {Object} config 
 * @returns {Object}
 */
PUBLIC.Unit = function(config){
	var size = CONST_CASH.UNIT.CHIP_SIZE,
		image = GAME.assets[CONST_CASH.UNIT.IMAGE],
		mode = config.mode.toUpperCase(),
		sprite = new Sprite(size,size),
		have = CONST_CASH.HAVE,
		line_num = CONST_CASH.UNIT.FRAME_LINE,
		walk_count = 0, walk_true = 0,
		chip_direction, default_frame,
		mapPoint,checkMoveSquere,getCollision,walk,move;

	//can user override prop
	sprite.direction = 0;
	sprite.image = image;
	sprite = propOverride(sprite,config);

	default_frame = sprite.frame;

	mapPoint = function(){
		var size = CONST_CASH.MAP.CHIP_SIZE;
		return {
			x: Math.floor(sprite.x/size),
			y: Math.floor(sprite.y/size)
		};
	};
	//set before map squere point
	sprite.beforePoint = mapPoint();

	checkMoveSquere = function(){
		var map_size = CONST_CASH.MAP.CHIP_SIZE,
			unit_size_diff_x = CONST_CASH.UNIT.CHIP_SIZE / 2,
			unit_size_diff_y = unit_size_diff_x / 4,
			ret = false;

		if(Math.floor(sprite.x - unit_size_diff_x) % map_size === 0 && Math.floor(sprite.y - unit_size_diff_y) % map_size === 0){
			var now = mapPoint(),
				before = sprite.beforePoint;
			if(now.x !== before.x || now.y !== before.y){
				before = now;
				ret = true;
			}
		}
		return ret;
	};
	getCollision = function(){
		var unitPoint = mapPoint(),
			colision = MAP.COLLISION,
			have = CONST_CASH.HAVE,
			ret = false;

		if((colision = colision[unitPoint.y]) && (colision = colision[unitPoint.x])){
			// TODO: hit enemy castle
			if(mc[0] === 0 && mc[1] === 0 && mc[2] === 1 && mc[3] === 0){
				ret = {CASTLE:have.ENEMY};
			} 
			// TODO: hit user castle
			else if(mc[0] === 1 && mc[1] === 0 && mc[2] === 0 && mc[3] === 0){
				ret = {CASTLE:have.USER};
			}
			ret = colision;
		}
		return ret;
	};

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

	if(mode === have.USER){
		// TODO: usermove
		move = function(){
			walk();
			if(sprite.direction === 0){
				sprite.y -= sprite.speed;
				if(checkMoveSquere()){
					/* console.log('change'); */
				}
			}
			else if(sprite.direction === 1){
				sprite.x += sprite.speed;
			}
			else if(sprite.direction === 2){
				sprite.y += sprite.speed;
			}
			else if(sprite.direction === 3){
				sprite.x -= sprite.speed;
			}
		};
	}
	else if(mode === have.ENEMY){
		// TODO: enemymove
		move = function(){
			sprite.y += 1;
		};
	}

	sprite.addEventListener(enchant.Event.ENTER_FRAME,function(e){
		move();
	});

	//add array
	UNITS[mode].push(sprite);

	//add Layer
	return addLayer({
		layer: CONST_CASH.LAYER[mode].UNIT,
		sprite: sprite
	});
};
