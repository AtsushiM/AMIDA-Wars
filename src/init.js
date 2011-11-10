//AMIDA Wars init
AW.init({
	//select race
	race: 'HUMAN',
	//race: 'UNDEAD',

	//unit order
	order: ['lancer','warrior','knight','archer',
			'clelic','fire_mage','frost_mage','wizard'],

	// easy map creater
	/*
	│─├┤┌┐└┘:road
	■:castle(enemy) !only first line
	□:castle(user) !only last line
	×:no way
	*/
	map: [  '■×■×■×■×',
			'├─┤×│×│×',
			'│×│×├─┤×',
			'│×└┐│×│×',
			'└┐×├┤×└┐',
			'×│×│└┐×│',
			'×├─┤×│×│',
			'×│×│×├─┤',
			'×□×□×□×□' ]
});

