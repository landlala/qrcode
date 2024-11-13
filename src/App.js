import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
`;

const Button = styled.button`
  width: 100px;
  height: 100px;
  background-color: lightgray;
  margin: 5px;
`;

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://172.30.1.44:4000");
    ws.onopen = () => console.log("Connected to WebSocket server");
    ws.onclose = () => console.log("Disconnected from WebSocket server");
    setSocket(ws);

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const handleClick = (number) => {
    if (socket) {
      socket.send(number);
    }
  };

  return (
    <Container>
      {[1, 2, 3, 4].map((num) => (
        <Button key={num} onClick={() => handleClick(num)}>
          {num}
        </Button>
      ))}
    </Container>
  );
}

export default App;
