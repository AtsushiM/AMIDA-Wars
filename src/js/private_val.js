//private valiables
var GAME,
    DOM,
    GROUP = {
        USER: { UNIT: new Group(), CASTLE: new Group(), THUMB: new Group() },
        ENEMY: { UNIT: new Group(), CASTLE: new Group(), THUMB: new Group() },
        MAP_OPTION: {
            CASTLE_BASE: new Group(),
            THUMB_BASE: new Group()
        },
        EFFECT: {
            UNIT: new Group()
        }
    },
    USER_RACE = '',
    USER_ORDER = [],
    UNITS = { USER: {}, ENEMY: {}, no: 0 },
    THUMBS = { USER: [], ENEMY: [] },
    CASTLE = { USER: [], ENEMY: [] },
    LABEL = {
        SCORE: {},
        COUNTDOWN: {},
        STATUS_VIEWER: {}
    },
    MAP = {
        BASE: [],
        CASTLE: {
            USER: [],
            ENEMY: []
        },
        COLLISION: [],
        PATH: {}
    },
    SOUND = {
        BGM: {},
        EFFECT: {}
    },
    TYPE = {
        LIGHT: 'LIGHT',
        MIDIUM: 'MIDIUM',
        HEAVY: 'HEAVY',
        NOARMOR: 'NOARMOR'
    },
    WEAK = {
        LIGHT: 'HEAVY',
        MIDIUM: 'MIDIUM',
        HEAVY: 'NOARMOR',
        NOARMOR: 'LIGHT'
    },
    /**
     * override object property
     * @param {Object} prop Property Object.
     * @param {Object} config Config Object.
     * @return {Object} Property Object.
     */
    propOverride = function(prop, config) {
        var i;
        if (prop === undefined) {
            prop = {};
        }
        for (i in config) {
            if (config.hasOwnProperty(i) === true) {
                prop[i] = config[i];
            }
        }
        return prop;
    },
    /**
     * add object to layer
     * @param {Object} config Config Object.
     * @return {Object} Sprite Object.
     */
    addLayer = function(config) {
        config.layer.addChild(config.sprite);
        return config.sprite;
    };
    //return Public
    PUBLIC = {};
