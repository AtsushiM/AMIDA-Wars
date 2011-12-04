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
	label.font = '12px ' + CONST_CASH.FONT;
	label.color = '#ccc';

	//set label position
	label.x = x;
	label.y = y;
	
	//enemy score
	ret = {
		label: label, 
		total: total,
		rate: rate,
		mode: mode, 
		point: CONST().POINT, 
		add: add, 
		update: function(){}
	};
	//override user
	if(mode === have.USER) {
		ret.update = function() {
			label.text = 'SCORE : ' + ret.total;
		};
		ret.get = function() {
			return ret.total;
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
