//private valiables
var GAME,
	GROUP = {
		USER: { UNIT: new Group(), CASTLE: new Group(), THUMB: new Group() },
		ENEMY: { UNIT: new Group(), CASTLE: new Group(), THUMB: new Group() }
	},
	USER_RACE = '',
	USER_ORDER = [],
	UNITS = { USER: [], ENEMY: [] },
	THUMBS = { USER: [], ENEMY: [] },
	CASTLE = { USER: [], ENEMY: [] },
	MAP = { BASE: [], CASTLE: { USER: [], ENEMY: [] }, COLLISION: [] },
	TYPE = {
		LIGHT:'LIGHT',
		MIDIUM:'MIDIUM',
		HEAVY:'HEAVY',
		NOARMOR:'NOARMOR'
	},
	WEAK = {
		LIGHT:'HEAVY',
		MIDIUM:'MIDIUM',
		HEAVY:'NOARMOR',
		NOARMOR:'LIGHT'
	};
