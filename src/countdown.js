/**
 * Create Countdown label
 * @name Countdown
 * @function
 * @param config 
 * @return 
 */
Countdown = function(config){
	var label = new Label(), 
		timelimit = CONST_CASH.TIMELIMIT, 
		sec = 0, 
		limitID, 
		after = function() {},
		count = function() {
			sec++;
			if(sec >= timelimit) {
				after();
				label.stop();
			}
		};

	//set label font
	label.font = '12px ' + CONST_CASH.FONT;
	label.color = '#ccc';

	//set label position
	label.x = config.x;
	label.y = config.y;

	/**
	 * view update
	 * @name update
	 * @function
	 */
	label.update = function() {
		label.text = 'TIME-LIMIT : ' + (timelimit - sec);
	};

	/**
	 * countdown start
	 * @name init
	 * @function
	 */
	label.init = function() {
		label.stop();
		limitID = setInterval(function() {
			count();
			label.update();
		}, 1000);
	};

	/**
	 * set after
	 * @name setAfter
	 * @function
	 * @param func 
	 */
	label.setAfter = function(func) {
		after = func;
	};

	/**
	 * get diff time
	 * @name getDiff
	 * @function
	 * @return 
	 */
	label.getDiff = function() {
		return timelimit - sec;
	};

	/**
	 * stop countdown process
	 * @name stop
	 * @function
	 */
	label.stop = function() {
		clearInterval(limitID);
	};
	
	return label;
};
