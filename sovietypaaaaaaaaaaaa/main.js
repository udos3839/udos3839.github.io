var canvas = document.getElementById('game_canvas');
var context = canvas.getContext('2d');
var image = new Image();
image.src = 'assets/bullet.png';
const player_img = new Image();
player_img.src="assets/player.png";
const enemy_img = new Image();
enemy_img.src = "assets/enemy.png";
const music = new Audio('assets/international.mp3');
music.loop = true;

var enemies = [];
var humanElement = document.getElementById("ninzuu");
var humanrace_num = 0;
humanElement.innerHTML = humanrace_num;
var spawnInterval = 1500; // ミリ秒
var lastSpawnTime = 0;
var kankaku_speed = 7;
var player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 40,
  width: 40,
  height: 40
};

var zKeyPressed = false;
console.log("起動しますた");
function spawnEnemy() {
    var x = Math.random() * (canvas.width - image.width);
    var y = Math.random() * (canvas.height - image.height);
    enemies.push({ x: x, y: y, width: image.width, height: image.height });
    console.log("pushしたよ");
    console.log(x);
    console.log(y);
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
	    humanrace_num += 1;
	    humanElement.innerHTML = humanrace_num;
	} else {
	    // zキー押してないので死を
	    window.location.reload();
	}
    }
  }
}

function animate(){
    music.play();
    context.clearRect(0, 0, canvas.width, canvas.height);
    // 新規のenemy
    var currentTime = Date.now();
    if (currentTime - lastSpawnTime > spawnInterval) {
	spawnEnemy();
	lastSpawnTime = currentTime;
    }
    for (var i = 0; i < enemies.length; i++) {
	var enemy = enemies[i];
        context.drawImage(enemy_img, enemy.x, enemy.y);
        if (enemy.y > canvas.height) {
	    enemies.splice(i, 1);
            i--;
	}
    }
    // playerを描画                                                                                                                                                                                 
    context.drawImage(player_img,player.x, player.y);
    checkCollision();
    requestAnimationFrame(animate);
}

player_img.onload = function(){
    enemy_img.onload = function(){
	animate();
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
      window.location.reload();
  }
});
