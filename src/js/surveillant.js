var Surveillant = {
    functions: {},
    //process surveillant
    exefunc: function() {
        var i,
            ret = [],
            funcs = Surveillant.functions;

        for (i in funcs) {
            if (funcs.hasOwnProperty(i) === true) {
                ret.push(funcs[i]());
            }
        }

        return ret;
    },
    /**
     * add surveillant process
     * @param {Function} func  set function.
     * @param {String} key key name.
     */
    add: function(func, key) {
        Surveillant.functions[key] = func;
    },
    /**
     * remove surveillant process
     * @param {String} key key name.
     */
    remove: function(key) {
        delete Surveillant.functions[key];
    },
    /**
     * start surveillant process
     */
    init: function() {
        GAME.addEventListener(
            enchant.Event.ENTER_FRAME,
            Surveillant.exefunc,
            false
        );
    },
    /**
     * stop surveillant process
     */
    stop: function() {
        GAME.removeEventListener(
            enchant.Event.ENTER_FRAME,
            Surveillant.exefunc,
            false
        );
    },
    end: function() {
        Surveillant.functions = {};
        Surveillant.stop();
    }
};
