StatusViwer = function(config){
	var label = new Label(), 
		group = new Group(), 
		unit_cons = CONST_CASH.UNIT, 
		unit_image = GAME.assets[unit_cons.IMAGE], 
		unit_size = unit_cons.CHIP_SIZE, 
		unit = new Sprite(unit_size, unit_size), 
		cons = CONST_CASH.STATUS_VIEWER, 
		pos = cons.POSITION, 
		bg_image = GAME.assets[cons.IMAGE], 
		bg_size = cons.BG_SIZE, 
		bg = new Sprite(bg_size[0], bg_size[1]), 
		statuslist = CONST_CASH.UNIT.STATUS[USER_RACE], 
		viewcash =  {}, 
		i, sta, br = '<br />';

	for(i in statuslist) {
		if(statuslist.hasOwnProperty(i)) {
			sta = statuslist[i];
			viewcash[i] = '<b>' + sta.name + '</b>' + br +
				  'HP: ' + sta.hp + br +
				  'Armor: ' + sta.armor + br +
				  'Damage: ' + sta.damage + br +
				  'Speed: ' + sta.speed;
		}
	}
	group.x = pos[0];
	group.y = pos[1];

	bg.image = bg_image;
	bg.frame = 0;

	//set label font
	label.font = '9px cursive';
	label.color = '#fff';
	label.text = '';

	//set label position
	label.x = 45;
	label.y = 11;

	//unit view
	unit.image = unit_image;
	unit.frame = 0;

	group.update = function(unit) {
		if(unit) {
			label.text = viewcash[unit.name];
		}
	};

	group.addChild(bg);
	group.addChild(label);
	group.addChild(unit);

	return group;
};
