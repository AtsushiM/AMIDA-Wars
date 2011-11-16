//private valiables
var GAME,
	GROUP = {
		USER: { UNIT: new Group(), CASTLE: new Group(), THUMB: new Group() },
		ENEMY: { UNIT: new Group(), CASTLE: new Group(), THUMB: new Group() },
		MAP_OPTION:  { CASTLE_BASE: new Group() }, 
		EFFECT:  { UNIT: new Group() }
	},
	USER_RACE = '',
	USER_ORDER = [],
	UNITS = { USER: {}, ENEMY: {}, no: 0 },
	THUMBS = { USER: [], ENEMY: [] },
	CASTLE = { USER: [], ENEMY: [] },
	LABEL =  { SCORE: {}},
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
	/**
	 * Override object property
	 * @name propOverride
	 * @function
	 * @param {Object} prop overrided object
	 * @param {Object} config add
	 * @returns {Object}
	 */
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
	/**
	 * Add a layer Sprite
	 * @name addLayer
	 * @function
	 * @param {Object} config / layer:target Group / sprite:add Sprite /
	 * @returns sprite 
	 */
	addLayer = function(config){
		config.layer.addChild(config.sprite);
		return config.sprite;
	},
	//return Public
	PUBLIC = {};
