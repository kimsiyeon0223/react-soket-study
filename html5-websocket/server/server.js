const { Server } = require("socket.io");

const io = new Server("5000", {
  cors: {
    origin: "http://localhost:3000",
  },
});

const clients = new Map();

io.sockets.on("connection", (socket) => {
  console.log("user connected");
  socket.on("message", (res) => {
    const { target } = res;
    if (target) {
      const toUser = clients.get(target);
      io.sockets.to(toUser).emit("sMessage", res);
      return;
    }
    // socket.rooms : 해당 접속자가 어떤 방에 속해 있는지를 나타내는 속성 (set이라는 자료구조를 상요해 룸을 관리함)
    const myRomms = Array.from(socket.rooms);
    if (myRomms.length > 1) {
      socket.broadcast.in(myRomms[1]).emit("sMessage", res);
      return;
    }
    socket.broadcast.emit("sMessage", res);
  });
  socket.on("login", (data) => {
    //join() : 접속한 사용자를 특정한 방에 배정할 수 있는 함수
    const { userId, roomNumber } = data;
    socket.join(roomNumber);
    clients.set(userId, socket.id);
    socket.broadcast.emit("sLogin", userId);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
