var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var W = canvas.width;
var H = canvas.height;
var FPS = 30;
var sound = new Audio("sounds/sounds.mp3");
var ufo = new Audio("sounds/ufo.mp3");

function getRandom() {
  return Math.floor(Math.random() * 12 + 8);
}

function Player() {
  this.x = W / 2;
  this.y = 500;
  this.w = 128;
  this.h = 128;
  this.dx = 0;
  this.dy = 0;
  this.speed = getRandom();

  this.update = () => {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x + this.w / 2 > W) {
      this.x = W - this.w / 2;
    } else if (this.x - this.w / 2 < 0) {
      this.x = this.w / 2;
    } else if (this.y + this.h / 2 > H) {
      this.y = H - this.h / 2;
    } else if (this.y - this.h / 2 < 0) {
      this.y = this.h / 2;
    }
  };

  this.image = new Image(this.w, this.h);
  this.image.src = "img/shark.svg";

  this.draw = () =>
    ctx.drawImage(
      this.image,
      this.x - this.w / 2,
      this.y - this.h / 2,
      this.w,
      this.h
    );
}

function Enemy() {
  this.x = W / 2;
  this.y = 70;
  this.w = 128;
  this.h = 128;
  this.dx = 5;
  this.speed = 10;

  this.update = () => {
    this.x += this.dx;

    if (this.x + this.w / 2 > W) {
      this.dx = -this.speed;
    } else if (this.x - this.w / 2 < 0) {
      this.dx = this.speed;
    }
  };

  this.image = new Image(this.x, this.y);
  this.image.src = "img/ufoo.png";

  this.draw = () =>
    ctx.drawImage(
      this.image,
      this.x - this.w / 2,
      this.y - this.h / 2,
      this.w,
      this.h
    );
}

function Bullet() {
  this.x = W / 2;
  this.y = 300;
  this.w = 35;
  this.h = 15;
  this.dy = -20;

  this.image = new Image(this.x, this.y);
  this.image.src = "img/bullet2.png";

  this.update = () => {
    this.y += this.dy;
  };

  this.draw = () =>
    ctx.drawImage(
      this.image,
      this.x - this.w / 2,
      this.y - this.h / 2,
      this.w,
      this.h
    );
}

var pl = new Player();
var enemy = new Enemy();
var bullets = [];
var score = 0;
var canShoot = true;

function collisions() {
  let e = enemy;
  for (let bul of bullets) {
    // пересечение по горизонтали и по вертикали
    if (
      Math.abs(bul.x - e.x) < bul.w / 2 + e.w / 2 &&
      Math.abs(bul.y - e.y) < bul.h / 2 + e.h / 2
    ) {
      bul.dead = true;
      score += 1;
    }
  }
  bullets = bullets.filter((bul) => bul.dead != true);
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  pl.update();
  enemy.update();
  // перебирает пули
  for (let bul of bullets) {
    bul.update();
  }

  collisions();

  // рисует пули
  for (let bul of bullets) {
    bul.draw();
  }
  pl.draw();
  enemy.draw();

  let win = (document.getElementById("win").innerHTML = "Попаданий: " + score);
}

// обновление чистоты кадров
setInterval(draw, 1000 / FPS);

document.addEventListener("keydown", (event) => {
  if (event.key == "ArrowRight") {
    pl.dx = pl.speed;
  } else if (event.key == "ArrowLeft") {
    pl.dx = -pl.speed;
  } else if (event.key == "ArrowUp") {
    pl.dy = -pl.speed;
  } else if (event.key == "ArrowDown") {
    pl.dy = pl.speed;
  } else if (event.key == " ") {
    if (canShoot) {
      var bul = new Bullet();
      bul.x = pl.x;
      bul.y = pl.y;
      bullets.push(bul);
      canShoot = false;
      sound.play();
    }
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key == "ArrowRight" && pl.dx > 0) {
    pl.dx = 0;
  } else if (event.key == "ArrowLeft" && pl.dx < 0) {
    pl.dx = 0;
  } else if (event.key == "ArrowUp" && pl.dy < 0) {
    pl.dy = 0;
  } else if (event.key == "ArrowDown" && pl.dy > 0) {
    pl.dy = 0;
  } else if (event.key == " ") {
    canShoot = true;
  }
});
