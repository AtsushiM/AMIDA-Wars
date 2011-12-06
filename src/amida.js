Amida = function(){
    var chip_size = CONST_CASH.MAP.CHIP_SIZE,
        chipset = MAP.BASE,
        map = new Map(chip_size,chip_size),
        map_image = GAME.assets[CONST_CASH.MAP.IMAGE], 
        group_user = GROUP.USER,
        user_castle = group_user.CASTLE,
        group_enemy = GROUP.ENEMY,
        enemy_castle = group_enemy.CASTLE,
        castle_frames = CONST_CASH.CASTLE.FRAME,
        user_mode = CONST_CASH.HAVE.USER,
        castle_point = MAP.CASTLE,
        castle_bases = GROUP.MAP_OPTION.CASTLE_BASE, 
        thumb_bases = GROUP.MAP_OPTION.THUMB_BASE, 
        effect_unit = GROUP.EFFECT.UNIT,
        root = GAME.rootScene,
        unit_chip_size = CONST_CASH.UNIT.CHIP_SIZE,
        score_position = CONST_CASH.SCORE.POSITION,
        countdown, countdown_position = CONST_CASH.COUNTDOWN.POSITION, 
        statusviewer, statusviewer_position = CONST_CASH.STATUS_VIEWER.POSITION, 
        i, j, len, ary, castle, score, animeID;

    DOM  = document.getElementById('enchant-stage');
    
    //map set
    map.image = map_image;
    map.loadData(chipset);

    //map vibration
    /**
     * vibration map
     * @name vibrate
     * @function
     * @param num 
     */
    map.vibrate = function(num) {
        var style = DOM.style;

        num += 'px';

        clearInterval(animeID);
        animeID = setTimeout(function() {
            style.top = 0;
            style.left = num;
            animeID = setTimeout(function() {
                style.top = num;
                style.left = 0;
                animeID = setTimeout(function() {
                    style.top = 0;
                    style.left = '-'+num;
                    animeID = setTimeout(function() {
                        style.top = 0;
                        style.left = 0;
                    }, 30);
                }, 30);
            }, 30);
        }, 30);
    };

    //map methods
    /**
     * get naw squere
     * @name getSquere
     * @function
     * @param obj 
     * @return 
     */
    map.getSquere = function(obj){
        var x, y, f = Math.floor;

        map.getSquere = function(obj) {
            x = f(obj.x/chip_size);
            y = f(obj.y/chip_size);
            return {
                x: x,
                y: y
            };
        };

        return map.getSquere(obj);
    };

    /**
     * get map colision
     * @name getCollision
     * @function
     * @param obj 
     * @return 
     */
    map.getCollision = function(obj){
        var unitPoint = map.getSquere(obj),
            mc = MAP.COLLISION,
            ret = false,
            calc = 0,
            i,j,len,castles,castle;

        if((mc = mc[unitPoint.y]) && (mc = mc[unitPoint.x])){
            if(mc[0] + mc[1] + mc[2] + mc[3] === 1){
                for(i in CASTLE) {
                    if(CASTLE.hasOwnProperty(i) === true){
                        castles = CASTLE[i];
                        for(j = 0,len = castles.length; j < len; j++){
                            castle = castles[j];
                            if(obj.intersect(castle) === true){
                                ret = castle;
                                break;
                            }
                        }
                    }
                }
            } 
            else {
                ret = mc;
            }
        }
        return ret;
    };
    //set global
    MAP.PATH = map;

    //status viewer set
    statusViewer = LABEL.STATUS_VIEWER = new StatusViwer({
        mode: user_mode, 
        x: statusviewer_position[0], 
        y: statusviewer_position[1]
    });

    //score label set
    score = LABEL.SCORE = new Score({
        mode: user_mode, 
        x: score_position[0], 
        y: score_position[1]
    });

    //countdown label set
    countdown = LABEL.COUNTDOWN = new Countdown({
        x: countdown_position[0], 
        y: countdown_position[1]
    });
    countdown.update();
    
    //castle set
    for(i in castle_point){
        if(castle_point.hasOwnProperty(i) === true){
            ary = castle_point[i];
            for(j = 0,len = ary.length; j < len; j++){
                castle = new Castle({
                    mode: i,
                    frame: castle_frames[j].NORMAL,
                    brake: castle_frames[j].BRAKE,
                    x: ary[j][0] * chip_size, 
                    y: ary[j][1] * chip_size
                });
                castle.unitX = castle.x + unit_chip_size / 2;
                castle.unitY = castle.y + unit_chip_size / 2;
            }
        }
    }

    //depth set
    root.addChild(map);
    root.addChild(castle_bases);
    root.addChild(statusViewer);
    root.addChild(thumb_bases);
    root.addChild(group_enemy.CASTLE);
    root.addChild(group_enemy.UNIT);
    root.addChild(group_user.UNIT);
    root.addChild(group_user.CASTLE);
    root.addChild(group_user.THUMB);
    root.addChild(group_enemy.THUMB);
    root.addChild(effect_unit);
    root.addChild(score.label);
    root.addChild(countdown);

    //set sound
    SOUND.EFFECT.EXPLOSION = GAME.assets[CONST_CASH.SOUND.EFFECT.EXPLOSION];

    //Battle init
    Battle.init();

    //surveillant setting
    (function() {
        var end = false, 
            have = CONST_CASH.HAVE, 
            /**
             * game end action
             * @name endAction
             * @function
             */
            endAction = function() {
                var result = new Result(end);

                Surveillant.end();
                EnemyAction.end();
                Log.end();
                countdown.stop();
            };

        Surveillant.add(function() {
            if(gameStart === true) {
                var raceSelect = new RaceSelect();
                countdown.setAfter(function() {
                    end = true;
                    endAction();
                    return true;
                });
                Surveillant.remove('playStart');
                return true;
            }
            return false;
        }, 'playStart');
        Surveillant.add(function() {
            var i, j, len, castles, castle, count;

            if(end !== false) {
                endAction();
                return true;
            }
            for(i in CASTLE) {
                if(CASTLE.hasOwnProperty(i) === true) {
                    castles = CASTLE[i];
                    len = castles.length;
                    count = 0;
                    for(j = 0; j < len; j++) {
                        castle = castles[j];
                        if(castle.hp > 0) {
                            break;
                        }
                        else {
                            count++;
                        }
                    }
                    if(count === len) {
                        end = i;
                        break;
                    }
                }
            }
            return false;
        }, 'playEnd');
        Surveillant.init();
    }());
};
