/**
 * Create Thumbnail Class
 * @name Thumb
 * @function
 * @param {Object} config / mode:'USER' || 'ENEMY' /
 * @returns {Object}
 */
PUBLIC.Thumb = function(config){
	var size = CONST_CASH.THUMB.CHIP_SIZE,
		image = GAME.assets[CONST_CASH.THUMB.IMAGE],
		prop = CONST().THUMB().PROP,
		unitData = CONST_CASH.UNIT.STATUS[USER_RACE][config.name],
		mode = config.mode.toUpperCase(),
		sprite = new Sprite(size,size),
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
				i,len;
			for(i = 0, len = castles.length; i<len; i++){
				if(obj.intersect(castles[i])){
					hit = castles[i];
					break;
				}
			}
			return hit;
		};

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

	//can drag flg
	sprite.canDrag = true;

	//set default
	defaultX = sprite.x;
	defaultY = sprite.y;

	//set drag action
	sprite.addEventListener(eEv.TOUCH_START, function(e){
		if(this.canDrag === true){
			originX = e.x - this.x;
			originY = e.y - this.y;
			statusViwer.update(sprite.unit);
		}
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
				this.canDrag = false;
				this.opacity = 0.5;

				//set unit point
				this.unit.x = hit.unitX;
				this.unit.y = hit.unitY;
				
				//create unit
				this.lastUnit = new PUBLIC.Unit(this.unit);
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

	//add array
	THUMBS[mode].push(sprite);

	//add Layer
	return addLayer({
		layer: CONST_CASH.LAYER[mode].THUMB,
		sprite: sprite
	});
};
