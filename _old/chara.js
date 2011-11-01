var char_area = {
	x:4,
	y:3
};
var char_inline_num = char_area.x * 4;
var char_inblock_num = char_area.y * char_inline_num;
var char_map = {
	'lancer':0,
	'warrior':char_area.x,
	'knight':char_area.x * 2,
	'archer':char_area.x * 3,
	'clelic':char_inblock_num * 1,
	'fire_mage':char_inblock_num * 1 + char_area.x,
	'frost_mage':char_inblock_num * 1 + char_area.x * 2,
	'wizard':char_inblock_num * 1 + char_area.x *3,
	'skelton_dog':char_inblock_num * 2,
	'skelton_warrier':char_inblock_num * 2 + char_area.x,
	'skelton_archer':char_inblock_num * 2 + char_area.x * 2,
	'spector':char_inblock_num * 2 + char_area.x * 3,
	'skelton_snake':char_inblock_num * 3,
	'golem':char_inblock_num * 3 + char_area.x,
	'shade':char_inblock_num * 3 + char_area.x * 2,
	'undead_spider':char_inblock_num * 3 + char_area.x * 3
};

var type_map = {
	l:'light',
	m:'midium',
	h:'heavy'
};
var type_weak = {
	l:'h',
	m:'m',
	h:'l'
}

var configLancer = {
		thumb:{
			chara_frame:'lancer',
			frame:0,
			x:0,
			y:352,
			opacity:1,
			unit:{
					damage:1,
					hp:1,
					armor:1,
					speed:1,
					wait:1000,
					type:type_map.h
			}
		}
};
var configWarrior = {
		thumb:{
			chara_frame:'warrior',
			frame:1,
			x:50,
			y:352,
			opacity:1,
			unit:{
					damage:1,
					hp:1,
					armor:1,
					speed:1,
					wait:1000,
					type:type_map.m
			}
		}
};
var configKnight = {
		thumb:{
			chara_frame:'knight',
			frame:2,
			x:100,
			y:352,
			opacity:1,
			unit:{
					damage:2,
					hp:1,
					armor:1,
					speed:1,
					wait:1000,
					type:type_map.h
			}

		}
}
var configArcher = {
		thumb:{
			chara_frame:'archer',
			frame:3,
			x:150,
			y:352,
			opacity:1,
			unit:{
					damage:1,
					hp:1,
					armor:1,
					speed:1,
					wait:1000,
					type:type_map.l
			}

		}
};
var configClelic = {
		thumb:{
			chara_frame:'clelic',
			frame:4,
			x:0,
			y:392,
			opacity:1,
			unit:{
					damage:1,
					hp:1,
					armor:1,
					speed:1,
					wait:1000,
					type:type_map.l
			}

		}
};
var configFireMage = {
		thumb:{
			chara_frame:'fire_mage',
			frame:5,
			x:50,
			y:392,
			opacity:1,
			unit:{
					damage:1,
					hp:1,
					armor:1,
					speed:1,
					wait:1000,
					type:type_map.l
			}
		}
};
var configFrostMage = {
		thumb:{
			chara_frame:'frost_mage',
			frame:6,
			x:100,
			y:392,
			opacity:1,
			unit:{
					damage:1,
					hp:1,
					armor:1,
					speed:1,
					wait:1000,
					type:type_map.l
			}
		}
};
var configWizard = {
		thumb:{
			chara_frame:'wizard',
			frame:7,
			x:150,
			y:392,
			opacity:1,
			unit:{
					damage:1,
					hp:1,
					armor:1,
					speed:1,
					wait:1000,
					type:type_map.l
			}

		}
};
var configSkeltonDog = {
		thumb:{
			chara_frame:'skelton_dog',
			frame:8,
			x:0,
			y:352,
			opacity:1,
			unit:{
					damage:2,
					hp:1,
					armor:1,
					speed:1,
					wait:1000,
					type:type_map.l
			}

		}
};
var configSkeltonWarrier = {
		thumb:{
			chara_frame:'skelton_warrier',
			frame:9,
			x:50,
			y:352,
			opacity:1,
			unit:{
					damage:1,
					hp:1,
					armor:1,
					speed:0.75,
					wait:1000,
					type:type_map.m
			}
		}
};
var configSkeltonArcher = {
		thumb:{
			chara_frame:'skelton_archer',
			frame:10,
			x:100,
			y:352,
			opacity:1,
			unit:{
					damage:1,
					hp:1,
					armor:1,
					speed:0.75,
					wait:1000,
					type:type_map.l
			}

		}
};
var configSpector = {
		thumb:{
			chara_frame:'spector',
			frame:11,
			x:150,
			y:352,
			opacity:1,
			unit:{
					damage:1,
					hp:1,
					armor:1,
					speed:0.5,
					wait:1000,
					type:type_map.l
			}
		}
};
var configSkeltonSnake = {
		thumb:{
			chara_frame:'skelton_snake',
			frame:12,
			x:0,
			y:392,
			opacity:1,
			unit:{
					damage:1,
					hp:2,
					armor:1,
					speed:1,
					wait:1000,
					type:type_map.m
			}
		}
};
var configGolem = {
		thumb:{
			chara_frame:'golem',
			frame:13,
			x:50,
			y:392,
			opacity:1,
			unit:{
					damage:2,
					hp:2,
					armor:2,
					speed:0.25,
					wait:1000,
					type:type_map.h
			}
		}
};
var configShade = {
		thumb:{
			chara_frame:'shade',
			frame:14,
			x:100,
			y:392,
			opacity:1,
			unit:{
					damage:1,
					hp:1,
					armor:1,
					speed:0.5,
					wait:1000,
					type:type_map.l
			}
		}
};
var configUndeadSpider = {
		thumb:{
			chara_frame:'undead_spider',
			frame:15,
			x:150,
			y:392,
			opacity:1,
			unit:{
					damage:1,
					hp:1,
					armor:1,
					speed:0.75,
					wait:1000,
					type:type_map.l
			}
		}
};
