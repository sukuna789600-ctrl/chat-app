const express = require("express");
const mongoose = require("mongoose");
const Message = require("./models/Message");

const app = express();

app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const http = require("http").createServer(app);

const io = require("socket.io")(http);

const users = {};

io.on("connection", (socket) => {

  socket.on("join-room", async (data) => {

    socket.join(data.room);

    users[socket.id] = {
      username: data.username,
      room: data.room
    };

    const oldMessages = await Message.find({
      room: data.room
    }).sort({ time: 1 });

    socket.emit("old-messages", oldMessages);

    const roomUsers =
      Object.values(users).filter(
        user => user.room === data.room
      );

    io.to(data.room).emit(
      "online-count",
      roomUsers.length
    );

  });

  socket.on("chat-message", async (data) => {

    if(
      !data.message ||
      data.message.length > 500
    ){
      return;
    }

    const newMessage = new Message({
      username: data.username,
      room: data.room,
      message: data.message
    });

    await newMessage.save();

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
