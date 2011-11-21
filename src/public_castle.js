/**
 * Create Castle Object
 * @name Castle
 * @function
 * @param {Object} config / mode:'USER' || 'ENEMY' /
 * @returns {Object}
 */
PUBLIC.Castle = function(config){
	var size = CONST_CASH.MAP.CHIP_SIZE,
		image = GAME.assets[CONST_CASH.MAP.IMAGE],
		prop = CONST().CASTLE().PROP,
		mode = config.mode.toUpperCase(),
		sprite = new Sprite(size,size),
		castle_bases = GROUP.MAP_OPTION.CASTLE_BASE, 
		castle_base;

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

	/**
	 * castle damage
	 * @name damage
	 * @function
	 * @param unit 
	 */
	sprite.damage = function(unit) {
		sprite.hp -= unit.damage;
		if(sprite.hp <= 0) {
			sprite.hp = 0;
			sprite.opacity = 0;
			sprite.base.opacity = 0;
		}
		else if(sprite.mhp / 2 >= sprite.hp) {
			sprite.frame = sprite.brake;
		}
	};
	/**
	 * 
	 * @name checkBreak
	 * @function
	 * @return boolean
	 */
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
