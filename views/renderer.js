renderPlayer = () => {
  for (let i = 0; i < players.length; i++) {
    let player = players[i];
    ctx.beginPath();
    player.setImage(player.img, player.color, player.dir);
    ctx.drawImage(player.img, player.x, player.y, 60, 60);
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "#4C4C4C";
    ctx.fillRect(player.getX() - 5, player.getY() - 20, (100 / 4) * 3, 10);
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "#3DB334";
    ctx.fillRect(
      player.getX() - 5,
      player.getY() - 20,
      (player.getHp() / 4) * 3,
      10
    );
    ctx.closePath();

    ctx.beginPath();
    ctx.font = "bold 15px Arial";
    ctx.fillStyle = "#4C4C4C";
    ctx.fillText(`player ${player.color}`, player.x, player.y + 80);
    ctx.closePath();
  }

  let curPlayer = playerMap[myId];
  const minX = 5;
  const minY = 20;
  const maxX = canvas.width - 70;
  const maxY = canvas.height - 110;

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
    gunfire.load();
    gunfire.loop = false;
    gunfire.volume = 0.6;
    gunfire.play();
    spacePressed = false;
  }
};

renderBullet = () => {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    ctx.beginPath();
    ctx.fillStyle = bullet.getColor();

    ctx.arc(bullet.x, bullet.y, bullet.getRadius(), 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

    bullet.bulletUpdate(bullet.dir);
    if (bullet.getX() < 0 || bullet.getX() > 800) {
      bullets.splice(i, 1);
    }
  }
};

renderUI = () => {
  ctx.beginPath();
  ctx.fillStyle = "#533A2C";
  ctx.fillRect(160, 410, canvas.width - 320, canvas.height - 410);
  ctx.closePath();

  let curPlayer = playerMap[myId];
  let portrait = new Image();
  if (curPlayer.color == "red") {
    portrait.src = "./resource/player1_right.png";
  } else {
    portrait.src = "./resource/player2_right.png";
  }
  ctx.beginPath();
  ctx.fillStyle = "#C8B595";
  ctx.fillRect(160, 410, 110, canvas.height - 418);
  ctx.closePath();

  ctx.beginPath();
  ctx.drawImage(portrait, 160, 425, 100, 100);
  ctx.closePath();

  ctx.beginPath();
  ctx.strokeStyle = "#886950";
  ctx.lineWidth = 8;
  ctx.strokeRect(160, 414, 110, canvas.height - 418);
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = "#1A1A19";
  ctx.fillRect(305, 470, 100 * 3, 20);
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = "#01A70D";
  ctx.fillRect(305, 470, curPlayer.hp * 3, 20);
  ctx.closePath();

  ctx.beginPath();
  ctx.font = "15px Arial";
  ctx.fillStyle = "#EBEDEA";
  ctx.fillText(`${curPlayer.hp} / 100`, 420, 485);
  ctx.closePath();
};
