const net = require("net");

//1 : connect()를 사용해 5000번 포트의 서버에 접속을 시도합니다.
const socket = net.connect({ port: 5002 });
socket.on("connect", () => {
  console.log("connected to server!");
  //2 : 1초 간격으로 서버에 "Hello" 메세지를 요청합니다.
  setInterval(() => {
    socket.write("Hello. ");
  }, 1000);
});

//3 : "Data"구분자로 서버에서 오는 데이터를 수신합니다.
socket.on("data", (chunk) => {
  console.log("From Server:" + chunk);
});

//4 : 서버 연결이 끊길 때 응답합니다.
socket.on("end", () => {
  console.log("disconnected. ");
});
socket.on("error", (err) => {
  console.log(err);
});

//5 : 연결이 지연될 때 출력됩니다.
socket.on("timeout", () => {
  console.log("connection timeout. ");
});
