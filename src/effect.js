/**
 * Create Effect Object
 * @name Effect
 * @function
 * @param {Object}
 * @returns {Object}
 */
Effect = function(config){
	var size = CONST_CASH.UNIT.CHIP_SIZE, 
		frame_start = config.frames[0], 
		frame_end = config.frames[1], 
		type = config.type.toUpperCase(), 
		layer = GROUP.EFFECT[type], 
		sprite = new Sprite(size, size),
		effect = function(e) {
			if(GAME.frame % 3 === 0) {
				sprite.frame++;
				if(sprite.frame >= frame_end) {
					sprite.removeEventListener(enchant.Event.ENTER_FRAME, effect);
					layer.removeChild(sprite);
				}
			}
		};
	
	sprite.image = GAME.assets[CONST_CASH.EFFECT.IMAGE];
	sprite.x = config.x;
	sprite.y = config.y;
	sprite.frame = frame_start;

	//effect action
	sprite.addEventListener(enchant.Event.ENTER_FRAME, effect);

	//add Layer
	return addLayer({
		layer: layer,
		sprite: sprite
	});
};
