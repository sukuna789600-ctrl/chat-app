const socket = io();

const params = new URLSearchParams(window.location.search);

const username = params.get("username");
const room = params.get("room");

const roomName = document.getElementById("room-name");
const messages = document.getElementById("messages");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

if(roomName){
  roomName.innerText = room;
}

if(room){
  socket.emit("join-room", {
    username,
    room
  });
}

sendBtn?.addEventListener("click", sendMessage);

input?.addEventListener("keypress", (e)=>{
  if(e.key === "Enter"){
    sendMessage();
  }
});

function sendMessage(){

  const message = input.value.trim();

  if(!message) return;

  socket.emit("chat-message", {
    username,
    room,
    message
  });

  input.value = "";
}

socket.on("chat-message", (data)=>{

  const div = document.createElement("div");

  div.classList.add("message");

  if(data.username === username){
    div.classList.add("mine");
  }else{
    div.classList.add("other");
  }

  div.innerHTML = `
    <strong>${data.username}</strong><br>
    ${data.message}
  `;

  messages.appendChild(div);

  messages.scrollTop = messages.scrollHeight;
});

socket.on("old-messages", (msgs)=>{

  messages.innerHTML = "";

  msgs.forEach((data)=>{

    const div = document.createElement("div");

    div.classList.add("message");

    if(data.username === username){
      div.classList.add("mine");
    }else{
      div.classList.add("other");
    }

    div.innerHTML = `
      <strong>${data.username}</strong><br>
      ${data.message}
    `;

    messages.appendChild(div);

  });

  messages.scrollTop = messages.scrollHeight;

});
