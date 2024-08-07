import React, { useEffect, useState } from "react";
import { socketGoods } from "./socket";
import "./App.css";

const UserPage = () => {
  const [isConnect, setIsConnect] = useState(false);
  useEffect(() => {
    function onConnect() {
      setIsConnect(true);
    }
    function onDisConnect() {
      setIsConnect(false);
    }
    socketGoods.on("connect", onConnect);
    socketGoods.on("disconnect", onDisConnect);

    return () => {
      socketGoods.off("connect", onConnect);
      socketGoods.off("disconnect", onDisConnect);
    };
  }, []);

  const onConnectHandler = () => {
    socketGoods.connect();
  };

  const onDisConnectHandler = () => {
    socketGoods.disconnect();
  };
  return (
    <div className="text-wrap">
      <h1>
        UserNameSpace isConnect
        {isConnect ? (
          <em className="active">Connected!</em>
        ) : (
          <em className="deactive">Not Connected!</em>
        )}
      </h1>
      <div className="btn-box">
        <button onClick={onConnectHandler} className="active-btn">
          Connected
        </button>
        <button onClick={onDisConnectHandler} className="deactive-btn">
          Disconnected
        </button>
      </div>
    </div>
  );
};

export default UserPage;
