/**
 * Countdown display obj
 * @name Countdown
 * @function
 * @param {Object} 
 * @returns {Object}
 */
PUBLIC.Countdown = function(config){
	var label = new Label(), 
		timelimit = CONST_CASH.TIMELIMIT, 
		sec = 0, 
		limitID, 
		after = function() {},
		count = function() {
			sec++;
			if(sec >= timelimit) {
				after();
				clearInterval(limitID);
			}
		};

	//set label font
	label.font = '12px cursive';

	//set label position
	label.x = config.x;
	label.y = config.y;

	label.update = function() {
		label.text = timelimit - sec;
	};

	label.init = function() {
		clearInterval(limitID);
		limitID = setInterval(function() {
			count();
			label.update();
		}, 1000);
		return limitID;
	};

	label.setAfter = function(func) {
		after = function() {
			func();
			clearInterval(limitID);
		};
	};
	
	return label;
};
