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
		countdown = new Label(),
		focusMyCastle = function(obj) {
			var hit = false,
				castles = CASTLE.USER,
				castle, 
				i,len,flg = true;

			for(i = 0, len = castles.length; i<len; i++){
				castle = castles[i];
				if(flg === true && obj.intersect(castle)){
					castle.focusOn();
					flg = false;
				}
				else {
					castle.focusOff();
				}
			}
			return hit;
		}, 
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
		},
		dragOnCastle = function() {
			var castles = CASTLE.USER, 
				castle, 
				i, len;

			for(i = 0, len = castles.length; i<len; i++){
				castle = castles[i];
				if(castle.checkBreak()  === false) {
					castle.blinkOn();
				}
			}
		}, 
		dragOffCastle = function() {
			var castles = CASTLE.USER, 
				castle, 
				i, len;

			for(i = 0, len = castles.length; i<len; i++){
				castle = castles[i];
				if(castle.checkBreak()  === false) {
					castle.blinkOff();
				}
			}
		};

	//thumb bg set
	bg.image = image;
	bg.frame = 16;
	bg.x = config.x;
	bg.y = config.y;

	addLayer({
		layer: GROUP.MAP_OPTION.THUMB_BASE, 
		sprite: bg
	});

	//countdown set
	countdown.text = Math.ceil(unitData.reverse);
	countdown.font = '24px ' + CONST_CASH.FONT;
	countdown.color = '#ccc';
	countdown.x = config.x+17;
	countdown.y = config.y+7;

	addLayer({
		layer: GROUP.MAP_OPTION.THUMB_BASE, 
		sprite: countdown
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
			dragOnCastle();
		}
		statusViwer.update(sprite.unit);
	});
	sprite.addEventListener(eEv.TOUCH_MOVE, function(e){
		if(this.canDrag === true){
			this.x = e.x - originX;
			this.y = e.y - originY;
			focusMyCastle(this);
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

				hit.focusOff();
			}
			this.x = defaultX;
			this.y = defaultY;
			dragOffCastle();
		}
	});

	//sprite drag
	sprite.dragStart = function(){
		sprite.canDrag = true;
		sprite.opacity = 1;
	};
	sprite.dragStop = function() {
		sprite.canDrag = false;
		sprite.opacity = 0;
	};

	//reverse
	sprite.reverse = function(unit) {
		var count = Math.ceil(unit.reverse), 
			id = setInterval(function() {
				count--;
				countdown.text = count;
				if(count === 0) {
					countdown.text = '';
					sprite.dragStart();
					clearInterval(id);
				}
			}, 1000);

		countdown.text = count;
		sprite.opacity = 0.3;
	};

	//add array
	THUMBS[mode].push(sprite);

	//set dragmode
	sprite.dragStop();
	sprite.opacity = 0.3;
	sprite.init = function() {
		sprite.reverse(sprite.unit);
	};

	//add Layer
	return addLayer({
		layer: GROUP[mode].THUMB,
		sprite: sprite
	});
};
