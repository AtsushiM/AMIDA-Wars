/**
 * Create StatusViewer Object
 * @name StatusViwer
 * @function
 * @param config 
 * @return 
 */
StatusViwer = function(config){
    var label = new Label(), 
        group = new Group(), 
        unit, 
        cons = CONST_CASH.STATUS_VIEWER, 
        pos = cons.POSITION, 
        bg_image = GAME.assets[cons.IMAGE], 
        bg_size = cons.BG_SIZE, 
        bg = new Sprite(bg_size[0], bg_size[1]), 
        statuslist = CONST_CASH.UNIT.STATUS, 
        user_have = CONST_CASH.HAVE.USER, 
        viewcash =  {};

    group.x = pos[0];
    group.y = pos[1];

    bg.image = bg_image;
    bg.frame = 0;

    //set label font
    label.font = '9px/1.5 ' + CONST_CASH.FONT;
    label.color = '#fff';
    label.text = '';

    //set label position
    label.x = 45;
    label.y = 8;

    //unit view
    unit = new Unit({
        mode: user_have,
        x: 15, 
        y: 15, 
        opacity: 0
    });
    unit.frame = 0;
    unit.direction = 2;
    unit.stay();

    group.update = function(obj) {
        unit.opacity = 1;

        group.update = function(obj) {
            label.text = viewcash[obj.name];
            unit.changeUnit(obj);
        };

        group.update(obj);
    };

    group.init = function() {
        var i, sta, statsies = statuslist[USER_RACE], br = '<br />';
        for(i in statsies) {
            if(statsies.hasOwnProperty(i) === true) {
                sta = statsies[i];
                viewcash[i] = '<b>' + sta.name + '</b>' + br +
                'HP: ' + sta.hp + br +
                'Armor: ' + sta.armor + br +
                'Damage: ' + sta.damage + br +
                'Speed: ' + sta.speed + br +
                'DownTime: ' + sta.reverse + 'sec';
            }
        }
    };

    group.addChild(bg);
    group.addChild(label);
    group.addChild(unit);

    return group;
};
