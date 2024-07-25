import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import logo from "./images/websocket";

//1
// new WebSocket()을 이용해서 웹 소켓을 객체로 초기화하고 연결하는 작업입니다.
// 웹 소켓 서버를 5003번 포트로 만들 예정입니다. 그래서 localhost:5003을 연결 주소로 입력했습니다.
// 네이티브(native) 기능이기 때문에 서버처럼 별도의 모듈을 추가하는 작업은 필요하지 않습니다.
// 주의할 점은 연결할 소켓 주소에 ws:를 붙인다는 점입니다. ws://[호스트 주소]:[포트주소]로 소켓을 연결합니다.
// + wss는 ws를 보안적으로 업그레이드한 프로토콜. 따라서 실제 웹 서비스에서는 wss사용을 추천한다.
const webSocket = new WebSocket("ws://loacalhost:5003");

function App() {
  //2 : WebChat에 필요한 상태 변수들을 정의합니다. 메세지 내용들을 배열 형태로 저장하고 리스트를 이용해서 차례로 출력합니다.
  const messagesEndRef = useRef(null);
  const [userId, setUserId] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);
  //3 : useEffect()를 이용해서 웹 소켓의 메소드를 정의합니다.
  // - onopen : 처음  소켓이 연결되면 실행됩니다.
  // - onmessage : 가장 중요한 메서드!! 서버에서 온 메세지를 받습니다.
  // - onclose : 소켓 연결이 종료되면 실행됩니다.
  useEffect(() => {
    if (!webSocket) return;
    webSocket.onopen = function () {
      console.log("open", webSocket.protocol);
    };
    //4 : 서버에서 온 메세지를 읽습니다.
    // JSON.parse() : JavaScript에서 JSON 문자열을 JavaScript 객체로 변환하는 함수
    // JSON.parse()를 사용하는 이유는 문자열 형태로 메세지가 전송되기 때문입니다.
    webSocket.onmessage = function (e) {
      const { data, id, type } = JSON.parse(e.data);
      // 받은 메세지는 msgList의 상태로 관리됩니다. 넘어온 값의 type은 두 가지로 welcome과 other입니다.
      // welcome은 최초의 진입 메세지입니다. other은 남에게서 받은 메시지를 오른쪽에 나타내기 위해 사용됩니다.
      setMsgList((prev) => [
        ...prev,
        {
          msg: type === "welcome" ? `${data} joins the chat` : data,
          type: type,
          id: id,
        },
      ]);
    };
    webSocket.onclose = function () {
      console.log("close");
    };
  }, []);
  //5 : 자동으로 스크롤을 내리도록 합니다. scrollInvoView()를 이용해서 손쉽게 구현했습니다.
  useEffect(() => {
    scrollToBottom();
  }, [msgList]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  //6 : 로그인할때 아이디를 입력한 후 Login 버튼을 누르면 실행됩니다.
  // 웹 소켓의 send() 메소드는 서버로 메시지를 전송할 때 사용됩니다. 데이터는 문자열로 관리리되기 때문에 JSON.stringify()로 변환한 후 전송했습니다.
  const onSubmitHandler = (e) => {
    e.preventDefault();
    const sendData = {
      type: "id",
      data: userId,
    };
    webSocket.send(JSON.stringify(sendData));
    setIsLogin(true);
  };

  // 7 : 아이디 입력을 관리하는 함수입니다.
  const onChangeUserIdHandler = (e) => {
    setUserId(e.target.value);
  };

  //8 : send 버튼을 클릭하면 실행됩니다.
  // 내가 보낸 메시지가 다른 사람들에게 모두 전송되기 위해서 send() 메소드로 내용을 전송했습니다. setMsgList()로 현재 입력된 메시지를 바로 화면에 출력했습니다.
  const onSendSubmitHandler = (e) => {
    e.preventDefault();
    const sendData = {
      type: "msg",
      data: msg,
      id: userId,
    };
    webSocket.send(JSON.stringify(sendData));
    setMsgList((prev) => [...prev, { msg: msg, type: "me", id: userId }]);
    setMsg("");
  };

  //9 : 메시지를 입력할 때 실행됩니다.
  const onChangeMsgHandler = (e) => {
    setMsg(e.target.value);
  };
  return (
    <div className="app-container">
      <div className="wrap">
        {isLogin ? (
          // 10 : isLogin이라는 값으로 로그인 화면인지 채팅 화면인지 구분합니다.
          <div className="chat-box">
            <h3>Login as a "{userId}"</h3>
            <ul className="chat">
              {msgList.map((v, i) => {
                v.type === "welcome" ? (
                  <li className="welcome">
                    <div className="line" />
                    <div>{v.msg}</div>
                    <div className="line" />
                  </li>
                ) : (
                  <li className={v.type} key={`${i}_li`}>
                    <div className="userId">{v.id}</div>
                    <div className={v.msg}>{v.msg}</div>
                  </li>
                );
              })}
              <li ref={messagesEndRef} />
            </ul>
            <form className="send-form" onSubmit={onSendSubmitHandler}>
              <input
                placeholder="Enter your message"
                onChange={onChangeMsgHandler}
                value={msg}
              />
              <button type="submit">send</button>
            </form>
          </div>
        ) : (
          //11
          <div className="login-box">
            <div className="login-title">
              <img src={logo} width="40px" height="40px" alt="logo" />
              <div>WebChat</div>
            </div>
            <form className="login-form" onSubmit={onSubmitHandler}>
              <input
                placeholder="Enter your ID"
                onChange={onChangeUserIdHandler}
                value={userId}
              />
              <button type="submit">Login</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
