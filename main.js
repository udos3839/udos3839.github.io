var canvas = document.getElementById('game_canvas');
var context = canvas.getContext('2d');
var endflag = false;
var image = new Image();
image.src = 'assets/bullet.png';
const chara = new Image();
chara.src="assets/player.png";
const lastboss = new Image();
lastboss.src="assets/lastboss.png";
const gamestart = new Image();
gamestart.src="assets/gamestart.png";
const bullet_lastboss = new Image();
bullet_lastboss.src = "assets/gun.png";
const gameclear = new Image();
gameclear.src = "assets/gameclear.png";
const roudousha = new Image();
roudousha.src = "assets/roudousha.png"
const back_1 = new Image();
back_1.src = "assets/back-1.png";
const music = new Audio('assets/international.mp3');
music.loop = true;
const music_boss = new Audio('assets/Soviet_Anthem_Instrumental.ogg')
music_boss.loop = true;
const music_gameclear = new Audio('assets/Krasnoe-znamia.mp3')
music_gameclear.loop = true;
const music_gameover = new Audio('assets/gameover_music.mp3')
music_gameover.loop = true;
var scoreElement = document.getElementById("score");
var lifeElement = document.getElementById("life");
var lastbosshpelement = document.getElementById("lastboss_hp");
var enemies = [];
var boss_hp = 10000;
lastbosshpelement.innerHTML = boss_hp;
var shotting = [];
var gameoverflag = false;
var gameoverImage = new Image();
gameoverImage.src = 'assets/gameover.png';
const player2_imgfile = new Image();
//最初のゲームに使う                                                                                                                                                                
player2_imgfile.src = "assets/player-2.png";
const player3_imgfile = new Image();
// ラスボス戦                                                                                                                                                                                              
player3_imgfile.src = "assets/player-3.png";
const story_1_1_imgfile = new Image();
story_1_1_imgfile.src = "assets/story-1-1.png";
const story_1_2_imgfile	= new Image();
story_1_2_imgfile.src = "assets/story-1-2.png";
var spawnInterval = 1500; // ミリ秒
var lastSpawnTime = 0;
var score = 0;
var life = 5;
var kankaku_speed = 7
lifeElement.innerHTML = life;
var player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 40,
  width: 40,
  height: 40
};

var zKeyPressed = false;
var eKeyPressed = false;
console.log("起動しますた");
function sleep(waitMsec) {
  var startMsec = new Date();

  // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
  while (new Date() - startMsec < waitMsec);
}

function spawnEnemy() {
  var x = Math.random() * (canvas.width - image.width);
    enemies.push({ x: x, y: -image.height, width: image.width, height: image.height });
}

function spawnEnemy_boss() {
      var x = Math.random() * (canvas.width - image.width);
    enemies.push({ x: x, y: 150, width: image.width, height: image.height });
}

function reload(){
    window.location.reload();
}

function story_1_2_fs(){
    context.clearRect(100,400,300,100);
    context.drawImage(story_1_2_imgfile,100,400,300,100);
}

function checkCollision() {
  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
	if (zKeyPressed){
	    enemies.splice(i, 1);
	    i--;
	    context.clearRect(player.x, player.y, 50, 50);
	    context.drawImage(player2_imgfile,player.x, player.y, 50, 50);
	    score += 5;
	    if (score % 50 == 0){
		// 余りが0
		life += 1;
	    }
	    if (score % 20 == 0){
		if (kankaku_speed >= 25){
		} else {
		    kankaku_speed += 5;
		}
	    }
	    if (score % 40 == 0){
		if (spawnInterval <= 800){
		} else {
		    spawnInterval -= 250;
		}
	    }
	    scoreElement.innerHTML = score;
	    lifeElement.innerHTML = life;
	} else {
	    // 振ってきた画像がプレイヤーの座標と同じでzキーを押してないのでgame over
	    gameoverflag = true;
	}
    }
      if (enemy.y > 400) {
	  enemies.splice(i, 1);
	  i--;
	  life -= 1
	  lifeElement.innerHTML = life;
	  // life確認
	  if (life <= 0){
	      gameoverflag = true;
	  }
      }
  }
}

function animate() {
    music.play();
    context.drawImage(back_1,0, 0, canvas.width, canvas.height);
    if (gameoverflag){
	music.pause();
	music_boss.pause();
	music_gameover.play();
	context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(gameoverImage,0, 0, canvas.width, canvas.height);
        canvas.addEventListener('click', reload, false);
    } else {
    if (score >= 300){
	if (endflag){
	    music.pause();
	    music_boss.pause();
	    music_gameclear.play();
	    context.drawImage(story_1_1_imgfile,100,400,300,100);
	    canvas.addEventListener('click',story_1_2_fs, false);
	} else {
	    music.pause();
	    music_boss.play();
	    kankaku_speed = 7;
	    context.clearRect(0, 0, canvas.width, canvas.height);
	    // ボス描画
	    context.drawImage(lastboss,50,12,400,150);
	    // enemyを降らせる
	    for (var i = 0; i < enemies.length; i++) {
		var enemy = enemies[i];
		enemy.y += 1;
		context.drawImage(image, enemy.x, enemy.y);
		if (enemy.y > canvas.height) {
		    enemies.splice(i, 1);
		    i--;
		}
		if (player.x < enemy.x + enemy.width && player.x + player.width > enemy.x && player.y < enemy.y + enemy.height && player.y + player.height > enemy.y){
		    gameoverflag = true;
		}
	    }
	    // シューティング
	    for (var i = 0; i < shotting.length; i++) {
		var shot = shotting[i];
		shot.y -= 3;
		context.drawImage(bullet_lastboss, shot.x, shot.y);
		if (shot.y > canvas.height) {
		    shotting.splice(i, 1);
		    i--;
		}
		if (shot.x < 50 + 400 && shot.x + 400 > shot.x && shot.y < 12 + 150 && shot.y + 150 > 12){
		    shotting.splice(i, 1);
		    i--;
		    boss_hp -= 3
		    if (boss_hp <= 0){
			endflag = true;
		    }
		    lastbosshpelement.innerHTML = boss_hp;
		}
	    }
	    // 新規のenemy
	    var currentTime = Date.now();
	    if (currentTime - lastSpawnTime > spawnInterval) {
		spawnEnemy_boss();
		lastSpawnTime = currentTime;
	    }
	    // playerを描画
	    context.drawImage(chara,player.x, player.y);  // ★ここを変更★
	    // シューティング
	    if (zKeyPressed){
		context.clearRect(player.x, player.y, 50, 50);
		context.drawImage(player3_imgfile,player.x, player.y, 50, 50);
		shotting.push({ x: player.x, y: player.y, width: image.width, height: image.height });
	    }
	    requestAnimationFrame(animate);
	}
    } else {
	// ボス戦じゃない                                                                                                                                                                               
        context.clearRect(0, 0, canvas.width, canvas.height);
        // enemyを降らせる                                                                                                                                                                              
        for (var i = 0; i < enemies.length; i++) {
	    var enemy = enemies[i];
            enemy.y += 1;
            context.drawImage(roudousha, enemy.x, enemy.y);
            if (enemy.y > canvas.height) {
		enemies.splice(i, 1);
                i--;
            }
	}
        // 新規のenemy                                                                                                                                                                                  
        var currentTime = Date.now();
        if (currentTime - lastSpawnTime > spawnInterval) {
	    spawnEnemy();
	    lastSpawnTime = currentTime;
        }
        // playerを描画                                                                                                                                                                                 
        context.drawImage(chara,player.x, player.y);
        checkCollision();
        requestAnimationFrame(animate);
    }
  }
}


image.onload = function() {
    chara.onload = function() {
	lastboss.onload = function() {
	    gamestart.onload = function(){
		bullet_lastboss.onload = function(){
		    gameclear.onload = function(){
			back_1.onload = function(){
			    player2_imgfile.onload = function(){
				player3_imgfile.onload = function(){
				    story_1_1_imgfile.onload = function(){
					story_1_2_imgfile.onload = function(){
					    console.log("ロード完了");
					    context.drawImage(gamestart,0,0,500,500);
					    canvas.addEventListener('click', animate, false);
					};
				    };
				};
			    };
			};
		    };
		};
	    };
	};
    };
};
  
document.addEventListener('keydown', function(event) {
  if (event.key === 'z') {
    zKeyPressed = true;
  }
});

document.addEventListener('keyup', function(event) {
  if (event.key === 'z') {
    zKeyPressed = false;
  }
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'e') {
    eKeyPressed = true;
  }
});

document.addEventListener('keyup', function(event) {
  if (event.key === 'e') {
    eKeyPressed = false;
  }
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowUp' && player.y > 0) {
    player.y -= kankaku_speed;
  } else if (event.key === 'ArrowLeft' && player.x > 0) {
    player.x -= kankaku_speed;
  } else if (event.key === 'ArrowDown' && player.y < canvas.height - player.height) {
    player.y += kankaku_speed;
  } else if (event.key === 'ArrowRight' && player.x < canvas.width - player.width) {
    player.x += kankaku_speed;
  } else if (event.key === 't'){
      alert("一時停止中");
  } else if (event.key === 'r'){
      reload();
  }
});

