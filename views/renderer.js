var onReload = false;

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
  const maxY = canvas.height - 130;

  if (rightPressed) {
    if (curPlayer.x >= maxX) {
      curPlayer.x += 0;
      curPlayer.dir = "right";
    } else {
      curPlayer.x += curPlayer.speed;
      curPlayer.dir = "right";
    }
  }
  if (leftPressed) {
    if (curPlayer.x <= minX) {
      curPlayer.x -= 0;
      curPlayer.dir = "left";
    } else {
      curPlayer.x -= curPlayer.speed;
      curPlayer.dir = "left";
    }
  }
  if (upPressed) {
    if (curPlayer.y <= minY) {
      curPlayer.y -= 0;
    } else {
      curPlayer.y -= curPlayer.speed;
    }
  }
  if (downPressed) {
    if (curPlayer.y >= maxY) {
      curPlayer.y += 0;
    } else {
      curPlayer.y += curPlayer.speed;
    }
  }
  if (spacePressed) {
    if (curPlayer.bulletNum > 0) {
      console.log(curPlayer.bulletNum);
      sendBullet();
      console.log(curPlayer.bulletNum);
      gunfire.load();
      gunfire.loop = false;
      gunfire.volume = 0.3;
      gunfire.play();
    }
    if (!curPlayer.bulletNum) {
      reloadPressed = true;
    }
    spacePressed = false;
  }
  if (reloadPressed) {
    if (!curPlayer.bulletNum) {
      if (onReload == false) {
        onReload = true;
        reload.load();
        reload.loop = false;
        reload.volume = 1;
        reload.play();
        setTimeout(function () {
          curPlayer.bulletNum = 6;
          onReload = false;
        }, 3000);
      }
    }
    reloadPressed = false;
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
  ctx.fillRect(291, 470, 100 * 3.3, 20);
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = "#01A70D";
  ctx.fillRect(291, 470, curPlayer.hp * 3.3, 20);
  ctx.closePath();

  ctx.beginPath();
  ctx.font = "15px Arial";
  ctx.fillStyle = "#EBEDEA";
  ctx.fillText(`${curPlayer.hp} / 100`, 420, 485);
  ctx.closePath();

  ctx.beginPath();
  ctx.font = "bold 15px Arial";
  ctx.fillStyle = "#E2B693";
  ctx.fillText(`ATK`, 291, 435);
  ctx.closePath();

  ctx.beginPath();
  ctx.font = "bold 15px Arial";
  ctx.fillStyle = "#EBEDEA";
  ctx.fillText(`${curPlayer.attack}`, 332, 435);
  ctx.closePath();

  ctx.beginPath();
  ctx.font = "bold 15px Arial";
  ctx.fillStyle = "#E2B693";
  ctx.fillText(`SPD`, 290, 458);
  ctx.closePath();

  ctx.beginPath();
  ctx.font = "bold 15px Arial";
  ctx.fillStyle = "#EBEDEA";
  ctx.fillText(`${curPlayer.speed}`, 332, 458);
  ctx.closePath();

  for (let i = 0; i < curPlayer.bulletNum; i++) {
    let bull = new Image();
    bull.src = "./resource/bullet.png";
    ctx.beginPath();
    ctx.drawImage(bull, 360 + i * 19, 422, 14, 36);
    ctx.closePath();
  }

  ctx.beginPath();
  ctx.fillStyle = "#C8B595";
  ctx.fillRect(490, 420, 40, 40);
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = "#C8B595";
  ctx.fillRect(535, 420, 40, 40);
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = "#C8B595";
  ctx.fillRect(580, 420, 40, 40);
  ctx.closePath();

  /*획득한 아이템
  let item = new Image();
  item.src = "./resource/speed_up.png";
  ctx.beginPath();
  ctx.drawImage(item, 590, 425, 20, 30);
  ctx.closePath();
  */
};
