var Battle = {
    /**
     * Battle init
     * @return {Function} Surveillant function.
     */
    init: function() {
        var func = function() {
            var units_user = UNITS.USER,
                units_enemy = UNITS.ENEMY,
                unit_user, unit_enemy,
                i, j;

            for (i in units_enemy) {
                if (units_enemy.hasOwnProperty(i) === true) {
                    unit_enemy = units_enemy[i];
                    for (j in units_user) {
                        if (units_user.hasOwnProperty(j) === true) {
                            unit_user = units_user[j];
                            if (
                                unit_enemy.intersect(unit_user) === true &&
                                (
                                    unit_user.x === unit_enemy.x ||
                                    unit_user.y === unit_enemy.y
                                )
                            ) {
                                Battle.unitAndUnit(unit_enemy, unit_user);
                            }
                        }
                    }
                }
            }
        };
        Surveillant.add(func, 'battle');
        return func;
    },
    /**
     * @param {Object} obj Sprite object.
     * @return {Number} score.
     */
    score: function(obj) {
        var have = CONST_CASH.HAVE,
            obj_mode = obj.mode,
            type = CONST_CASH.TYPE,
            obj_type = obj.type,
            score = LABEL.SCORE,
            point = CONST_CASH.POINT,
            ret;

        if (
            (
                obj_type !== type.CASTLE &&
                obj_mode === have.USER
            ) || (
                obj_type === type.CASTLE &&
                obj_mode === have.ENEMY
            )
        ) {
            ret = point[obj_type];
        }
        else if (obj_type === type.CASTLE && obj_mode === have.USER) {
            ret = -point[obj_type];
        }

        score.add(ret);
        return ret;
    },
    /**
     * battole unit and unit
     * @param {Object} unit1 unit object.
     * @param {Object} unit2 unit object.
     */
    unitAndUnit: function(unit1, unit2) {
        var unit1_hp = unit1.hp,
            unit2_hp = unit2.hp,
            damage1 = unit1_hp,
            damage2 = unit2_hp;

        while (unit1_hp > 0 && unit2_hp > 0) {
            unit1_hp = unit1.attack(unit2, damage1);
            unit2_hp = unit2.attack(unit1, damage2);
        }

        //check death
        if (unit1.checkDeath() === true) {
            Log.death(unit1);
            Battle.score(unit1);
        }
        if (unit2.checkDeath() === true) {
            Log.death(unit2);
            Battle.score(unit2);
        }

        /* MAP.PATH.vibrate(1); */
    },
    /**
     * battle unit and castle
     * @param {Object} unit Unit object.
     * @param {Object} castle Castle object.
     */
    siege: function(unit, castle) {
        Log.siege(castle);
        castle.damage(unit);
        unit.kill();

        MAP.PATH.vibrate(3);

        if (castle.checkBreak() === true) {
            Log.castle(castle);
            Battle.score(castle);
        }
    }
};
