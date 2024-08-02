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
    //12
    // 12~13
    // 13번의 clients 객체에 데이터를 저장하는 부분을 확인할 수 있다.
    // socket.io에서는 기보넞ㄱ으로 연결된 소켓의 고유 번호인 socket.id라는 값을 가지고 있다. socket.id 값은 무작위 값으로 각각의 연결될 소켓을 구분한다. 이 값을 클라이언트에서 보내온 아이디 값과 매칭해서 clients 객체에 저장한다.
    // 12번은 clients 객체에서 검색된 socket.id값을 이용해서 특정한 사용자에게 보내는 로직입니다.
    // io.socket.to()함수를 이용해 privat한 매시지를 전송할 수 있습니다. 만약 target 정보가 없다면 일반적인 broadcast를 실행합니다.
    const toUser = clients.get(target);
    target
      ? io.sockets.to(toUser).emit("sMessage", res)
      : socket.broadcast.emit("sMessage", res);
    //5
    // io.socket.emit()은 서버에서 클라이언트로 데이터를 전송힐 떄 사용합니다.
    // 한 가지 놀라운 점은 객체의 데이터를 파싱하거나 문자열로 변화하는 작업이 없다는 점입니다.
    // 위에서 살펴봤던 서버 소켓의 모듈들은 문자열만을 다루기 때문에 데이터를 파싱하는 과정을 추가했습니다. + socket.io는 문자열뿐만 아니라 객체까지 데이터로 전송할 수 있습니다.
    // io.sockets.emit("sMessage", data);
  });
  socket.on("login", (data) => {
    //13
    clients.set(data, socket.id);
    socket.broadcast.emit("sLogin", data);
  });

  //6 : disconnect 이벤트로 연결이 끊어짐을 확인합니다.
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
