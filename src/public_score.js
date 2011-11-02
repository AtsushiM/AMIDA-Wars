/**
 * Score display obj
 * @name Score
 * @function
 * @param {Object} config /mode:'USER' || 'ENEMY'/
 * @returns {Object}
 */
PUBLIC.Score = function(config){
	var total = 0,
		rate = 0,
		have = CONST_CASH.HAVE,
		mode = config.mode;
	
	if(mode === have.USER){
		rate = 1;
	}
	else if(mode === have.ENEMY){
		rate = 0.5;
	}

	return {
		total: total,
		rate: rate,
		point: AW.CONST().POINT
	};
};
