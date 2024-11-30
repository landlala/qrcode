import React, { useEffect, useState } from "react";

function App() {
  const [clientId, setClientId] = useState(null);
  const [numbers, setNumbers] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://54.83.200.150:8080");
    ws.onopen = () => console.log("서버에 연결됨");
    ws.onclose = () => console.log("서버와의 연결 종료");
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.action === "sync") {
        setClientId(message.currentSelection.clientId);
        setNumbers(message.ids);
      }
    };

    return () => {
      if (ws) ws.close();
    };
  }, []);

  // changing video
  const handleButtonClick = (number) => {
    if (clientId !== null) {
      const ws = new WebSocket("ws://54.83.200.150:8080");
      ws.onopen = () => {
        ws.send(
          JSON.stringify({ action: "update", clientId, videoId: number })
        );
      };
    }
  };

  return (
    <div>
      <h1>클라이언트 ID: {clientId}</h1>
      <h2>받은 숫자 세트: {numbers.join(", ")}</h2>
      <div>
        {numbers.map((number) => (
          <button
            key={number}
            style={{
              width: "150px",
              height: "100px",
              fontSize: "18px",
              borderRadius: "8px",
              margin: "10px",
            }}
            onClick={() => handleButtonClick(number)}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
