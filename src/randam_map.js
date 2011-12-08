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
    i, j, x, y, r, a, chip, flg; 

    // 敵と味方の城を結びつける
    for(i = 0; i < castleNum; i++) {
        y = i * 2; // 水平方向の位置
        r = Math.floor(Math.random() * castleBeyond) + 1; // 曲がる場所
        
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
            if( chip[i] === '│' ) {
                flag = false;
                
                // 横線が引けるのは 3 パターン。適当に網羅。
                
                // 隣に縦線の場合
                if(chip[i + 1] === '│' ) { 
                    flag = true;
                }
                // ひとつ空けて縦線の場合
                else if(chip[i + 1] === '×' && chip[j][i + 2] === '│') {
                    flag = true;
                }
                // ふたつ空けて縦線の場合
                else if( i + 3 <= 7) {
                    if( chip[i + 1] === '×' && chip[i + 2] === '×' && chip[i + 3] === '│') {
                        flag = true;
                    }
                }
                
                if(flag) {
                    arr.push( { 'x': i, 'y' : j} );
                }
            }
        } 
    }

    // 横線が引ける場所をランダムに並べ替え
    for(i = 0; i < 100; i++) {
        r = Math.floor(Math.random() * (arr.length - 1) ) + 1;
        a = arr[0];
        
        arr[0] = arr[r];
        arr[r] = a;
    }

    // 横線を引く
    for(i = 0; i < arr.length - 1 && i < LINES; i++) {
        chip = arr[i];
        x = chip.x;
        y = chip.y;

        chip = map[y];
        
        // 横線が引けるのは 3 パターン。例によって網羅。
        
        // 隣に縦線の場合
        if( chip[x] === "│" && chip[x + 1] === "│" ) {
            chip[x] = "├";
            chip[x + 1] = "┤";
        }
        // ひとつ空けて縦線の場合
        else if( chip[x] === "│" && chip[x + 1] === "×" && chip[x + 2] === "│" ) {
            chip[x] = "├";
            chip[x + 1] = "─";
            chip[x + 2] = "┤";
        }
        // ふたつ空けて縦線の場合
        else if( chip[x] === "│" && chip[x + 1] === "×" && chip[x + 2] === "×" && chip[x + 3] === "│" ) {
            chip[x] = "├";
            chip[x + 1] = "─";
            chip[x + 2] = "─";
            chip[x + 3] = "┤";
        }
        // 横線が引けなくなってた場合（他に横線を引いた影響で）
        else {
            arr.splice(i, 1);
            i--;
        }
    }

    // 2 次元配列を 1 次元配列に
    for(i = 0; i < map.length; i++) {
        map[i] = map[i].join("");
    }
    return map;
};
