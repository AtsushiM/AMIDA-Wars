Castle = function(config){
	var size = CONST_CASH.MAP.CHIP_SIZE,
		image = GAME.assets[CONST_CASH.MAP.IMAGE],
		prop = CONST().CASTLE().PROP,
		mode = config.mode.toUpperCase(),
		sprite = new Sprite(size,size),
		castle_bases = GROUP.MAP_OPTION.CASTLE_BASE, 
		castle_base, 
		animeID;

	//castle base set
	castle_base = new Sprite(size, size);
	castle_base.image = image;
	castle_base.frame = 24;
	if(mode === 'USER') {
		castle_base.frame = 16;
	}
	castle_base.x = config.x;
	castle_base.y = config.y;
	addLayer({
		layer: castle_bases, 
		sprite: castle_base
	});
	prop.base = castle_base;

	//default override
	prop = propOverride(prop,config);

	//sprite setting
	sprite.image = image;
	sprite = propOverride(sprite,prop);

	//set type
	sprite.type = CONST_CASH.TYPE.CASTLE;

	//add array
	CASTLE[mode].push(sprite);

	sprite.focusOn = function() {
		sprite.opacity = 0.5;
	};
	sprite.focusOff = function() {
		sprite.opacity = 1;
	};

	sprite.damage = function(unit) {
		sprite.hp -= unit.damage;
		if(sprite.hp <= 0) {
			sprite.broke();
		}
		else if(sprite.mhp / 2 >= sprite.hp) {
			sprite.frame = sprite.brake;
		}
		clearInterval(animeID);
		animeID = setTimeout(function() {
			DOM.style.top = 0;
			DOM.style.left = '5px';
			animeID = setTimeout(function() {
				DOM.style.top = '5px';
				DOM.style.left = 0;
				animeID = setTimeout(function() {
					DOM.style.top = 0;
					DOM.style.left = '-5px';
					animeID = setTimeout(function() {
						DOM.style.top = 0;
						DOM.style.left = 0;
					});
				});
			});
		}, 50);
	};
	sprite.broke = function() {
		sprite.hp = 0;
		sprite.opacity = 0;
		sprite.base.opacity = 0;
	};
	sprite.checkBreak = function(){
		if(sprite.hp === 0) {
			return true;
		}
		return false;
	};

	//add Layer
	return addLayer({
		layer: GROUP[mode].CASTLE,
		sprite: sprite
	});
};
