/**
 * Create castle object
 * @name Castle
 * @function
 * @param config 
 */
Castle = function(config){
    var size = CONST_CASH.MAP.CHIP_SIZE,
        image = GAME.assets[CONST_CASH.MAP.IMAGE],
        prop = CONST().CASTLE().PROP,
        mode = config.mode.toUpperCase(),
        have = CONST_CASH.HAVE,  
        sprite = new Sprite(size,size),
        castle_bases = GROUP.MAP_OPTION.CASTLE_BASE, 
        castle_base, opacity_sign = -1, blinkControll;

    //castle base set
    castle_base = new Sprite(size, size);
    castle_base.image = image;
    castle_base.frame = 24;
    if(mode === have.USER) {
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
    /**
     * touch over thumb
     * @name focusOn
     * @function
     */
    sprite.focusOn = function() {
        sprite.scaleX = sprite.scaleY = 1.4;
        sprite.focus = true;
    };
    /**
     * touch out thumb
     * @name focusOff
     * @function
     */
    sprite.focusOff = function() {
        sprite.scaleX = sprite.scaleY = 1;
        sprite.focus = false;
    };

    /**
     * opacity toggle
     * @name blinkControll
     * @function
     */
    blinkControll = function() {
        if(GAME.frame % 2 === 0) {
            sprite.opacity += 0.1 * opacity_sign;
            if(sprite.opacity <= 0.5) {
                opacity_sign = 1;
            }
            else if(sprite.opacity >= 1) {
                opacity_sign = -1;
            }
        }
    };
    /**
     * set enterframe blink
     * @name blinkOn
     * @function
     */
    sprite.blinkOn = function() {
        sprite.addEventListener(enchant.Event.ENTER_FRAME, blinkControll);
    };
    /**
     * remove enterframe blink
     * @name blinkOff
     * @function
     */
    sprite.blinkOff = function() {
        sprite.removeEventListener(enchant.Event.ENTER_FRAME, blinkControll);
        sprite.opacity = 1;
    };

    /**
     * damage process
     * @name damage
     * @function
     * @param unit 
     */
    sprite.damage = function(unit) {
        sprite.hp -= unit.siege;

        if(sprite.hp <= 0) {
            sprite.hp = 0;
            sprite.broke();
        }
        else if(sprite.mhp / 2 >= sprite.hp) {
            sprite.frame = sprite.brake;
        }
    };
    /**
     * unit break process
     * @name broke
     * @function
     */
    sprite.broke = function() {
        sprite.hp = sprite.opacity = sprite.base.opacity = 0;
    };
    /**
     * check unit break
     * @name checkBreak
     * @function
     * @return 
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
