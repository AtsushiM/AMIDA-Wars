//private valiables
var GAME,
	DOM, 
	GROUP = {
		USER: { UNIT: new Group(), CASTLE: new Group(), THUMB: new Group() },
		ENEMY: { UNIT: new Group(), CASTLE: new Group(), THUMB: new Group() },
		MAP_OPTION:  { CASTLE_BASE: new Group(), THUMB_BASE: new Group() }, 
		EFFECT:  { UNIT: new Group() }
	},
	USER_RACE = '',
	USER_ORDER = [],
	UNITS = { USER: {}, ENEMY: {}, no: 0 },
	THUMBS = { USER: [], ENEMY: [] },
	CASTLE = { USER: [], ENEMY: [] },
	LABEL =  { SCORE: {}, COUNTDOWN: {}, STATUS_VIEWER:  {} },
	MAP = { BASE: [], CASTLE: { USER: [], ENEMY: [] }, COLLISION: [], PATH: {} },
	SOUND =  { BGM:  {}, EFFECT:  {} }, 
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
	},
	propOverride = function(prop,config){
		if(prop === undefined){
			prop = {};
		}
		for(var i in config){
			if(config.hasOwnProperty(i)){
				prop[i] = config[i];
			}
		}
		return prop;
	},
	addLayer = function(config){
		config.layer.addChild(config.sprite);
		return config.sprite;
	},
	//return Public
	PUBLIC = {};
