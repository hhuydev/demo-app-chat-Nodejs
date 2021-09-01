const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage, generateLocationMessage } = require("./utils/message");
const {
  addUser,
  removeUser,
  getUser,
  getUserInRoom,
} = require("./utils/users");

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
/**Tạo Webserver */
const server = http.createServer(app);
/**Config socket */
const io = socketio(server);
/**Su dung middleware den config thu muc public */
app.use(express.static(publicDirectoryPath));

let count = 0;

/**Dung cho ket noi */
io.on("connection", (socket) => {
  console.log("Websocket is running!");

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) return callback(error);
    /**socket ket noi room */
    socket.join(user.room);
    /**Gửi cho tat ca client*/
    socket.emit("message", generateMessage("Admin", "Welcome!"));
    /**Gửi cho tất cả client trừ người gửi sẽ k thấy dc trong room*/
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage("Admin", `${user.username} has joined!`)
      );
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });
    callback();
  });

  socket.on("sendMessage", (text, callback) => {
    const user = getUser(socket.id);
    const filter = new Filter();
    if (filter.isProfane(text)) return callback("Profane is not allowed!");
    /**Gửi cho tất cả client & người gửi trong room*/
    io.to(user.room).emit("message", generateMessage(user.username, text));
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUserInRoom(user.room),
      });
      io.to(user.room).emit(
        "message",
        generateMessage("Admin", `${user.username} has left!`)
      );
    }
  });
  socket.on("sendLocation", ({ latitude, longtitude } = {}, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(
        user.username,
        `https://www.google.com/maps?q=${latitude},${longtitude}`
      )
    );
    callback("Location shared!");
  });
});

server.listen(port, () => {
  console.log("Server is running on port " + port);
});
