const express = require("express");
const app = express();

app.use(express.static("public"));

const http = require("http").createServer(app);

const io = require("socket.io")(http);

const users = {};

io.on("connection", (socket) => {

  socket.on("join-room", (data) => {

    socket.join(data.room);

    users[socket.id] = {
      username: data.username,
      room: data.room
    };

    const roomUsers =
      Object.values(users).filter(
        user => user.room === data.room
      );

    io.to(data.room).emit(
      "online-count",
      roomUsers.length
    );

  });

  socket.on("chat-message", (data) => {

    if(
      !data.message ||
      data.message.length > 500
    ){




return;
    }

    io.to(data.room).emit(
      "chat-message",
      {
        username: data.username,
        message: data.message
      }
    );

  });

  socket.on("disconnect", () => {

    const user = users[socket.id];

    if(user){

      delete users[socket.id];

      const roomUsers =
        Object.values(users).filter(
          u => u.room === user.room
        );

      io.to(user.room).emit(
        "online-count",
        roomUsers.length
      );

    }

  });

});

http.listen(3000, () => {
  console.log("Server running on port 3000");
});
