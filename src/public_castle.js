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

	//add array
	CASTLE[mode].push(sprite);

	//add Layer
	return addLayer({
		layer: CONST_CASH.LAYER[mode].CASTLE,
		sprite: sprite
	});
};
