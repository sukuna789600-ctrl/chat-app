
const express = require("express");
const app = express();
app.use(express.static("public"));
const http = require("http").createServer(app);
const io = require("socket.io")(http);


io.on("connection", (socket) => {
  socket.on("join", (room) => socket.join(room));

  socket.on("chat", (data) => {
    io.to(data.room).emit("chat", data.text);
  });
});

http.listen(3000, () => console.log("Private chat running"));

