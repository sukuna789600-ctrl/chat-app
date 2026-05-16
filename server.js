
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <h2>ᴇʟᴠᴏʀɪᴀ</h2>

        <input id="name" placeholder="Your name"><br><br>
        <input id="room" placeholder="Room code"><br><br>

        <input id="msg" placeholder="Message">
        <button onclick="send()">Send</button>

        <ul id="chat"></ul>

        <script src="/socket.io/socket.io.js"></script>
        <script>
          const socket = io();
          let joined = false;

          function send() {
            const name = document.getElementById("name").value;
            const msg = document.getElementById("msg").value;
            const room = document.getElementById("room").value;

            if (!name || !msg || !room) return;

            if (!joined) {
              socket.emit("join", room);
              joined = true;
            }

            socket.emit("chat", { room, text: name + ": " + msg });
            document.getElementById("msg").value = "";
          }

          socket.on("chat", (msg) => {
            let li = document.createElement("li");
            li.innerText = msg;
            document.getElementById("chat").appendChild(li);
          });
        </script>
      </body>
    </html>
  `);
});

io.on("connection", (socket) => {
  socket.on("join", (room) => socket.join(room));

  socket.on("chat", (data) => {
    io.to(data.room).emit("chat", data.text);
  });
});

http.listen(3000, () => console.log("Private chat running"));

