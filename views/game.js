const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const bgm = document.getElementById("bgm");
const gunfire = new Audio("./resource/gunfire.mp3");
const damage = new Audio("./resource/damage.mp3");
const reload = new Audio("./resource/reload.mp3");

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
let spacePressed = false;
let reloadPressed = false;

let players = [];
let playerMap = {};
let myId;

let bullets = [];

function createBullet(id, key, dir, x, y, color) {
  let b = new Bullet(id, key, dir, x, y, color);
  //let c = new Bullet(id, dir, x, y, color);
  if (b.dir == "left") {
    b.setX(x - 10);
  } else if (b.dir == "right") {
    b.setX(x + 70);
  }
  /*
  if (c.dir == "left") {
    c.setX(x - 15);
  } else if (b.dir == "right") {
    c.setX(x + 75);
  }
  */
  bullets.push(b);
  //bullets.push(c);
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

joinUser = (id, x, y, hp, attack, speed, bulletNum, color) => {
  let player = new Player(id, color);
  player.x = x;
  player.y = y;
  player.hp = hp;
  player.attack = attack;
  player.speed = speed;
  player.bulletNum = bulletNum;
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

updateState = (id, x, y, hp, attack, speed, bulletNum, dir) => {
  let player = playerMap[id];
  if (!player) {
    return;
  }
  player.x = x;
  player.y = y;
  player.hp = hp;
  player.attack = attack;
  player.speed = speed;
  player.bulletNum = bulletNum;
  player.dir = dir;
};

let socket = io();

socket.on("user_id", (data) => {
  myId = data;
});
socket.on("join_user", (data) => {
  joinUser(
    data.id,
    data.x,
    data.y,
    data.hp,
    data.attack,
    data.speed,
    data.bulletNum,
    data.color
  );
});
socket.on("leave_user", (data) => {
  leaveUser(data);
});
socket.on("update_state", (data) => {
  updateState(
    data.id,
    data.x,
    data.y,
    data.hp,
    data.attack,
    data.speed,
    data.bulletNum,
    data.dir
  );
});
socket.on("update_bullet", (data) => {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id == data.id) {
      createBullet(data.id, data.key, data.dir, data.x, data.y, data.color);
      break;
    }
  }
});
socket.on("update_collider", (data) => {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id == data.id) {
      players[i].setHp(data.hp - 1);
      for (let j = 0; j < bullets.length; j++) {
        if (bullets[j].key == data.key) {
          bullets.splice(j, 1);
          break;
        }
      }
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
    attack: curPlayer.attack,
    speed: curPlayer.speed,
    bulletNum: curPlayer.bulletNum,
    dir: curPlayer.dir,
  };
  if (data) socket.emit("send_location", data);
};

sendBullet = () => {
  let curPlayer = playerMap[myId];
  curPlayer.subBulletNum(1);
  let data = {
    id: curPlayer.id,
    x: curPlayer.x,
    y: curPlayer.y,
    dir: curPlayer.dir,
    color: curPlayer.color,
  };
  if (data) socket.emit("send_bullet", data);
};

sendCollider = (bullet_key) => {
  let curPlayer = playerMap[myId];
  let data = {
    id: curPlayer.id,
    hp: curPlayer.hp,
    key: bullet_key,
  };
  if (data) socket.emit("collision_detect", data);
};

collider = () => {
  let curPlayer = playerMap[myId];
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    if (bullet.id != curPlayer.id) {
      if (
        Math.sqrt(curPlayer.getX() + 30 - bullet.getX()) ** 2 +
          (curPlayer.getY() + 30 - bullet.getY()) ** 2 <=
        bullet.getRadius() + 30
      ) {
        sendCollider(bullet.key);
        if (bullet.dir == "right") {
          curPlayer.x += 2;
        } else {
          curPlayer.x -= 2;
        }
        damage.load();
        damage.volume = 0.7;
        damage.play();
      }
    }
    break;
  }
};

renderGame = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bgm.volume = 0.2;
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
