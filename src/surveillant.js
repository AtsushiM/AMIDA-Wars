var Surveillant = {
	/**
	 * initialise surveillant
	 * @name init
	 * @function
	 */
	init: function() {
		var that = Surveillant;
		EnemyAction.init();
		GAME.addEventListener(enchant.Event.ENTER_FRAME, function() {
			that.battle();
		});
	}, 
	/**
	 * check battle
	 * @name battle
	 * @function
	 */
	battle: function() {
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
						if(unit_enemy.intersect(unit_user)) {
							Battle.unitAndUnit(unit_enemy, unit_user);
						}
					}
				}
			}
		}
	}
};
