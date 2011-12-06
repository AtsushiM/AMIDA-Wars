RaceSelect = function(){
    var thumbcons = CONST_CASH.THUMB, 
        chip_size = thumbcons.CHIP_SIZE, 
        sta_human = thumbcons.FRAME.HUMAN, 
        sta_undead = thumbcons.FRAME.UNDEAD, 
        scene = new Scene(), 
        image = GAME.assets[thumbcons.IMAGE], 
        human = new Group(), 
        human_thumb = new Sprite(chip_size, chip_size), 
        human_label = new Label(), 
        human_txt = new Label(), 
        undead = new Group(), 
        undead_thumb = new Sprite(chip_size, chip_size), 
        undead_label = new Label(),
        undead_txt = new Label(), 
        selectAfter = function(config) {
            var i, len, name, order,
            thumbs = THUMBS.USER, 
            user_mode = CONST_CASH.HAVE.USER, 
            thumb_position = CONST_CASH.THUMB.USER.POSITION;

            //set user race
            USER_RACE = config.race;

            //set order
            order = config.order;

            //set user order
            for(i = 0, len = order.length; i < len; i++) {
                USER_ORDER[i] = {
                    name: order[i].toUpperCase(), 
                    onMap: false
                };
                name = USER_ORDER[i].name;
                thumbs[i] = new Thumb({
                    mode: user_mode,
                    name: name,
                    frame: CONST_CASH.THUMB.FRAME[USER_RACE][name],
                    x: thumb_position[i][0],
                    y: thumb_position[i][1]
                });
                thumbs[i].init();
            }
            Log.init();
            EnemyAction.init();
            LABEL.COUNTDOWN.init();
            LABEL.STATUS_VIEWER.init();
            GAME.popScene();
        };


    //scene config
    scene.backgroundColor = 'rgba(0,0,0,0.3)';

    //set image
    human_thumb.image = undead_thumb.image = image;

    //set position
    human.x = undead.x = 30;
    human.y = 100;
    undead.y = 200;

    //set frame
    human_thumb.frame = sta_human.KNIGHT;
    undead_thumb.frame = sta_undead.BONE_WARRIER;
    human_thumb.x  =  undead_thumb.x = 0;
    human_thumb.y  =  undead_thumb.y = 0;

    //set label
    human_label.font = human_txt.font = undead_label.font = undead_txt.font = '12px/1.5 ' + CONST_CASH.FONT;
    human_label.text = '<b>HUMAN</b>';
    undead_label.text = '<b>UNDEAD</b>';
    human_txt.text = '使いやすく、高性能な種族。少数精鋭の混成部隊。<br />バランスの良い陸戦隊と効果の強力な魔術師の組み合わせで敵を葬る。';
    undead_txt.text = '扱いづらい尖った性能を持つユニットが多い種族。<br />操作量に自信があるならば途切れること無く攻め続けられる。';
    human_label.x = undead_label.x = 50;
    human_label.y = undead_label.y = 0;
    human_txt.width = undead_txt.width = 200;
    human_txt.x = undead_txt.x = 50;
    human_txt.y = undead_txt.y = 20;

    //add child
    human.addChild(human_thumb);
    human.addChild(human_label);
    human.addChild(human_txt);
    undead.addChild(undead_thumb);
    undead.addChild(undead_label);
    undead.addChild(undead_txt);

    //set scene
    scene.addChild(human);
    scene.addChild(undead);

    human.addEventListener(enchant.Event.TOUCH_END, function() {
        selectAfter( {
            race: 'HUMAN', 
            order: ['LANCER','WARRIOR','KNIGHT','ARCHER', 'CLELIC','FIRE_MAGE','FROST_MAGE','WIZARD']
        });
    });
    undead.addEventListener(enchant.Event.TOUCH_END, function() {
        selectAfter( {
            race: 'UNDEAD', 
            order: ['BONE_WARRIER', 'BONE_ARCHER', 'BONE_DOG', 'BONE_SNAKE', 'GOLEM', 'ARACHNE', 'SHADE', 'SPECTOR']
        });
    });

    GAME.pushScene(scene);
};
