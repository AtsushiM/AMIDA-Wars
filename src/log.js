//loged user action
var Log = {
	logid: 0, 
	data: {
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
		console.log(JSON.stringify(Log.data));
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
		Log.end();
		Log.logid = setInterval(Log.send, 30000);
	},
	end: function() {
		Log.send();
		clearInterval(Log.logid);
	}
};
