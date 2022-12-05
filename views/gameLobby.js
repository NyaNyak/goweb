const lobby = document.getElementById("lobbyBgm");

window.onpageshow = function (event) {
  lobby.volume = "0.3";
  lobby.loop = true;
  lobby.play();
};

function handleOnInput(Yee) {
  Yee.value = Yee.value.replace(/[^a-zA-Z0-9]/gi, "");
}
