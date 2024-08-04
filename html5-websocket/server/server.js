//1 : socket.io를 프로젝트에 추가합니다. Server라는 생성자를 이용해 소켓 서버를 생성합니다.
const { Server } = require("socket.io");

//2
//new Server를 이용해 5000번 포르를 가진 소켓 서버를 만듭니다.
//5000번 포트 자리에 http 서버 객체를 만들 수도 있습니다.
//http 서버를 이용하지 않기 때문에 임의 포트 번호로 대체했습니다.
//cors 설절을 통해 우리가 만든 소켓 서버에 허락된 브라우저(localhost:3000)에만 접근하도록 했습니다.
const io = new Server("5000", {
  cors: {
    origin: "http://localhost:3000",
  },
});

//11
// 잡속한 사용자 아이디를 저장하기 위한 Map 객체를 생성했습니다.
// clinets 객체는 누구에게 메시지를 보낼지 검색하는 임시 사용자 데이터베이스라고 생각하면 됩니다.
const clients = new Map();

//3 : io.socket.on()의 conntection 이벤트를 이용해 연결된 부분을 확인합니다.
io.sockets.on("connection", (socket) => {
  console.log("user connected");
  //4
  // socket.on()를 이용해 커스텀 구분자인 "message"로 클라이언트에서 오는 메시지를 받습니다.
  // "message"라는 이벤트 아래에 "login"이라는 이벤트를 추가로 생성했습니다.
  socket.on("message", (res) => {
    const { target } = res;
    if (target) {
      const toUser = clients.get(target);
      io.sockets.to(toUser).emit("sMessage", res);
      return;
    }
    //21
    const myRomms = Array.from(socket.rooms);
    if (myRomms.length > 1) {
      socket.broadcast.in(myRomms[1]).emit("sMessage", res);
      return;
    }
    socket.broadcast.emit("sMessage", res);
  });
  socket.on("login", (data) => {
    //22
    const { userId, roomNumber } = data;
    socket.join(roomNumber);
    clients.set(userId, socket.id);
    socket.broadcast.emit("sLogin", userId);
  });

  //6 : disconnect 이벤트로 연결이 끊어짐을 확인합니다.
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
