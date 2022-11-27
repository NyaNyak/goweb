var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var playerSpeed = 4;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

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

var players = [];
var playerMap = {};
var myId;

function setImage(img, color, dir) {
  if (color == "red") {
    if (dir == "left") img.src = "/resource/player1_left.png";
    else img.src = "/resource/player1_right.png";
  } else {
    if (dir == "left") img.src = "/resource/player2_left.png";
    else img.src = "/resource/player2_right.png";
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

updateState = (id, x, y) => {
  let player = playerMap[id];
  if (!player) {
    return;
  }
  player.x = x;
  player.y = y;
};

var socket = io();

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
  updateState(data.id, data.x, data.y);
});

sendData = () => {
  let curPlayer = playerMap[myId];
  let data = {
    id: curPlayer.id,
    x: curPlayer.x,
    y: curPlayer.y,
  };
  if (data) socket.emit("send_location", data);
};

renderPlayer = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
  const minX = 5,
    minY = 5;
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
  sendData();
};

update = () => {
  renderPlayer();
};
//renderPlayer();
setInterval(update, 10);
