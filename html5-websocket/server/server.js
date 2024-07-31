//1 : socket.io를 프로젝트에 추가합니다. Server라는 생성자를 이용해 소켓 서버를 생성합니다.
const { Server } = require("socket.io");

//2
//new Server를 이용해 5000번 포르를 가진 소켓 서버를 만듭니다. 
//5000번 포트 자리에 http 서버 객체를 만들 수도 있습니다.
//http 서버를 이용하지 않기 때문에 임의 포트 번호로 대체했습니다.
const io = new Server("5000", {
  cors: {
    origin: "http://localhost:3000",
  },
});

//3
io.sockets.on("connection", (socket) => {
  //4
  socket.on("message", (data) => {
    //5
    io.sockets.emit("sMessage", data);
  });
  socket.on("login", (data) => {
    io.sockets.emit("sLogin", data);
  });

  //6
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
