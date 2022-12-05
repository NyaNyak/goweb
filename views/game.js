const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const bgm = document.getElementById("bgm");
const gunfire = new Audio("./resource/gunfire.mp3");
const damage = new Audio("./resource/damage.mp3");
const reload = new Audio("./resource/reload.mp3");
const victory = new Audio("./resource/victory.mp3");
const defeat = new Audio("./resource/defeat.mp3");

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
let spacePressed = false;
let reloadPressed = false;

let players = [];
let playerMap = {};
let myId;

let winner;

let bullets = [];
let items = [];

function createBullet(id, key, dir, damage, x, y, color, radius) {
  let b = new Bullet(id, key, dir, damage, x, y, color, radius);
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

function getRandInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createItem(type, x, y, key) {
  let item = new Item(type, x, y, key);
  items.push(item);
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

joinUser = (
  id,
  x,
  y,
  hp,
  attack,
  speed,
  inven,
  shotNum,
  bulletNum,
  color,
  name
) => {
  let player = new Player(id, color, name);
  player.x = x;
  player.y = y;
  player.hp = hp;
  player.attack = attack;
  player.speed = speed;
  player.inven = inven;
  player.shotNum = shotNum;
  player.bulletNum = bulletNum;
  player.color = color;
  player.name = name;

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

updateState = (id, x, y, hp, attack, speed, inven, shotNum, bulletNum, dir) => {
  let player = playerMap[id];
  if (!player) {
    return;
  }
  player.x = x;
  player.y = y;
  player.hp = hp;
  player.attack = attack;
  player.speed = speed;
  player.inven = inven;
  player.shotNum = shotNum;
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
    data.inven,
    data.shotNum,
    data.bulletNum,
    data.color,
    data.name
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
    data.inven,
    data.shotNum,
    data.bulletNum,
    data.dir
  );
});
socket.on("update_bullet", (data) => {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id == data.id) {
      for (let j = 0; j < players[i].shotNum; j++) {
        createBullet(
          data.id,
          data.key,
          data.dir,
          data.damage,
          data.x,
          data.y + j * 10,
          data.color,
          data.radius
        );
      }
      break;
    }
  }
});
socket.on("update_collider", (data) => {
  // 여기서 받는 data.id는 맞은 유저 id
  for (let i = 0; i < players.length; i++) {
    // 맞은 유저의 피 1 감소
    if (players[i].id != data.id) {
    } // 반대편 유저는 맞춘 총알을 렌더링에서 빼기
    for (let j = 0; j < bullets.length; j++) {
      if (bullets[j].key == data.key) {
        bullets.splice(j, 1);
        break;
      }
    }
  }
});
socket.on("makeItem", (data) => {
  console.log("item");
  createItem(data.type, data.x, data.y, data.key);
});
socket.on("update_item", (data) => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].key == data.key) {
      items.splice(i, 1);
      break;
    }
  }
});
socket.on("winner", (data) => {
  console.log("승리 " + data.winner);
  console.log("사유 " + data.reason);
  clearInterval(game);
  bgm.volume = 0;
  winner = data.winner;
  gameOver();
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
    inven: curPlayer.inven,
    shotNum: curPlayer.shotNum,
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
    damage: curPlayer.attack,
    color: curPlayer.color,
    radius: 4,
  };
  if (data) socket.emit("send_bullet", data);
};

sendCollider = (bullet_key) => {
  for (let i = 0; i < bullets.length; i++) {
    if (bullets[i].key == bullet_key) {
      bullets.splice(i, 1);
      break;
    }
  }
  let curPlayer = playerMap[myId];
  // 내가 맞았을 때, 내 아이디 전송
  let data = {
    id: curPlayer.id,
    hp: curPlayer.hp,
    key: bullet_key,
  };
  if (data) socket.emit("collision_detect", data);
  damage.load();
  damage.volume = 0.7;
  damage.play();
};

sendItemGet = (item_key) => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].key == item_key) {
      items.splice(i, 1);
      break;
    }
  }
  let data = {
    key: item_key,
  };
  if (data) socket.emit("itemGet_detect", data);
};

sendEndGame = (id) => {
  let data = {
    id: id,
  };
  if (data) socket.emit("endgame", data);
};

collider = () => {
  let curPlayer = playerMap[myId];
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    // 내가 상대가 쏜 총알에 맞았을 때
    if (bullet.id != curPlayer.id) {
      if (
        Math.sqrt(
          (curPlayer.getX() + 30 - bullet.getX()) ** 2 +
            (curPlayer.getY() + 30 - bullet.getY()) ** 2
        ) <=
        bullet.getRadius() + 30
      ) {
        curPlayer.hp = Math.max(curPlayer.hp - bullet.damage, 0);

        if (curPlayer.hp > 0) {
          sendCollider(bullet.key);
          if (bullet.dir == "right") {
            curPlayer.x += 2;
          } else {
            curPlayer.x -= 2;
          }
          break;
        } else {
          sendEndGame(curPlayer.id);
        }
      }
    }
  }
};

itemGet = () => {
  let curPlayer = playerMap[myId];
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    if (
      Math.sqrt(
        (curPlayer.getX() + 30 - item.getX()) ** 2 +
          (curPlayer.getY() + 30 - item.getY()) ** 2
      ) <= 34
    ) {
      if (curPlayer.inven.length < 3 && item.getType() != 2) {
        if (curPlayer.inven.indexOf(item.getType()) == -1) {
          curPlayer.setInven(item.getType());
          console.log(curPlayer.getInven());
        }
      }
      curPlayer.setHp(Math.min(200, curPlayer.hp + item.hp_recover));
      curPlayer.setAttack(curPlayer.attack + item.attack);
      if (curPlayer.getShotNum() < 4) {
        curPlayer.setShotNum(item.shot);
      }
      if (curPlayer.getSpeed() < 3) {
        curPlayer.setSpeed(curPlayer.speed + item.speed);
      }
      sendItemGet(item.key);
      break;
    }
  }
};

gameOver = () => {
  let curPlayer = playerMap[myId];
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.globalAlpha = 0.5;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.closePath();

  if (curPlayer.id == winner) {
    ctx.beginPath();
    ctx.font = "bold 110px Sunday";
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#e00f0f";
    ctx.fillText(`You Win!`, 155, 185);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = "bold 110px Sunday";
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#d5b052";
    ctx.fillText(`You Win!`, 150, 180);
    ctx.closePath();

    victory.volume = 0.3;
    victory.play();
  } else {
    ctx.beginPath();
    ctx.font = "bold 110px Sunday";
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#532512";
    ctx.fillText(`You Lose...`, 150, 185);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = "bold 110px Sunday";
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#6d6d6d";
    ctx.fillText(`You Lose...`, 145, 180);
    ctx.closePath();

    defeat.volume = 0.3;
    defeat.play();
  }
};

renderGame = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bgm.volume = 0.2;
  bgm.play();

  itemGet();
  collider();
  renderPlayer();
  renderItem();
  renderBullet();
  renderUI();

  sendData();
};

update = () => {
  renderGame();
};
//renderPlayer();
let game = setInterval(update, 10);

window.addEventListener("beforeunload", (event) => {
  event.preventDefault();

  clearInterval(game);
  gameOver();
});
