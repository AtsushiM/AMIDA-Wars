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
