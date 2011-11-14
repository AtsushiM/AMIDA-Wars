var Battle = {
	init: function() {
		var func = function() {
			var units_user = UNITS.USER, 
				units_enemy = UNITS.ENEMY, 
				unit_user, unit_enemy, 
				i, j;

			for(i in units_enemy) {
				if(units_enemy.hasOwnProperty(i)) {
					unit_enemy = units_enemy[i];
					for(j in units_user) {
						if(units_user.hasOwnProperty(j)) {
							unit_user = units_user[j];
							if(unit_enemy.intersect(unit_user) && (unit_user.x === unit_enemy.x || unit_user.y === unit_enemy.y)) {
								Battle.unitAndUnit(unit_enemy, unit_user);
							}
						}
					}
				}
			}
		};
		Surveillant.add(func, 'battle');
	}, 
	score: function(obj) {
		var have = CONST_CASH.HAVE, 
			obj_mode = obj.mode, 
			type = CONST_CASH.TYPE, 
			obj_type = obj.type, 
			score = LABEL.SCORE, 
			point = CONST_CASH.POINT;

		if((obj_type !== type.CASTLE && obj_mode === have.USER) || (obj_type === type.CASTLE && obj_mode === have.ENEMY)) {
			score.add(point[obj.type]);
		}
	}, 
	/**
	 * battle for unit and unit
	 * @name unitAndUnit
	 * @function
	 * @param unit1 
	 * @param unit2 
	 */
	unitAndUnit: function(unit1, unit2) {
		var unit1_hp = unit1.hp, 
			unit2_hp = unit2.hp;

		while(unit1_hp > 0 && unit2_hp > 0) {
			unit1_hp = unit1.attack(unit2);
			unit2_hp = unit2.attack(unit1);
		}

		//check death
		if(unit1.checkDeath()) {
			Battle.score(unit1);
		}
		if(unit2.checkDeath()) {
			Battle.score(unit2);
		}
	}, 
	/**
	 * 
	 * @name siege
	 * @function
	 * @param unit 
	 * @param castle 
	 */
	siege: function(unit, castle) {
		var m = unit.mode,
			have = CONST_CASH.HAVE;

		castle.damage(unit);
		unit.kill();

		if(castle.checkBreak()) {
			Battle.score(castle);
		}
	}
};
