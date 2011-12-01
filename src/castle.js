Castle = function(config){
	var size = CONST_CASH.MAP.CHIP_SIZE,
		image = GAME.assets[CONST_CASH.MAP.IMAGE],
		prop = CONST().CASTLE().PROP,
		mode = config.mode.toUpperCase(),
		sprite = new Sprite(size,size),
		castle_bases = GROUP.MAP_OPTION.CASTLE_BASE, 
		castle_base, opacity_sign = -1, opacityControll;

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

	//unit drop 
	sprite.focusOn = function() {
		sprite.scaleX = sprite.scaleY = 1.5;
		sprite.focus = true;
	};
	sprite.focusOff = function() {
		sprite.scaleX = sprite.scaleY = 1;
		sprite.focus = false;
	};

	//thumb Drag
	opacityControll = function() {
		if(GAME.frame % 4 === 0) {
			sprite.opacity += 0.1*opacity_sign;
			if(sprite.opacity <= 0.5) {
				opacity_sign = 1;
			}
			else if(sprite.opacity >= 1) {
				opacity_sign = -1;
			}
		}
	};
	sprite.blinkOn = function() {
		sprite.addEventListener(enchant.Event.ENTER_FRAME, opacityControll);
	};
	sprite.blinkOff = function() {
		sprite.removeEventListener(enchant.Event.ENTER_FRAME, opacityControll);
		sprite.opacity = 1;
	};

	sprite.damage = function(unit) {
		//TODO: ユニットごとに城に与えるダメージを決定
		/* sprite.hp -= unit.damage; */
		sprite.hp -= 1;

		if(sprite.hp <= 0) {
			sprite.broke();
		}
		else if(sprite.mhp / 2 >= sprite.hp) {
			sprite.frame = sprite.brake;
		}
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
