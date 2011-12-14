var Surveillant = {
    functions: {},
    //process surveillant
    exefunc: function(){
        var i, 
            funcs = Surveillant.functions;
        for(i in funcs) {
            if(funcs.hasOwnProperty(i) === true) {
                funcs[i]();
            }
        }
    }, 
    /**
     * add surveillant process
     * @name add
     * @function
     * @param func 
     * @param key 
     */
    add: function(func, key) {
        Surveillant.functions[key] = func;
    }, 
    /**
     * remove surveillant process
     * @name remove
     * @function
     * @param key 
     */
    remove: function(key) {
        delete Surveillant.functions[key];
    },
    /**
     * start surveillant process
     * @name init
     * @function
     */
    init: function() {
        GAME.addEventListener(enchant.Event.ENTER_FRAME, Surveillant.exefunc, false);
    }, 
    /**
     * stop surveillant process
     * @name stop
     * @function
     */
    stop: function() {
        GAME.removeEventListener(enchant.Event.ENTER_FRAME, Surveillant.exefunc, false);
    }, 
    end: function() {
        Surveillant.functions = {};
        Surveillant.stop();
    }
};
