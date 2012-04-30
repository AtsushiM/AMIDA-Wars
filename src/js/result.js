var Result = function(end) {
    var resultView = new Scene(),
        title = new Label(),
        result = new Label(),
        have = CONST_CASH.HAVE,
        score = LABEL.SCORE.get(),
        score_txt = (function() {
            var point = CONST_CASH.POINT,
                txt, calc, br = '<br>';

            txt = 'SCORE: ' + score + br;

            switch (end) {
                case have.ENEMY:
                    end = 'WIN';
                    Log.data.victory = 1;
                    calc = LABEL.COUNTDOWN.getDiff() * point.TIME;
                    txt += '&nbsp;WIN: ' + point.WIN + br +
                            '&nbsp;CLEAR TIME BONUS: ' + calc;

                    score += point.WIN + calc;
                    break;
                case have.USER:
                    end = 'LOSE';
                    Log.data.victory = -1;
                    txt += '&nbsp;LOSE: ' + point.LOSE;

                    score += point.LOSE;
                    break;
                default:
                    end = 'DRAW';
                    txt += '&nbsp;DRAW: 0';
                    break;
            }

            txt += br + br + '<b>TOTAL: ' + score + '</b>';

            return txt;
        }()),
        font = CONST_CASH.FONT,
        font_color = '#fff';



    title.font = '20px/1.5 ' + font;
    title.color = font_color;
    title.text = 'RESULT';
    title.x = 100;
    title.y = 100;

    result.font = '12px/1.5 ' + font;
    result.color = font_color;
    result.text = score_txt;
    result.x = 100;
    result.y = 150;

    resultView.addChild(title);
    resultView.addChild(result);
    resultView.backgroundColor = 'rgba(0,0,0,0.3)';
    resultView.result = end;

    GAME.pushScene(resultView);
    GAME.end(score, end + ':' + score);

    return resultView;
};
