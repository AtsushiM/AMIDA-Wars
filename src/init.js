//AMIDA Wars init
AW.init({
	//select race
	/* race: 'HUMAN', */
	race: 'UNDEAD',

	//unit order
	// order: ['lancer','warrior','knight','archer',
	// 		'clelic','fire_mage','frost_mage','wizard'],
	order: ['bone_dog','bone_snake','bone_warrier','bone_archer',
			'golem','arachne','spector','shade'],

	// easy map creater
	/*
	│─├┤┌┐└┘:road
	■:castle(enemy) !only first line
	□:castle(user) !only last line
	×:no way
	*/
	map: [
'■×■×■×■×', 
'├─┤×│×│×',
'│×│×├─┤×',
'│×└┐│×│×',
'└┐×├┤×└┐',
'×│×│└┐×│',
'×├─┤×│×│',
'×│×│×├─┤',
'×□×□×□×□'
]
});

