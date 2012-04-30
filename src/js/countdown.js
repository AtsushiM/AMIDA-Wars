/**
 * Create Countdown label
 * @param {Object} config Config object.
 * @return {Object} Countdown Object.
 */
var Countdown = function(config) {
    var label = new Label(),
        timelimit = CONST_CASH.TIMELIMIT,
        sec = 0,
        limitID,
        after = function() {},
        count = function() {
            sec++;
            if (sec >= timelimit) {
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
     * @return {String} timelimit text.
     */
    label.update = function() {
        label.text = 'TIME-LIMIT : ' + (timelimit - sec);
        return label.text;
    };

    /**
     * countdown start
     * @return {Boolean} true.
     */
    label.init = function() {
        label.stop();
        limitID = setInterval(function() {
            count();
            label.update();
        }, 1000);
        return true;
    };

    /**
     * set after
     * @param {Function} func after function.
     * @return {Function} set function.
     */
    label.setAfter = function(func) {
        after = func;
        return after;
    };

    /**
     * get diff time
     * @return {Number} time diff.
     */
    label.getDiff = function() {
        return timelimit - sec;
    };

    /**
     * stop countdown process
     * @return {Boolean} true.
     */
    label.stop = function() {
        clearInterval(limitID);
        return true;
    };

    return label;
};
