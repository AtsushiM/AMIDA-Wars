enchant();

var test = new AW.Score();
var test1 = new AW.Score();

test.testvar = '1234';
test1.testvar = '5678';

console.log(test.user);
console.log(test1.enemy);

window.onload = function() {
	var gameEnd = false;

	var units = new Group();
	var enemys = new Group();
	var thumbs = new Group();
	var myCastles = new Group();
	var emCastles = new Group();

	var myScore = 0;
	var enemyScore = 0;

	var point = {
		'unit':100,
		'castle':1000,
		'win':2000
	};

	var ailoopID;

	var unitAry = {};
	var enemyAry = {};
	var unitNo = 0;
	var enemyNo = 0;

	var game = new Game(320, 450);
	var castle1,castle2,castle3,castle4,castle5,castle6,castle7,castle8;

	var label,myScoreLb,enemyScoreLb;

	game.preload('char.gif','thumb.gif','map.gif');
	game.onload = function() {
		var map = new Map(32,32);
		map.image = game.assets['map.gif'];
		map.loadData(mapData);

		castle1 = castleSet(configCastle1);
		castle2 = castleSet(configCastle2);
		castle3 = castleSet(configCastle3);
		castle4 = castleSet(configCastle4);
		castle5 = castleSet(configCastle5);
		castle6 = castleSet(configCastle6);
		castle7 = castleSet(configCastle7);
		castle8 = castleSet(configCastle8);

		var skelton_dog = thumbSet(configSkeltonDog.thumb);
		var skelton_warrier = thumbSet(configSkeltonWarrier.thumb);
		var skelton_archer = thumbSet(configSkeltonArcher.thumb);
		var spector = thumbSet(configSpector.thumb);
		var skelton_snake = thumbSet(configSkeltonSnake.thumb);
		var golem = thumbSet(configGolem.thumb);
		var shade = thumbSet(configShade.thumb);
		var undead_spider = thumbSet(configUndeadSpider.thumb);

		game.rootScene.addChild(map);
		game.rootScene.addChild(myCastles);
		game.rootScene.addChild(enemys);
		game.rootScene.addChild(units);
		game.rootScene.addChild(emCastles);
		game.rootScene.addChild(thumbs);

		thumbs.addChild(skelton_dog);
		thumbs.addChild(skelton_warrier);
		thumbs.addChild(skelton_archer);
		thumbs.addChild(spector);
		thumbs.addChild(skelton_snake);
		thumbs.addChild(golem);
		thumbs.addChild(shade);
		thumbs.addChild(undead_spider);

		emCastles.addChild(castle5);
		emCastles.addChild(castle6);
		emCastles.addChild(castle7);
		emCastles.addChild(castle8);
		myCastles.addChild(castle1);
		myCastles.addChild(castle2);
		myCastles.addChild(castle3);
		myCastles.addChild(castle4);

		game.addEventListener('enterframe',function(e){
			var u,e;
			for(var i in unitAry){
				u = unitAry[i];
				for(var j in enemyAry){
					e = enemyAry[j];
					//if(u.intersect(e) && (u.x == e.x || u.y == e.y)){
					if(u.intersect(e)){
							battle(u,e);
					}
				}
			}
		});

		ailoopID = setInterval(function(){
			if(gameStart && !gameEnd){
				enemyCreate();
			}
		},3000);
		
		label = new Label();
		label.text = 'ドット絵：Denzi日記 http://d.hatena.ne.jp/Denzi/';
		label.y = 430;
		game.rootScene.addChild(label);
		
		myScoreLb = new Label();
		myScoreLb.text = 'You:'+myScore;
		myScoreLb.x = 220;
		myScoreLb.y = 360;
		game.rootScene.addChild(myScoreLb);
		
		enemyScoreLb = new Label();
		enemyScoreLb.text = 'Enemy:'+enemyScore;
		enemyScoreLb.x = 220;
		enemyScoreLb.y = 380;
		game.rootScene.addChild(enemyScoreLb);
	}
	game.start();
	
	function battle(u,e){
		var uc=u.config,ec=e.config;
		while(uc.hp > 0 && ec.hp > 0){
			uc.hp -= ec.damage;
			ec.hp -= uc.damage;
		}
		if(uc.hp < 1){
			unitKill(u);
			//addEnemyScore(point['unit']);
		}
		if(ec.hp < 1){
			enemyKill(e);
			//addMyScore(point['unit']);
		}
	}

	function enemyAction(unit){
		unit.direction = 0;
		unit.walk=0;
		unit.twalk=0;
		unit.beforePoint = unitMapPoint(unit.x,unit.y);
		unit.sp = unit.config.speed;
		unit.addEventListener('enterframe',function(e){
			if(this.direction == 2){
				//up
				this.y -= unit.sp;
				if(unitPointChangeCheck(this)){
						this.mapDirection = mapDirectionCheck(this);
						if(this.mapDirection){
								if(this.mapDirection[1]){
										this.direction = 3;
								}
								else if(this.mapDirection[3]){
										this.direction = 1; 
								}
								else if(this.mapDirection[2]){
										this.direction = 0;
								}
								else {
										this.direction = 0;
								}
						}
				}
			}
			else if(this.direction == 1){
					//left
					this.x -= unit.sp;
					if(unitPointChangeCheck(this)){
							this.mapDirection = mapDirectionCheck(this);
							if(this.mapDirection){
									if(this.mapDirection[2]){
											this.direction = 0;
									}
									else if(this.mapDirection[2]){
											this.direction = 2; 
									}
									else if(this.mapDirection[3]){
											this.direction = 1;
									}
									else {
											this.direction = 3;
									}
							}
					}
			}
			else if(this.direction == 3){
					//right
					this.x += unit.sp;
					if(unitPointChangeCheck(this)){
							this.mapDirection = mapDirectionCheck(this);
							if(this.mapDirection){
									if(this.mapDirection[2]){
											this.direction = 0;
									}
									else if(this.mapDirection[1]){
											this.direction = 3; 
									}
									else if(this.mapDirection[3]){
											this.direction = 2;
									}
									else {
											this.direction = 1;
									}
							}
					}
			}
			else {
					//down
					this.y += unit.sp;
					if(unitPointChangeCheck(this)){
							this.mapDirection = mapDirectionCheck(this);
							if(this.mapDirection){
									if(this.mapDirection[1]){
											this.direction = 3;
									}
									else if(this.mapDirection[3]){
											this.direction = 1; 
									}
									else if(this.mapDirection[2]){
											this.direction = 0;
									}
									else {
											this.direction = 2;
									}
							}
					}
			}
			if(!(game.frame % 5)){
				this.walk++;
			}
			if(this.walk == 4){
				this.walk = 0;
			}
			this.twalk = this.walk;
			if(this.walk == 3){
				this.twalk = 1;
			}
			this.frame = this.config.frame + this.twalk * char_inline_num + this.direction;
		});
	}

	function charaAction(unit){
		unit.direction = 2;
		unit.walk=0;
		unit.twalk=0;
		unit.beforePoint = unitMapPoint(unit.x,unit.y);
		unit.sp = unit.config.speed;
		unit.addEventListener('enterframe',function(e){
			if(this.direction == 2){
				//up
				this.y -= unit.sp;
				if(unitPointChangeCheck(this)){
						this.mapDirection = mapDirectionCheck(this);
						if(this.mapDirection){
								if(this.mapDirection[1]){
										this.direction = 3;
								}
								else if(this.mapDirection[3]){
										this.direction = 1; 
								}
								else if(this.mapDirection[0]){
										this.direction = 2;
								}
								else {
										this.direction = 0;
								}
						}
				}
			}
			else if(this.direction == 1){
					//left
					this.x -= unit.sp;
					if(unitPointChangeCheck(this)){
							this.mapDirection = mapDirectionCheck(this);
							if(this.mapDirection){
									if(this.mapDirection[0]){
											this.direction = 2;
									}
									else if(this.mapDirection[2]){
											this.direction = 0; 
									}
									else if(this.mapDirection[3]){
											this.direction = 1;
									}
									else {
											this.direction = 3;
									}
							}
					}
			}
			else if(this.direction == 3){
					//right
					this.x += unit.sp;
					if(unitPointChangeCheck(this)){
							this.mapDirection = mapDirectionCheck(this);
							if(this.mapDirection){
									if(this.mapDirection[0]){
											this.direction = 2;
									}
									else if(this.mapDirection[2]){
											this.direction = 0; 
									}
									else if(this.mapDirection[1]){
											this.direction = 3;
									}
									else {
											this.direction = 1;
									}
							}
					}
			}
			else {
					//down
					this.y += unit.sp;
					if(unitPointChangeCheck(this)){
							this.mapDirection = mapDirectionCheck(this);
							if(this.mapDirection){
									if(this.mapDirection[1]){
											this.direction = 3;
									}
									else if(this.mapDirection[3]){
											this.direction = 1; 
									}
									else if(this.mapDirection[2]){
											this.direction = 0;
									}
									else {
											this.direction = 2;
									}
							}
					}
			}
			if(!(game.frame % 5)){
				this.walk++;
			}
			if(this.walk == 4){
				this.walk = 0;
			}
			this.twalk = this.walk;
			if(this.walk == 3){
				this.twalk = 1;
			}
			this.frame = this.config.frame + this.twalk * char_inline_num + this.direction;
		});
	}

	function unitMapPoint(x,y){
		x = Math.floor(x/32);
		y = Math.floor(y/32);
		return [x,y];
	}

	function unitPointChangeCheck(unit){
		var u = unit;
		if(!(Math.floor(u.x-8)%32) && !(Math.floor(u.y-2)%32)){
				var n = unitMapPoint(u.x,u.y);
				u = u.beforePoint;
				if(u[0] == n[0] && u[1] == n[1]){
						return false;
				}
				else {
						unit.beforePoint = n;
						return true;
				}
		}
		return false;
	}

	function mapDirectionCheck(u){
		var up = unitMapPoint(u.x,u.y);
		var mc = mapCollision;
		if((mc = mc[up[1]]) && (mc = mc[up[0]])){
			if(mc[0] == 0 && mc[1] == 0 && mc[2] == 1 && mc[3] == 0){
				hitEmCastles(u);
				addMyScore(point['castle']);
				brakeCastle(u.hitCastle,u.config.damage);
				unitKill(u);
				return false;
			} 
			else if(mc[0] == 1 && mc[1] == 0 && mc[2] == 0 && mc[3] == 0){
				hitMyCastles(u);
				addEnemyScore(point['castle']);
				brakeCastle(u.hitCastle,u.config.damage);
				enemyKill(u);
				return false;
			}
			return mc;
		}
		return false;
	}

	function unitKill(u){
		//enemyScore += point['unit'];
		var thumb = u.config.thumb;
		delete unitAry[u.no];
		units.removeChild(u);
		setTimeout(function(){
			thumb.opacity = 1;	
		},u.config.wait);
	}
	function enemyKill(u){
		//myScore += point['unit'];
		delete enemyAry[u.no];
		enemys.removeChild(u);
	}

	function castleSet(config){
		config.w = 32;
		config.h = 32;
		config.image = game.assets['map.gif'];
		var c = spriteSet(config);
		return c;
	}

	function thumbSet(config){
		config.w = 32;
		config.h = 32;
		config.image = game.assets['thumb.gif'];
		var t = spriteSet(config);
		thumbDrag(t);
		return t;
	}

	function unitSet(config){
		config.em = false;
		var u = charaSet(config);
		unitAry[unitNo] = u;
		u.no = unitNo;
		unitNo++;
		return u;
	}
	function enemySet(config){
		config.em = true;
		var u = charaSet(config);
		enemyAry[enemyNo] = u;
		u.no = enemyNo;
		enemyNo++;
		return u;
	}

	function charaSet(config){
		config.w = 16;
		config.h = 16;
		config.image = game.assets['char.gif'];
		return spriteSet(config);
	}

	function spriteSet(config){
		var t = new Sprite(config.w,config.h);
		t.image = config.image;
		t.frame = config.frame;
		t.x = config.x;
		t.y = config.y;
		t.opacity = config.opacity;
		t.config = config;
		return t;
	}

	function thumbDrag(thumb){
		var originX,originY,defaultX = thumb.x,defaultY = thumb.y;
		thumb.addEventListener(enchant.Event.TOUCH_START, function(e){
			if(this.opacity == 1){
				originX = e.x - this.x;
				originY = e.y - this.y;
			}
		});
		thumb.addEventListener(enchant.Event.TOUCH_MOVE, function(e){
			if(this.opacity == 1){
				this.x = e.x - originX;
				this.y = e.y - originY;
			}
		});
		thumb.addEventListener(enchant.Event.TOUCH_END, function(e){
			if(hitMyCastles(this)){
				var unit = unitSet({
					x:this.hitCastle.config.unitX,
					y:this.hitCastle.config.unitY,
					frame:char_map[this.config.chara_frame],
					opacity:1,
					damage:this.config.unit.damage,
					hp:this.config.unit.hp,
					armor:this.config.unit.armor,
					speed:this.config.unit.speed,
					wait:this.config.unit.wait,
					type:this.config.unit.type,
					thumb:this
				});
				charaAction(unit);
				unitAdd(unit);
				//enemyCreate();
			}

			this.x = defaultX;
			this.y = defaultY;
			this.opacity = 0.5;
		});
	}

	function brakeCastle(castle,damage){
		castle.config.hp -= damage;
		if(castle.config.hp < 1){
				castle.config.hp = 0;
				castle.opacity = 0;
		}
		else if(castle.config.mhp / 2 >= castle.config.hp ){
				castle.frame = castle.config.brake;
		}
		checkGameEnd();
	}

	function checkGameEnd(){
		var win = 0;
		if(!castle1.config.hp){
			win++;
		}
		if(!castle2.config.hp){
			win++;
		}
		if(!castle3.config.hp){
			win++;
		}
		if(!castle4.config.hp){
			win++;
		}

		if(win > 3){
			win = true;
		}
		else {
			win = false;
		}

		var lose = 0;
		if(!castle5.config.hp){
			lose++;
		}
		if(!castle6.config.hp){
			lose++;
		}
		if(!castle7.config.hp){
			lose++;
		}
		if(!castle8.config.hp){
			lose++;
		}

		if(lose > 3){
			lose = true;
		}
		else {
			lose = false;
		}

		//var score = myScore - enemyScore;
		var score = myScore;
		/*if(score < 0) {
			score = 0;
		}*/
		if(win && lose){
			gameEnd = true;
			game.end(score, 'DRAW! Your score is '+score);
			alert('DRAW! SCORE:'+score);
		}
		else {
			if(win){
				gameEnd = true;
				game.end(score, 'WIN! Your score is '+score);
				alert('WIN! SCORE:'+score);
			}
			else if(lose){
				gameEnd = true;
				game.end(score, 'LOSE... Your score is '+score);
				alert('LOSE... SCORE:'+score);
			}
		}

	}
	
	function hitEmCastles(obj){
		obj.hitCastle = null;
		if(obj.intersect(castle1)){
			obj.hitCastle = castle1;
		}
		else if(obj.intersect(castle2)){
			obj.hitCastle = castle2;
		}
		else if(obj.intersect(castle3)){
			obj.hitCastle = castle3;
		}
		else if(obj.intersect(castle4)){
			obj.hitCastle = castle4;
		}

		if(obj.hitCastle){
			return true;
		}
		return false;
	}

	function hitMyCastles(obj){
		obj.hitCastle = null;
		if(obj.intersect(castle8)){
			obj.hitCastle = castle8;
		}
		else if(obj.intersect(castle7)){
			obj.hitCastle = castle7;
		}
		else if(obj.intersect(castle6)){
			obj.hitCastle = castle6;
		}
		else if(obj.intersect(castle5)){
			obj.hitCastle = castle5;
		}

		if(obj.hitCastle){
			return true;
		}
		return false;
	}

	function enemyCreate(){	
			var r = Math.floor(Math.random()*4),u=Math.floor(Math.random()*8),c={},a = 1;
			/*
			if(r < 1){
				c = {
						x:castle1.config.unitX,
						y:castle1.config.unitY,
						frame:char_map['lancer'],
						opacity:1,
						damage:configLancer.thumb.unit.damage,
						hp:configLancer.thumb.unit.hp,
						speed:configLancer.thumb.unit.speed
				};
			}
			else if(r < 2){
				c = {
						x:castle2.config.unitX,
						y:castle2.config.unitY,
						frame:char_map['warrior'],
						opacity:1,
						damage:configWarrior.thumb.unit.damage,
						hp:configLancer.thumb.unit.hp,
						speed:configWarrior.thumb.unit.speed
				};
			}
			else if(r < 3){
				c = {
						x:castle3.config.unitX,
						y:castle3.config.unitY,
						frame:char_map['knight'],
						opacity:1,
						damage:configKnight.thumb.unit.damage,
						hp:configLancer.thumb.unit.hp,
						speed:configKnight.thumb.unit.speed
				};
			}
			else{
				c = {
						x:castle4.config.unitX,
						y:castle4.config.unitY,
						frame:char_map['archer'],
						opacity:1,
						damage:configArcher.thumb.unit.damage,
						hp:configLancer.thumb.unit.hp,
						speed:configArcher.thumb.unit.speed
				};
			}
			*/
			if(r < 1){
				r = castle1;
			}
			else if(r < 2){
				r = castle2;
			}
			else if(r < 3){
				r = castle3;
			}
			else{
				r = castle4;
			}
			r = r.config;

			if(u < 1){
				u = configLancer;
			}
			else if(u < 2){
				u = configWarrior;
			}
			else if(u < 3){
				u = configKnight;
			}
			else if(u < 4){
				u = configArcher;
			}
			else if(u < 5){
				u = configClelic;
			}
			else if(u < 6){
				u = configFireMage;
			}
			else if(u < 7){
				u = configFrostMage;
			}
			else{
				u = configWizard;
			}
			u = u.thumb;

			c = {
				x:r.unitX,
				y:r.unitY,
				frame:char_map[u.chara_frame],
				opacity:1,
				damage:u.unit.damage,
				hp:u.unit.hp,
				speed:u.unit.speed
			};

			var enemy = enemySet(c);
			enemyAction(enemy);
			enemyAdd(enemy);

	}

	function addMyScore(score){
		myScore += score;
		myScoreLb.text = 'You:'+myScore;
	}
	function addEnemyScore(score){
		enemyScore += score;
		enemyScoreLb.text = 'Enemy:'+enemyScore;
	}

	function unitAdd(obj){
		units.addChild(obj);
	}
	function enemyAdd(obj){
		enemys.addChild(obj);
	}
}
