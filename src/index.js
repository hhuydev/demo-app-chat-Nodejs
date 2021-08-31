const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage } = require("./utils/message");

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

  /**Gửi cho 1 client*/
  socket.emit("message", generateMessage("Welcome!"));
  /**Gửi cho tất cả client trừ người gửi sẽ k thấy dc*/
  socket.broadcast.emit("message", "A new user has joined!");

  socket.on("sendMessage", (text, callback) => {
    const filter = new Filter();
    if (filter.isProfane(text)) return callback("Profane is not allowed!");
    /**Gửi cho tất cả client & người gửi*/
    io.emit("message", generateMessage(text));
    callback();
  });

  socket.on("disconnect", () => {
    // socket.broadcast.emit("message", "A user has left!");
    io.emit("message", generateMessage("A user has left!"));
  });
  socket.on("sendLocation", ({ latitude, longtitude } = {}, callback) => {
    io.emit(
      "locationMessage",
      `https://www.google.com/maps?q=${latitude},${longtitude}`
    );
    callback("Location shared!");
  });
});

server.listen(port, () => {
  console.log("Server is running on port " + port);
});
