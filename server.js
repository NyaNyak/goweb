const fs = require("fs");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

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

server.listen(9999, () => {
  console.log("ready");
});
//app.listen(8000);

app.use(express.static("views"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/game.html");
});

const startX = 800 / 2;
const startY = 520 / 2;

class Player {
  constructor(socket) {
    this.socket = socket;
    this.x = startX;
    this.y = startY;
    this.color = "red";
  }

  get id() {
    return this.socket.id;
  }
}

var players = [];
var playerMap = {};
var isRed = true;

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

if (players.length < 2) {
}

io.on("connection", (socket) => {
  if (players.length < 2) {
    console.log(`${socket.id}님 입장`);
    socket.on("disconnect", (reason) => {
      console.log(`${socket.id}님 ${reason}때문에 퇴장`);
      endGame(socket);
      socket.broadcast.emit("leave_user", socket.id);
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

    socket.on("send_location", (data) => {
      socket.broadcast.emit("update_state", {
        id: data.id,
        x: data.x,
        y: data.y,
      });
    });
  }
});
