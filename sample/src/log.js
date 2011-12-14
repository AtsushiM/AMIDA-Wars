//loged user action
var Log = {
    logid: 0, 
    data: {
        time: 0, 
        victory: 0, 
        unit: {
            USER: 0, 
            ENEMY: 0
        }, 
        death: {
            USER: 0, 
            ENEMY: 0
        }, 
        siege: {
            USER: 0, 
            ENEMY: 0
        }, 
        castle: {
            USER: 0, 
            ENEMY: 0
        }
    }, 
    unit: function(unit) {
        Log.data.unit[unit.mode]++;
    },
    death: function(unit) {
        Log.data.death[unit.mode]++;
    },
    siege: function(castle) {
        Log.data.siege[castle.mode]++;
    },
    castle: function(castle) {
        Log.data.castle[castle.mode]++;
    },
    send: function() {
        Log.data.time = LABEL.COUNTDOWN.getDiff();

        //TODO: DBにデータ保存
        httpRequest = false;
        if(window.XMLHttpRequest) {
            // Firefox, Opera など
            httpRequest = new XMLHttpRequest();
            httpRequest.overrideMimeType('text/xml');
        } else if(window.ActiveXObject) {
            // IE
            try {
                httpRequest = new ActiveXObject('Msxml2.XMLHTTP');
            } catch (e) {
                httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
            }
        }
        httpRequest.open('POST', '/amidawars/log.php', true);
        httpRequest.onreadystatechange = function(e) {
            console.log(e);
        };
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        httpRequest.send('log=' + JSON.stringify(Log.data));
    },
    reset: function() {
        Log.data = {
            time: 0, 
            unit: {
                USER: 0, 
                ENEMY: 0
            }, 
            death: {
                USER: 0, 
                ENEMY: 0
            }, 
            siege: {
                USER: 0, 
                ENEMY: 0
            }, 
            castle: {
                USER: 0, 
                ENEMY: 0
            }
        };
    }, 
    init: function() {
        Log.reset();
        /* Log.end(); */
        /* Log.logid = setInterval(Log.send, 30000); */
    },
    end: function() {
        Log.send();
        clearInterval(Log.logid);
    }
};
