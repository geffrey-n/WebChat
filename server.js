// Importing the socket.io package
let socketIO = require("socket.io");

// Importing the express package
let express = require("express");
let app = express();

// Declaration of gloval variables
let host = "localhost";
let port = 5000;
let userStatusArray = [];

//Creating the server
var server = app.listen(port, host, function () {
  console.log(`Server is running on http://${host}:${port}`);
});

// Making the web socket connection
var io = socketIO(server);

// Client - server connection
io.on("connection", (socket) => {
  // Join in user defined room
  socket.on("join-room", (room) => {
    socket.join(room);
  });
  // Client connection
  socket.on("user-connect", (name, room) => {
    // Client connection without room
    if (room == "") {
      io.emit("user-name", name, "joined");
      userStatusArray.push(name);
      io.emit("online-users", userStatusArray);
      socket.on("disconnect", () => {
        socket.broadcast.emit("user-name", name, "disconnected from");
        userStatusArray = userStatusArray.filter((item) => item !== name);
        io.emit("online-users", userStatusArray);
      });
      socket.on("user-left", (name) => {
        socket.broadcast.emit("user-name", name, "left");
        userStatusArray = userStatusArray.filter((item) => item !== name);
        io.emit("online-users", userStatusArray);
      });
      socket.on("send-message", (message, name) => {
        socket.broadcast.emit("receive-message", message, name);
      });
    }
    // client connection with room
    else {
      io.emit("user-name", name, "joined");
      userStatusArray.push(name);
      io.emit("online-users", userStatusArray);
      socket.on("disconnect", () => {
        socket.broadcast.to(room).emit("user-name", name, "disconnected from");
        userStatusArray = userStatusArray.filter((item) => item !== name);
        io.emit("online-users", userStatusArray);
      });
      socket.on("user-left", (name) => {
        socket.broadcast.to(room).emit("user-name", name, "left");
        userStatusArray = userStatusArray.filter((item) => item !== name);
        io.emit("online-users", userStatusArray);
      });
      socket.on("send-message", (message, name) => {
        socket.broadcast.to(room).emit("receive-message", message, name);
      });
    }
  });
});
