const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const myAudio = document.getElementById("bgm");
const effect = new Audio("./resource/gunfire.mp3");

let playerSpeed = 2;

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
let spacePressed = false;

let players = [];
let playerMap = {};
let myId;

let bullets = [];

function Player(id, color) {
  this.id = id;
  this.x = 800 / 2;
  this.y = 520 / 2;
  this.img = new Image();
  this.dir = "right";
  if (color == "blue") {
    this.dir = "left";
  }
  setImage(this.img, color, this.dir);
  //setImage(this.color);
}

class Bullet {
  constructor(dir, x, y) {
    this.x = x;
    this.y = y + 32;
    this.dir = dir;
    this.radius = 4;
    bullets.push(this);
  }
  bulletUpdate(dir) {
    if (dir == "left") {
      this.x -= 3.5;
    } else {
      this.x += 3.5;
    }
  }
  getX() {
    return this.x;
  }
  setX(x) {
    this.x = x;
  }
  getY() {
    return this.y;
  }
  setY(y) {
    this.y = y;
  }
  getDir() {
    return this.dir;
  }
  setDir(dir) {
    this.dir = dir;
  }
  getRadius() {
    return this.radius;
  }
  setRadius() {
    this.radius = radius;
  }
}

function setImage(img, color, dir) {
  if (color == "red") {
    if (dir == "left") img.src = "/resource/player1_left.png";
    else img.src = "/resource/player1_right.png";
  } else {
    if (dir == "left") img.src = "/resource/player2_left.png";
    else img.src = "/resource/player2_right.png";
  }
}

function createBullet(dir, x, y) {
  let b = new Bullet(dir, x, y);
  if (b.dir == "left") {
    b.setX(x);
  } else if (b.dir == "right") {
    b.setX(x + 60);
  }
}

keyDownHandler = (e) => {
  if (e.code == "ArrowRight") {
    rightPressed = true;
  }
  if (e.code == "ArrowLeft") {
    leftPressed = true;
  }
  if (e.code == "ArrowDown") {
    downPressed = true;
  }
  if (e.code == "ArrowUp") {
    upPressed = true;
  }
  if (e.keyCode == 32) {
    spacePressed = false;
  }
};

keyUpHandler = (e) => {
  if (e.code == "ArrowRight") {
    rightPressed = false;
  }
  if (e.code == "ArrowLeft") {
    leftPressed = false;
  }
  if (e.code == "ArrowDown") {
    downPressed = false;
  }
  if (e.code == "ArrowUp") {
    upPressed = false;
  }
  if (e.keyCode == 32) {
    spacePressed = true;
  }
};

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

joinUser = (id, x, y, color) => {
  let player = new Player(id, color);
  player.x = x;
  player.y = y;
  player.color = color;

  players.push(player);
  playerMap[id] = player;

  return player;
};

leaveUser = (id) => {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id == id) {
      players.splice(i, 1);
      break;
    }
  }
  delete playerMap[id];
};

updateState = (id, x, y, dir) => {
  let player = playerMap[id];
  if (!player) {
    return;
  }
  player.x = x;
  player.y = y;
  player.dir = dir;
};

let socket = io();

socket.on("user_id", (data) => {
  myId = data;
});
socket.on("join_user", (data) => {
  joinUser(data.id, data.x, data.y, data.color);
});
socket.on("leave_user", (data) => {
  leaveUser(data);
});
socket.on("update_state", (data) => {
  updateState(data.id, data.x, data.y, data.dir);
});
socket.on("update_bullet", (data) => {
  createBullet(data.dir, data.x, data.y);
});

sendData = () => {
  let curPlayer = playerMap[myId];
  let data = {
    id: curPlayer.id,
    x: curPlayer.x,
    y: curPlayer.y,
    dir: curPlayer.dir,
  };
  if (data) socket.emit("send_location", data);
};

sendBullet = () => {
  let curPlayer = playerMap[myId];
  let data = {
    x: curPlayer.x,
    y: curPlayer.y,
    dir: curPlayer.dir,
  };
  if (data) socket.emit("send_bullet", data);
};

renderPlayer = () => {
  for (let i = 0; i < players.length; i++) {
    let player = players[i];
    setImage(player.img, player.color, player.dir);

    ctx.drawImage(player.img, player.x, player.y, 60, 60);

    ctx.beginPath();
    ctx.font = "15px Arial";
    ctx.fillText(`player ${player.color}`, player.x, player.y + 80);
    ctx.closePath();
  }

  let curPlayer = playerMap[myId];
  const minX = 5;
  const minY = 5;
  const maxX = canvas.width - 60;
  const maxY = canvas.height - 85;

  if (rightPressed) {
    if (curPlayer.x >= maxX) {
      curPlayer.x += 0;
      curPlayer.dir = "right";
    } else {
      curPlayer.x += playerSpeed;
      curPlayer.dir = "right";
    }
  }
  if (leftPressed) {
    if (curPlayer.x <= minX) {
      curPlayer.x -= 0;
      curPlayer.dir = "left";
    } else {
      curPlayer.x -= playerSpeed;
      curPlayer.dir = "left";
    }
  }
  if (upPressed) {
    if (curPlayer.y <= minY) {
      curPlayer.y -= 0;
    } else {
      curPlayer.y -= playerSpeed;
    }
  }
  if (downPressed) {
    if (curPlayer.y >= maxY) {
      curPlayer.y += 0;
    } else {
      curPlayer.y += playerSpeed;
    }
  }
  if (spacePressed) {
    sendBullet();
    effect.load();
    effect.loop = false;
    effect.play();
    spacePressed = false;
  }
};

renderBullet = () => {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(bullet.x, bullet.y, bullet.getRadius(), 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

    bullet.bulletUpdate(bullet.dir);
    if (bullet.getX() < 0 || bullet.getX() > 800) {
      bullets.splice(i, 1);
    }
  }
};

renderGame = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  myAudio.play();

  renderPlayer();
  renderBullet();

  sendData();
};

update = () => {
  renderGame();
};
//renderPlayer();
setInterval(update, 10);
