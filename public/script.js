const socket = io();

let joined = false;

function send() {
  const name = document.getElementById("name").value;
  const room = document.getElementById("room").value;
  const msg = document.getElementById("msg").value;

  if (!name || !room || !msg) return;

  if (!joined) {
    socket.emit("join", room);
    joined = true;
  }

  socket.emit("chat", {
    room,
    text: name + ": " + msg
  });

  document.getElementById("msg").value = "";
}

socket.on("chat", (msg) => {
  const div = document.createElement("div");
  div.className = "message";
  div.innerText = msg;

  document.getElementById("chat").appendChild(div);

  document.getElementById("chat").scrollTop =
  document.getElementById("chat").scrollHeight;
});
