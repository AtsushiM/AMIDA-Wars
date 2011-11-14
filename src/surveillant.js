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
	 * 
	 * @name add
	 * @function
	 * @param func 
	 * @param key 
	 */
	add: function(func, key) {
		Surveillant.functions[key] = func;
	}, 
	/**
	 * initialise surveillant
	 * @name init
	 * @function
	 */
	init: function() {
		GAME.addEventListener(enchant.Event.ENTER_FRAME, Surveillant.exefunc, false);
	}
};
