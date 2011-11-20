StatusViwer = function(config){
	var label = new Label(), 
		cons = CONST_CASH.STATUS_VIEWER, 
		pos = cons.POSITION, 
		bg_image = GAME.assets[cons.IMAGE], 
		bg_size = cons.BG_SIZE, 
		bg_position = cons.BG_POSITION, 
		bg = new Sprite(bg_size[0], bg_size[1]), 
		statuslist = CONST_CASH.UNIT.STATUS[USER_RACE];

	bg.image = bg_image;
	bg.frame = 0;
	bg.x = bg_position[0];
	bg.y = bg_position[1];
	addLayer({
		layer: GROUP.MAP_OPTION.THUMB_BASE, 
		sprite: bg
	});
	//set label font
	label.font = '9px cursive';
	label.color = '#fff';
	label.text = '';

	//set label position
	label.x = pos[0];
	label.y = pos[1];

	label.update = function(unit) {
		if(unit) {
			//TODO: CASH
			var i, sta = statuslist[unit.name], txt = '', br = '<br />';
			txt = sta.name + br +
				  'HP: ' + sta.hp + br +
				  'Armor: ' + sta.armor + br +
				  'Damage: ' + sta.damage + br +
				  'Speed: ' + sta.speed;
			label.text = txt;
		}
	};

	return label;
};
