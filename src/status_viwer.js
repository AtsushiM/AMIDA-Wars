StatusViwer = function(config){
	var label = new Label(), 
		statuslist = CONST_CASH.UNIT.STATUS[USER_RACE];

	//set label font
	label.font = '9px cursive';

	//set label position
	label.x = config.x;
	label.y = config.y;

	label.update = function(unit) {
		var i, sta, txt = '', br = '<br />';
		sta = statuslist.WIZARD;
		if(unit) {
			sta = statuslist[unit.name];
		}
		txt = 'name: ' + sta.name + br +
			  'hp: ' + sta.hp + br +
			  'armor: ' + sta.armor + br +
			  'damage: ' + sta.damage + br +
			  'speed: ' + sta.speed;
		// for(i in sta) {
		// 	if(sta.hasOwnProperty(i)) {
		// 		txt += i + ':' + sta[i] + '<br />';
		// 	}
		// }
		console.log(txt);
		label.text = txt;
	};

	return label;
};
