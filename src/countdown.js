/**
 * Countdown display obj
 * @name Countdown
 * @function
 * @param {Object} 
 * @returns {Object}
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
	label.font = '12px cursive';
	label.color = '#ccc';

	//set label position
	label.x = config.x;
	label.y = config.y;

	label.update = function() {
		label.text = 'TIME-LIMIT : ' + (timelimit - sec);
	};

	label.init = function() {
		label.stop();
		limitID = setInterval(function() {
			count();
			label.update();
		}, 1000);
	};

	label.setAfter = function(func) {
		after = func;
	};

	label.getDiff = function() {
		return timelimit - sec;
	};

	label.stop = function() {
		clearInterval(limitID);
	};
	
	return label;
};
