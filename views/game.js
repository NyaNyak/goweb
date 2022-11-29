const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const bgm = document.getElementById("bgm");
const gunfire = new Audio("./resource/gunfire.mp3");
const damage = new Audio("./resource/damage.mp3");

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

function createBullet(id, dir, x, y, color) {
  let b = new Bullet(id, dir, x, y, color);
  if (b.dir == "left") {
    b.setX(x - 10);
  } else if (b.dir == "right") {
    b.setX(x + 70);
  }
  bullets.push(b);
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

joinUser = (id, x, y, hp, color) => {
  let player = new Player(id, color);
  player.x = x;
  player.y = y;
  player.hp = hp;
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

updateState = (id, x, y, hp, dir) => {
  let player = playerMap[id];
  if (!player) {
    return;
  }
  player.x = x;
  player.y = y;
  player.hp = hp;
  player.dir = dir;
};

let socket = io();

socket.on("user_id", (data) => {
  myId = data;
});
socket.on("join_user", (data) => {
  joinUser(data.id, data.x, data.y, data.hp, data.color);
});
socket.on("leave_user", (data) => {
  leaveUser(data);
});
socket.on("update_state", (data) => {
  updateState(data.id, data.x, data.y, data.hp, data.dir);
});
socket.on("update_bullet", (data) => {
  createBullet(data.id, data.dir, data.x, data.y, data.color);
});
socket.on("update_collider", (data) => {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id == data.id) {
      players[i].setHp(data.hp - 1);
      bullets.splice(data.bullet_id, 1);
      break;
    }
  }
});

sendData = () => {
  let curPlayer = playerMap[myId];
  let data = {
    id: curPlayer.id,
    x: curPlayer.x,
    y: curPlayer.y,
    hp: curPlayer.hp,
    dir: curPlayer.dir,
  };
  if (data) socket.emit("send_location", data);
};

sendBullet = () => {
  let curPlayer = playerMap[myId];
  let data = {
    id: curPlayer.id,
    x: curPlayer.x,
    y: curPlayer.y,
    dir: curPlayer.dir,
    color: curPlayer.color,
  };
  if (data) socket.emit("send_bullet", data);
};

sendCollider = (bullet_id) => {
  let curPlayer = playerMap[myId];
  let data = {
    id: curPlayer.id,
    hp: curPlayer.hp,
    bullet_id: bullet_id,
  };
  if (data) socket.emit("collision_detect", data);
};

collider = () => {
  let curPlayer = playerMap[myId];
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    if (
      Math.sqrt(
        (curPlayer.getX() + 30 - bullets[i].getX()) ** 2 +
          (curPlayer.getY() + 30 - bullets[i].getY()) ** 2
      ) <=
      bullet.getRadius() + 30
    ) {
      if (bullet.id != curPlayer.id) {
        sendCollider(bullet.id);
        if (bullets[i].dir == "right") {
          curPlayer.x += 2;
          //curPlayer.y -= 10;
        } else {
          curPlayer.x -= 2;
          //curPlayer.y -= 10;
        }
        damage.load();
        damage.volume = 1;
        damage.play();
      }
    }
  }
};

renderGame = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bgm.volume = 0.6;
  bgm.play();

  collider();
  renderPlayer();
  renderBullet();
  renderUI();

  sendData();
};

update = () => {
  renderGame();
};
//renderPlayer();
setInterval(update, 10);
