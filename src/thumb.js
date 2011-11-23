/**
 * Create Thumbnail Class
 * @name Thumb
 * @function
 * @param {Object} config / mode:'USER' || 'ENEMY' /
 * @returns {Object}
 */
Thumb = function(config){
	var size = CONST_CASH.THUMB.CHIP_SIZE,
		image = GAME.assets[CONST_CASH.THUMB.IMAGE],
		prop = CONST().THUMB().PROP,
		unitData = CONST_CASH.UNIT.STATUS[USER_RACE][config.name],
		mode = config.mode.toUpperCase(),
		sprite = new Sprite(size,size),
		bg = new Sprite(size, size), 
		originX,originY,defaultX,defaultY,
		eEv = enchant.Event,
		statusViwer = LABEL.STATUS_VIEWER,
		/**
		 * Check if hit in the castle
		 * @name hitMyCastle
		 * @function
		 * @param obj 
		 * @return 
		 */
		hitMyCastle = function(obj){
			var hit = false,
				castles = CASTLE.USER,
				castle, 
				i,len;
			for(i = 0, len = castles.length; i<len; i++){
				castle = castles[i];
				if(obj.intersect(castle)){
					hit = castle;
					break;
				}
			}
			return hit;
		};

	bg.image = image;
	bg.frame = 16;
	bg.x = config.x;
	bg.y = config.y;

	addLayer({
		layer: GROUP.MAP_OPTION.THUMB_BASE, 
		sprite: bg
	});

	//default override
	prop = propOverride(prop,config);

	//sprite setting
	sprite.image = image;
	sprite = propOverride(sprite,prop);

	//set unit data
	sprite.unit = {
		mode:mode
	};
	sprite.unit = propOverride(sprite.unit,unitData);

	//set type
	sprite.type = CONST_CASH.TYPE.THUMB;

	//set default
	defaultX = sprite.x;
	defaultY = sprite.y;

	//set drag action
	sprite.addEventListener(eEv.TOUCH_START, function(e){
		if(this.canDrag === true){
			originX = e.x - this.x;
			originY = e.y - this.y;
		}
		statusViwer.update(sprite.unit);
	});
	sprite.addEventListener(eEv.TOUCH_MOVE, function(e){
		if(this.canDrag === true){
			this.x = e.x - originX;
			this.y = e.y - originY;
		}
	});
	sprite.addEventListener(eEv.TOUCH_END, function(e){
		if(this.canDrag === true){
			var hit = hitMyCastle(this);
			if(hit){
				//thumb can't drag
				this.dragStop();

				//set unit point
				this.unit.x = hit.unitX;
				this.unit.y = hit.unitY;
				
				//create unit
				this.lastUnit = new Unit(this.unit);
				this.lastUnit.thumb = this;
			}
			this.x = defaultX;
			this.y = defaultY;
		}
	});

	//sprite drag
	sprite.dragStart = function(){
		sprite.canDrag = true;
		sprite.opacity = 1;
	};
	sprite.dragStop = function() {
		sprite.canDrag = false;
		sprite.opacity = 0.5;
	};

	//reverse
	sprite.reverse = function(unit) {
		return setTimeout(sprite.dragStart, unit.reverse);
	};

	//add array
	THUMBS[mode].push(sprite);

	//set dragmode
	sprite.dragStop();
	sprite.init = function() {
		sprite.reverse(sprite.unit);
	};

	//add Layer
	return addLayer({
		layer: GROUP[mode].THUMB,
		sprite: sprite
	});
};
