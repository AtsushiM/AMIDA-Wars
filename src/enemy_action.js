var EnemyAction = {
	init: function() {
		var castle, unit, r, i, 
			castles = CASTLE.ENEMY,
			unit_status = CONST_CASH.UNIT.STATUS.UNDEAD, 
			units = (function(){
				var ret = [];
				for (i in unit_status) {
					if(unit_status.hasOwnProperty(i)) {
						ret.push(i);
					}
				}
				return ret;
			}()), 
			castles_len = castles.length, 
			units_len = units.length;

		console.log(castles);

		AIID = setInterval(function() {
			r = Math.floor(Math.random() * castles_len);
			if(r >= castles_len) {
				r = castles_len - 1;
			}
			castle = castles[r];

			r = Math.floor(Math.random() * units_len);
			if(r >= units_len) {
				r = units_len - 1;
			}
			unit = units[r];
			
			console.log(castle);
			console.log(unit);
		}, 3000);
	}
};
