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
		sprite = new Sprite(size,size);

	//default override
	prop = propOverride(prop,config);

	//sprite setting
	sprite.image = image;
	sprite = propOverride(sprite,prop);

	//set type
	sprite.TYPE = CONST_CASH.TYPE.CASTLE;

	//add array
	CASTLE[mode].push(sprite);

	// TODO: 
	sprite.damage = function(unit) {
		sprite.hp -= unit.damage;
		if(sprite.hp <= 0) {
			sprite.broke();
		}
		else if(sprite.mhp / 2 >= sprite.hp) {
			sprite.frame = sprite.brake;
		}
	};
	sprite.broke = function(){
		sprite.hp = 0;
		sprite.opacity = 0;
		//TODO: check game end;
	};

	//add Layer
	return addLayer({
		layer: CONST_CASH.LAYER[mode].CASTLE,
		sprite: sprite
	});
};
