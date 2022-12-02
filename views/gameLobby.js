const lobby = document.getElementById("lobbyBgm");

window.onpageshow = function (event) {
  lobby.volume = "0.3";
  lobby.loop = true;
  lobby.play();
};

enterGame = () => {
  lobby.pause();
  let nickname = document.getElementById("inputName").value;
  let room = document.getElementById("inputRoom").value;

  // 둘다 입력되지 않으면 빠꾸
  if (!(nickname && room)) return;

  let socket = io();

  let data = {
    name: nickname,
    room: room,
  };
  console.log(data);
  if (data) socket.emit("enterGame", data);

  socket.on("hi", (data) => {
    console.log(data.hi);
  });
};
