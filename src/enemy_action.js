var EnemyAction = {
	aiid: 0, 
	race: 'UNDEAD', 
	onMap: [], 
	order: ['SKELTON_DOG', 'SKELTON_WARRIER', 'SKELTON_ARCHER', 'SHADE',
			'SKELTON_SNAKE', 'GOLEM', 'SPECTOR', 'UNDEAD_SPIDER'],
	init: function() {
		var mode = CONST_CASH.HAVE.ENEMY, 
			castle, unit, r, 
			castles = CASTLE.ENEMY,
			castles_len = castles.length,
			unit_status = CONST_CASH.UNIT.STATUS.UNDEAD,
			order = EnemyAction.order, 
			order_len, unit_name;

		EnemyAction.aiid = setInterval(function() {
			order_len = order.length;
			if(order_len > 0) {
				r = Math.floor(Math.random() * castles_len);
				if(r >= castles_len) {
					r = castles_len - 1;
				}
				castle = castles[r];

				r = Math.floor(Math.random() * order_len);
				if(r >= order_len) {
					r = order_len - 1;
				}
				unit_name = order[r];
				unit = unit_status[unit_name];
				order.splice(r, 1);

				r = {
					mode: mode, 
					direction: 2, 
					x: castle.unitX, 
					y: castle.unitY, 
					after_death: function(unit) {
						order.push(unit.name);
					}
				};

				r = propOverride(r, unit);

				unit = new Unit(r);
			}
		}, 3000);
	}, 
	end: function() {
		clearInterval(EnemyAction.aiid);
	}
}
