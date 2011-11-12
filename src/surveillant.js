var Surveillant = {
	functions: {},
	exefunc: function(){
		var i, 
			funcs = Surveillant.functions;
		for(i in funcs) {
			if(funcs.hasOwnProperty(i)) {
				funcs[i]();
			}
		}
	}, 
	/**
	 * initialise surveillant
	 * @name init
	 * @function
	 */
	init: function() {
		var s = Surveillant;
		s.functions =  {
			playStart: s.playStart, 
			playEnd: s.playEnd, 
			battle: s.battle
		};
		GAME.addEventListener(enchant.Event.ENTER_FRAME, s.exefunc, false);
	}, 
	/**
	 * check play start
	 * @name playStart
	 * @function
	 * @return 
	 */
	playStart: function() {
		if(gameStart) {
			EnemyAction.init();
			delete Surveillant.functions.playStart;
			return true;
		}
		return false;
	}, 
	/**
	 * check play end
	 * @name playEnd
	 * @function
	 * @return 
	 */
	playEnd: function() {
		var i, j, castle, castles, len, count, 
			end = false, 
			have = CONST_CASH.HAVE;
		
		for(i in CASTLE) {
			if(CASTLE.hasOwnProperty(i)) {
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

		if(end !== false) {
			GAME.removeEventListener(enchant.Event.ENTER_FRAME, Surveillant.exefunc);
			EnemyAction.end();

			if(end === have.ENEMY) {
				end = 'WIN';
				score = CONST_CASH.POINT.WIN;
			}
			else if(end === have.USER) {
				end = 'LOSE';
				score = CONST_CASH.POINT.LOSE;
			}

			score = LABEL.SCORE.add(score);
			GAME.end(score, end+':'+score);
			alert(end+':'+score);
			return true;
		}
		return false;
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
