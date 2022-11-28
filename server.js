const fs = require("fs");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const startX = 800 / 2;
const startY = 520 / 2;

let players = [];
let playerMap = {};

let bullets = [];

let isRed = true;
let isFailed = false;
let isStart = false;

/*
handler = (req, res) => {
  fs.readFile(__dirname + "/views/index.html", (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading index.html");
    }
    res.writeHead(200);
    res.end(data);
  });
};*/

const port = process.env.PORT || 9999;

server.listen(port, () => {
  console.log("ready");
});
//app.listen(8000);

app.use(express.static("views"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/game.html");
});

class Player {
  constructor(socket) {
    this.socket = socket;
    this.x = startX;
    this.y = startY;
    this.dir = "right";
    this.color = "red";
  }

  get id() {
    return this.socket.id;
  }
}

class Bullet {
  constructor(dir, x, y) {
    this.x = x;
    this.y = y + 32;
    this.dir = dir;
    this.radius = 4;
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

joinGame = (socket) => {
  let player = new Player(socket);

  if (isRed) {
    isRed = false;
  } else {
    player.color = "blue";
  }

  players.push(player);
  playerMap[socket.id] = player;

  return player;
};

endGame = (socket) => {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id == socket.id) {
      if (players[i].color == "red") {
        isRed = true;
      }
      players.splice(i, 1);
      break;
    }
  }
  delete playerMap[socket.id];
};

io.on("connection", (socket) => {
  console.log(`${socket.id}님 입장`);
  socket.on("disconnect", (reason) => {
    console.log(`${socket.id}님 ${reason}때문에 퇴장`);
    endGame(socket);
    socket.broadcast.emit("leave_user", socket.id);
    if (players.length == 0) {
      isStart = false;
      isFailed = false;
    }
  });

  let newPlayer = joinGame(socket);
  socket.emit("user_id", socket.id);

  for (let i = 0; i < players.length; i++) {
    let player = players[i];
    socket.emit("join_user", {
      id: player.id,
      x: player.x,
      y: player.y,
      color: player.color,
    });
  }

  socket.broadcast.emit("join_user", {
    id: socket.id,
    x: newPlayer.x,
    y: newPlayer.y,
    color: newPlayer.color,
  });

  if (players.length > 2 || isFailed) {
    console.log(socket.id);
    socket.emit("force_disconnect", socket.id);
    endGame(socket);
    socket.broadcast.emit("leave_user", socket.id);
    socket.disconnect(false);
    isFailed = false;
  }

  socket.on("send_location", (data) => {
    socket.broadcast.emit("update_state", {
      id: data.id,
      x: data.x,
      y: data.y,
      dir: data.dir,
    });
  });

  socket.on("send_bullet", (data) => {
    io.sockets.emit("update_bullet", {
      id: data.id,
      dir: data.dir,
      x: data.x,
      y: data.y,
    });
  });
});
