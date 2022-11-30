const lobby = document.getElementById("lobbyBgm");

window.onpageshow = function (event) {
  lobby.load();
  lobby.volume = "0.3";
  lobby.loop = true;
  lobby.play();
};

enterGame = () => {
  lobby.pause();
  let nickname = document.getElementById("inputName").value;
  console.log(nickname);
};
