/**
 * Create Effect Object
 * @param {Object} config Config object.
 * @return {Object} Effect object.
 */
Effect = function(config) {
    var size = CONST_CASH.UNIT.CHIP_SIZE,
        frames = config.frames,
        frame_start = frames.start,
        frame_end = frames.end,
        rate = frames.rate,
        loop = frames.loop,
        type = config.type.toUpperCase(),
        layer = GROUP.EFFECT[type],
        sprite = new Sprite(size, size),
        effect;

    if (loop === true) {
        effect = function(e) {
            if (GAME.frame % rate === 0) {
                if (sprite.frame >= frame_end) {
                    sprite.frame = frame_start;
                }
                else {
                    sprite.frame++;
                }
            }
        };
    }
    else {
        effect = function(e) {
            if (GAME.frame % rate === 0) {
                sprite.frame++;
                if (sprite.frame >= frame_end) {
                    sprite.end();
                }
            }
        };
    }

    sprite.image = GAME.assets[CONST_CASH.EFFECT.IMAGE];
    sprite.x = config.x;
    sprite.y = config.y;
    sprite.frame = frame_start;

    //effect action
    sprite.addEventListener(enchant.Event.ENTER_FRAME, effect);

    //effect end
    sprite.end = function() {
        sprite.removeEventListener(enchant.Event.ENTER_FRAME, effect);
        layer.removeChild(sprite);
    };

    //add Layer
    return addLayer({
        layer: layer,
        sprite: sprite
    });
};
