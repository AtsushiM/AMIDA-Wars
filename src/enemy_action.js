var EnemyAction = {
	aiid: 0, 
	init: function() {
		var mode = CONST_CASH.HAVE.ENEMY, 
			castle, unit, r, 
			castles = CASTLE.ENEMY,
			unit_status = CONST_CASH.UNIT.STATUS.UNDEAD, 
			units = (function(){
				var ret = [], i;
				for (i in unit_status) {
					if(unit_status.hasOwnProperty(i)) {
						ret.push(i);
					}
				}
				return ret;
			}()), 
			castles_len = castles.length, 
			units_len = units.length;

		EnemyAction.aiid = setInterval(function() {
			r = Math.floor(Math.random() * castles_len);
			if(r >= castles_len) {
				r = castles_len - 1;
			}
			castle = castles[r];

			r = Math.floor(Math.random() * units_len);
			if(r >= units_len) {
				r = units_len - 1;
			}
			unit = unit_status[units[r]];

			r = {
				mode: mode, 
				direction: 2, 
				x: castle.unitX, 
				y: castle.unitY
			};

			r = propOverride(r, unit);

			unit = AW.Unit(r);
		}, 5000);
	}, 
	end: function() {
		clearInterval(EnemyAction.aiid);
	}
};
