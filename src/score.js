/**
 * Score display obj
 * @name Score
 * @function
 * @param {Object} config 
 * @returns {Object}
 */
Score = function(config){
	var total = 0,
		//enemy point rate
		rate = 0.5,
		have = CONST_CASH.HAVE,
		mode = config.mode, 
		x = config.x, 
		y = config.y, 
		label = new Label(), 
		ret =  {}, 
		add = function(score) {
			ret.total += score;
			return ret.total;
		};

	//set label font
	label.font = '12px cursive';

	//set label position
	label.x = x;
	label.y = y;
	
	//enemy score
	ret = {
		label: label, 
		total: total,
		rate: rate,
		mode: mode, 
		point: PUBLIC.CONST().POINT, 
		/**
		 * add score
		 * @name add
		 * @function
		 * @param score 
		 * @return total score
		 */
		add: add, 
		/**
		 * update score label
		 * @name update
		 * @function
		 */
		update: function(){}
	};
	//override user
	if(mode === have.USER) {
		ret.update = function() {
			label.text = 'SCORE : ' + ret.total;
		};
		ret.add = function(score) {
			add(score);
			ret.update();
			return ret.total;
		};
		ret.rate = 1;
	}

	ret.update();

	return ret;
};
