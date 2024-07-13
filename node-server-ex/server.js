//1 : nodejs에서는 require이라는 문법을 사용해 모듈과 라이브러리를 불러올 수 있다.
const http = require("http"); //http : 기본 모듈로 웹 서버를 만들 떄 사용
const fs = require("fs").promises; //fs : 파일을 읽을 떄 사용
const url = require("url"); //url : 요청 url을 파싱하여 간편하게 사용할 수 있도록 한다.
//실무에서는 http모듈보다는 express라는 외부 모듈을 많이 사용한다.


//2 : http.createServer() 메소드를 이용해 서버를 만든다.
const server = http.createServer(async (req, res) => {
  //3 : url.parse() 라는 메소드를 이용해 접속한 url 정보를 파싱한다.
  const pathname = url.parse(req.url).pathname;
  //node 서버가 제공하는 req 객체에는 요청에 해당하는 다양한 정보가 들어 있다. 기본적으로 http 프로토콜과 REST API를 이용한 웹 서비스를 만들기 때문에 req객체를 이용해 다양한 기능을 구현할 수 있다.
  const method = req.method;
  let data = null;

  //4 : method값을 이용해 'GET'으로 넘겨온 경우 분기문 안에 들어가도록 했다.
  if (method === "GET") {
    switch (pathname) {
      case "/":
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
        });
        data = await fs.readFile("./index.html");
        res.end(data);
        break;
      default:
        res.writeHead(400, {
          "Content-Type": "text.html; charset=utf-8",
        });
        data = await fs.readFile("./index.html");
        res.end(data);
    }
  }
}).listen(5000); //포트를 5000번으로 서버를 생성한다.

//5 : 서버에 최초로 진입할 때 실행되는 함수이다.
server.on("listening", () => {
  console.log("5000 port is running");
});

//6 : 서버에 오류가 발생했을 때 실행된다.
server.on("error", (err) => {
  console.log(err);
});
