import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Admin = () => {
  const [ws, setWs] = useState(null);
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    const socket = new WebSocket("wss://ws.thelifegalleryvideo.com");
    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setServerMessage(JSON.stringify(data));
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const handleClick = (id) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = {
        action: "updateId",
        clientId: id,
      };
      ws.send(JSON.stringify(message));
      console.log("Sent to server:", message);
    } else {
      console.error("WebSocket is not connected");
    }
  };

  return (
    <Wrapper>
      <h1>Admin Page</h1>
      <div>
        <button onClick={() => handleClick("4de9")}>우은빈님</button>
        <button onClick={() => handleClick("3af9")}>이애자님</button>
        <button onClick={() => handleClick("7e0e")}>임유빈님</button>
        {/* <button onClick={() => handleClick("c6b8")}>정임숙님</button> */}
      </div>
      <div>
        <h3>Server Message:</h3>
        <pre>{serverMessage}</pre>
      </div>
    </Wrapper>
  );
};

export default Admin;
