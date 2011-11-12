var Battle = {
	/**
	 * initialise Battle
	 * @name init
	 * @function
	 */
	init: function() {
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
	}
};
