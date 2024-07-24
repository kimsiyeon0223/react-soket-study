//1 : net 모듈을 추가합니다.
const net = require("net");

//2 : createServer()를 이용해 TCP 서버를 생성합니다.
const server = net.createServer((socket) => {
  //3 : "data"라는 구분자로 클라이언트에서 오는 값을 받습니다.
  socket.on("data", (data) => {
    console.log("From client:", data.toString());
  });
  //4 : "close"는 net모듈에 등록된 키워드로 클라이언트에서 소켓을 닫을 때 응답합니다.
  socket.on("close", () => {
    console.log("client disconnected");
  });
  //5 : write()를 이용해 서버에서 클라이언트로 메세지를 전달합니다.
  socket.write("welcome to server");
});

server.on("error", (err) => {
  console.log("err" + err);
});

//6 : 5000번 포트를 열고 기다립니다.
server.listen(5002, () => {
  console.log("listening on 5002");
});

// net 모듈
// net 모듈은 TCP 스트림 기반의 기동기 네트워크 통신을 제공하는 모듈입니다.
// node.js에서는 Net 모듈을 통해서 간단히 서버와 클라이언트 통신을 설계할 수 있습니다.
// Net하지만 net 모듈을 저수준의 TCP 통신을 제공하기 때문에 브라우저와 서버 통신은 지원하지 않습니다.
