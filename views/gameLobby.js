enterGame = () => {
  // submit 후 새로고침 막기
  // 이거 없으면 새로고침돼서 소켓에 도달조차 안되네
  event.preventDefault();
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
