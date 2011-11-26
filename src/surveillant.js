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
	add: function(func, key) {
		Surveillant.functions[key] = func;
	}, 
	init: function() {
		GAME.addEventListener(enchant.Event.ENTER_FRAME, Surveillant.exefunc, false);
	}
};
