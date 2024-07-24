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
  //2
  const messagesEndRef = useRef(null);
  const [userId, setUserId] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);
  //3
  useEffect(() => {
    if (!webSocket) return;
    webSocket.onopen = function () {
      console.log("open", webSocket.protocol);
    };
    //4
    webSocket.onmessage = function (e) {
      const { data, id, type } = JSON.parse(e.data);
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
  //5
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    //6
    const onSubmitHandler = (e) => {
      e.preventDefault();
      const sendData = {
        type: "id",
        data: userId,
      };
      webSocket.send(JSON.stringify(sendData));
      setIsLogin(true);
    };

    //7
    const onChangeUserIdHandler = (e) => {
      setUserId(e.target.value);
    };

    //8
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

    //9
    const onChangeMsgHandler = (e) => {
      setMsg(e.target.value);
    };
    return (
      <div className="app-container">
        <div className="wrap">
          {isLogin ? (
            // 10
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
  });
}

export default App;
