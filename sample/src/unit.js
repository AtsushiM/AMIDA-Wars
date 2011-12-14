/**
 * Create unit object
 * @name Unit
 * @function
 * @param config 
 */
Unit = function(config){
    var size = CONST_CASH.UNIT.CHIP_SIZE,
        map_chip_size = CONST_CASH.MAP.CHIP_SIZE,
        unit_size_diff_x = size / 2,
        unit_size_diff_y = size / 8,
        moveVal = unit_size_diff_x, 
        image = GAME.assets[CONST_CASH.UNIT.IMAGE],
        mode = config.mode.toUpperCase(),
        sprite = new Sprite(size,size),
        hplabel = new Label(), 
        have = CONST_CASH.HAVE,
        line_num = CONST_CASH.UNIT.FRAME_LINE,
        walk_count = 0, walk_true = 0,  
        ai = CONST_CASH.UNIT.AI[mode],
        chip_direction, default_frame,
        mapPoint,checkMoveSquere,getCollision,walk,move;

    //can user override prop
    sprite.direction = 0;
    sprite.image = image;
    sprite = propOverride(sprite,config);

    //hp label
    sprite.hplabel = hplabel;
    hplabel.x = config.x - 12;
    hplabel.y = config.y - 14;
    hplabel.font = '9px ' + CONST_CASH.FONT;
    hplabel.color = '#FAA';
    hplabel.backgroundColor = 'rgba(0,0,0,0.5)';
    hplabel.width = 40;
    hplabel.update = function(){
        hplabel.text = '†' + sprite.damage + '/♥' + sprite.hp;
    };
    hplabel.update();

    addLayer({
        layer: GROUP[mode].UNIT,
        sprite: hplabel
    });


    //set Class
    sprite.type = CONST_CASH.TYPE.UNIT;

    /**
     * unit attack process
     * @name attack
     * @function
     * @param vsUnit 
     * @return 
     */
    sprite.attack = function(vsUnit) {
        vsUnit.hp -= sprite.damage;
        sprite.attacked({
            mine: sprite, 
            enemy: vsUnit
        });
        vsUnit.hplabel.update();
        if(vsUnit.hp <= 0) {
            vsUnit.dead({
                mine: sprite, 
                enemy: vsUnit
            });
            vsUnit.kill();
        }
        return vsUnit.hp;
    };
    /**
     * unit kill process
     * @name kill
     * @function
     */
    sprite.kill = function(){
        var x = sprite.x, 
            y = sprite.y, 
            effect = new Effect({
                type: sprite.type.toUpperCase(), 
                x: x, 
                y: y, 
                frames: CONST_CASH.EFFECT.FRAME.EXPLOSION
            });

        //TODO: Effectクラスに移動
        /* SOUND.EFFECT.EXPLOSION.play(); */

        delete UNITS[mode][sprite.myNo];
        GROUP[mode].UNIT.removeChild(sprite);
        GROUP[mode].UNIT.removeChild(hplabel);

        //after action
        if(typeof sprite.after_death === 'function') {
            setTimeout(function() {
                sprite.after_death(sprite);
            }, sprite.reverse * 1000);
        }

        if(sprite.thumb !== undefined){
            sprite.thumb.reverse(sprite);
        }
    };

    /**
     * check unit death
     * @name checkDeath
     * @function
     * @return 
     */
    sprite.checkDeath = function() {
        if(sprite.hp === 0) {
            return true;
        }
        return false;
    };

    default_frame = sprite.frame;

    /**
     * change sprite view
     * @name changeUnit
     * @function
     * @param unit 
     */
    sprite.changeUnit = function(unit) {
        default_frame = unit.frame;
    };

    /**
     * get sprite map-point
     * @name mapPoint
     * @function
     * @return 
     */
    mapPoint = function(){
        return MAP.PATH.getSquere(sprite);
    };
    //set before map squere point
    sprite.beforePoint = mapPoint();

    /**
     * check unit moved squere
     * @name checkMoveSquere
     * @function
     * @return 
     */
    checkMoveSquere = function(){
        var ret = false;

        if(moveVal >= map_chip_size){
            var now,
                before = sprite.beforePoint;

            moveVal = moveVal - map_chip_size;
            if(moveVal > 0) {
                switch(sprite.direction) {
                    case 0: 
                        sprite.y += moveVal;
                        break;
                    case 1: 
                        sprite.x -= moveVal;
                        break;
                    case 2: 
                        sprite.y -= moveVal;
                        break;
                    case 3: 
                        sprite.x += moveVal;
                        break;
                    default: 

                }
                sprite.y = Math.round(sprite.y);
                sprite.x = Math.round(sprite.x);
            }
            moveVal = 0;

            now = mapPoint();

            if(now.x !== before.x || now.y !== before.y){
                before = now;
                ret = true;
            }
        }
        return ret;
    };
    /**
     * get map collision
     * @name getCollision
     * @function
     * @return 
     */
    getCollision = function(){
        return MAP.PATH.getCollision(sprite);
    };

    /**
     * effect unit walk
     * @name walk
     * @function
     */
    walk = function() {
        // animation
        if(GAME.frame % 5 === 0){
            walk_count++;

            switch(walk_count) {
                case 4: 
                    walk_count = 0;
                    walk_true = -1;
                    break;
                case 3: 
                    walk_true = 0;
                    break;
                default: 

            }
            walk_true++;
        }
        sprite.frame = default_frame + walk_true * line_num + sprite.direction;
    };

    /**
     * unit move action
     * @name move
     * @function
     */
    move = function(){
        var d = sprite.direction,
            s = sprite.speed,
            sprite_type = CONST_CASH.TYPE,
            i,len = ai.length,aii,colision;

        move = function() {
            if(GAME.frame % 3 === 0) {
                walk();
                moveVal += s;
                // unit move
                for(i = 0; i < len; i++) {
                    aii = ai[i];
                    if(d === aii.direction){
                        sprite[aii.prop] += (s * aii.sign);
                        hplabel[aii.prop] += (s * aii.sign);
                        if(checkMoveSquere() === true){
                            colision = getCollision();
                            var a= 1;
                            if(colision !== false){
                                if(colision.type !== sprite_type.CASTLE){
                                    if(colision[aii.order[0]] === 1){
                                        sprite.direction = aii.order[0];
                                    }
                                    else if(colision[aii.order[1]] === 1){
                                        sprite.direction = aii.order[1];
                                    }
                                    else if(colision[aii.order[2]] === 1){
                                        sprite.direction = aii.order[2];
                                    }
                                    else {
                                        sprite.direction = aii.order[3];
                                    }
                                }
                                else {
                                    Battle.siege(sprite,colision);
                                }
                            }
                        }

                        break;
                    }
                }
            }
        };
        move();
    };

    //unit action
    sprite.addEventListener(enchant.Event.ENTER_FRAME,move);

    /**
     * unit stop and walk effect
     * @name stay
     * @function
     */
    sprite.stay = function() {
        GROUP[mode].UNIT.removeChild(hplabel);
        sprite.removeEventListener(enchant.Event.ENTER_FRAME, move);
        sprite.addEventListener(enchant.Event.ENTER_FRAME, function() {
            walk();
        });
    };

    //add array
    sprite.myNo = UNITS.no;
    UNITS[mode][UNITS.no] = sprite;
    UNITS.no++;

    if(mode === have.USER) {
        moveVal = -moveVal;
        hplabel.color = '#AAF';
    }

    Log.unit(sprite);

    //add Layer
    return addLayer({
        layer: GROUP[mode].UNIT,
        sprite: sprite
    });
};
