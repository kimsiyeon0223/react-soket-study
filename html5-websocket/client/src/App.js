import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import logo from "./images/websocket.png";
import { io } from "socket.io-client";

// 1
const webSocket = io("http://localhost:3000");

function App() {
  // 2
  const messagesEndRef = useRef(null);
  const [userId, setUserId] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);

  //11 : 1대1 대화 상대를 지목하고 저장할 수 있는 변수가 필요합니다. 그래서 privateTarget이라는 변수를 생성해서 클릭한 아이디의 값을 저장합니다.
  const [privateTarget, setPrivateTarget] = useState("");
  // 3
  useEffect(() => {
    if (!webSocket) return;
    function sMessageCallback(msg) {
      //12 : 서버에서 받는 데이터 중 target이라는 값이 있다면 'private'라는 스타일을 적용하고, 없다면 기존에 'other'이라는 스타일을 적용합니다.
      const { data, id, target } = msg;
      setMsgList((prev) => [
        ...prev,
        {
          msg: data,
          //13 : 메시지를 보낼 때 privateTarget에 저장된 아이디 값을 함께 전송합니다.
          type: target ? "private" : "other",
          id: id,
        },
      ]);
    }
    // 4
    //어떠한 이벤트로 WebSocket 연결과 동시에 onmessage 함수를 사용해서 발생하는 문제이다.
    webSocket.on("sMessage", sMessageCallback);
    return () => {
      webSocket.off("sMessage", sMessageCallback);
    };
  }, []);

  useEffect(() => {
    if (!webSocket) return;
    function sLoginCallback(msg) {
      setMsgList((prev) => [
        ...prev,
        {
          msg: `${msg} joins the chat`,
          type: "welcome",
          id: "",
        },
      ]);
    }
    webSocket.on("sLogin", sLoginCallback);
    return () => {
      webSocket.off("sLogin", sLoginCallback);
    };
  });
  // 5
  useEffect(() => {
    scrollToBottom();
  }, [msgList]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 6
  const onSubmitHandler = (e) => {
    e.preventDefault();
    const sendData = {
      type: "id",
      data: userId,
    };
    webSocket.send(JSON.stringify(sendData));
    setIsLogin(true);
  };
  // 7
  const onChangeUserIdHandler = (e) => {
    setUserId(e.target.value);
  };
  // 8
  const onSendSubmitHandler = (e) => {
    e.preventDefault();
    //14 : 아이디를 클릭했을 때 privateTarget 변수에 아이디를 저장하는 함수입니다.
    const sendData = {
      data: msg,
      id: userId,
      target: privateTarget,
    };
    webSocket.emit("message", sendData);
    setMsgList((prev) => [...prev, { msg: msg, type: "me", id: userId }]);
    setMsg("");
  };
  // 9
  const onChangeMsgHandler = (e) => {
    setMsg(e.target.value);
  };

  //15
  const onSetPrivateTarget = (e) => {
    const { id } = e.target.dataset;
    setPrivateTarget((prev) => (prev === id ? "" : id));
  };
  return (
    <div className="app-container">
      <div className="wrap">
        {isLogin ? (
          // 10
          <div className="chat-box">
            <h3>Login as a "{userId}"</h3>
            <ul className="chat">
              {msgList.map((v, i) =>
                v.type === "welcome" ? (
                  <li className="welcome">
                    <div className="line" />
                    <div>{v.msg}</div>
                    <div className="line" />
                  </li>
                ) : (
                  <li
                    className={v.type}
                    key={`${i}_li`}
                    name={v.id}
                    data-i={v.id}
                    onClick={onSetPrivateTarget}
                  >
                    <div
                      className={
                        v.id === privateTarget ? "private-user" : "userId"
                      }
                      data-id={v.id}
                      name={v.id}
                    >
                      {v.id}
                    </div>
                    <div className={v.type} data-id={v.id} name={v.id}>
                      {v.msg}
                    </div>
                  </li>
                ),
              )}
              <li ref={messagesEndRef} />
            </ul>
            <form className="send-form" onSubmit={onSendSubmitHandler}>
              {privateTarget && (
                <div className="private-target">{privateTarget}</div>
              )}
              <input
                placeholder="Enter your message"
                onChange={onChangeMsgHandler}
                value={msg}
              />
              <button type="submit">send</button>
            </form>
          </div>
        ) : (
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
