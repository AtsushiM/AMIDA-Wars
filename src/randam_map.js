var RandamMap = function() {
    var map = [
        ['■', '×', '■', '×', '■', '×', '■', '×'],
        ['×', '×', '×', '×', '×', '×', '×', '×'],
        ['×', '×', '×', '×', '×', '×', '×', '×'],
        ['×', '×', '×', '×', '×', '×', '×', '×'],
        ['×', '×', '×', '×', '×', '×', '×', '×'],
        ['×', '×', '×', '×', '×', '×', '×', '×'],
        ['×', '×', '×', '×', '×', '×', '×', '×'],
        ['×', '×', '×', '×', '×', '×', '×', '×'],
        ['×', '□', '×', '□', '×', '□', '×', '□']
    ], 
    LINES = 8, // 引く本数
    castleNum = 4, 
    castleBeyond = map.length - 2, 
    canputline = map[0].length - 2, 
    arr = [], 
    i, j, x, y, r, a, len, chip, chip0, chip1, chip2, chip3, flg, 
    MF = Math.floor, MR = Math.random; 

    // 敵と味方の城を結びつける
    for(i = 0; i < castleNum; i++) {
        y = i * 2; // 水平方向の位置
        r = MF(MR() * castleBeyond) + 1; // 曲がる場所
        
        for(j = 1; j <= castleBeyond; j++) {
            chip = map[j];
            if(j === r) {
                chip[y] = "└";
                chip[y + 1] = "┐";
                y = y + 1; // 横にひとつずれる
            }
            else { 
                chip[y] = "│";
            }
        } 
    }

    // 横線が引ける場所を把握
    for(i = 0; i < canputline; i++) {
        for(j = 1; j <= castleBeyond; j++) {
            chip = map[j];
            chip0 = chip[i];
            if(chip0 === '│') {
                chip1 = chip[i + 1];
                chip2 = chip[i + 2];
                chip3 = chip[i + 3];
                
                // 横線が引けるのは 3 パターン。適当に網羅。
                if( chip1 === '│' || (chip1 === '×' && chip2 === '│') || (i + 3 <= 7 && chip1 === '×' && chip2 === '×' && chip3 === '│')) {
                    arr.push({
                        x: i,
                        y : j
                    });
                }
            }
        } 
    }

    // 横線が引ける場所をランダムに並べ替え
    len = arr.length - 1;
    for(i = 0; i < 100; i++) {
        r = MF(MR() * len) + 1;
        a = arr[0];
        arr[0] = arr[r];
        arr[r] = a;
    }

    // 横線を引く
    for(i = 0; i < arr.length && i < LINES; i++) {
        chip = arr[i];
        x = chip.x;
        y = chip.y;

        chip = map[y];
        chip1 = x + 1;
        chip2 = x + 2;
        chip3 = x + 3;
        
        // 横線が引けるのは 3 パターン。例によって網羅。
        
        // 隣に縦線の場合
        if( chip[x] === "│" && chip[chip1] === "│" ) {
            chip[x] = "├";
            chip[chip1] = "┤";
        }
        // ひとつ空けて縦線の場合
        else if( chip[x] === "│" && chip[chip1] === "×" && chip[chip2] === "│" ) {
            chip[x] = "├";
            chip[chip1] = "─";
            chip[chip2] = "┤";
        }
        // ふたつ空けて縦線の場合
        else if( chip[x] === "│" && chip[chip1] === "×" && chip[chip2] === "×" && chip[chip3] === "│" ) {
            chip[x] = "├";
            chip[chip1] = "─";
            chip[chip2] = "─";
            chip[chip3] = "┤";
        }
        // 横線が引けなくなってた場合（他に横線を引いた影響で）
        else {
            arr.splice(i, 1);
            i--;
        }
    }

    // 2 次元配列を 1 次元配列に
    for(i = 0, len = map.length; i < len; i++) {
        map[i] = map[i].join('');
    }
    return map;
};
