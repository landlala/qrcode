import React, { useEffect, useMemo, useState } from "react";
import { styled, createGlobalStyle } from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "MarcellusSC-Regular";
    src: url("/assets/MarcellusSC-Regular.ttf") format("truetype");
    font-weight: normal;
    font-style: normal;
  }
  body, html {
    font-family: "MarcellusSC-Regular", sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const Back = styled.div`
  background-color: black;
  height: 100vh;
`;

const Nav = styled.div`
  position: sticky;
  background-color: black;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    height: 4vh;
  }
  p {
    color: white;
    font-size: 4vh;
  }
`;

const Contents = styled.div`
  height: 80%;
  display: grid;
  grid-template-rows: 3fr 5fr;
  background-color: gray;
`;

const ProfileZone = styled.div`
  background-color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Profile = styled.img`
  width: 105px;
  height: 105px;
  border-radius: 50%;
  background-color: white;
  object-fit: cover;
  border: none;
`;

const ClientName = styled.span`
  margin-top: 30px;
  color: white;
  font-weight: 600;
  font-size: 5vw;
`;

const OtherZone = styled.div`
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PhotoGrid = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1000px;
  min-height: 200px;
`;

const PhotoBox = styled.div`
  width: 40%;
  aspect-ratio: 16 / 9;
  min-width: 150px;
  min-height: 70px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding-bottom: 20px;
  opacity: ${(props) => (props.isActive ? 1 : 0.3)};
  img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 2vh;
  }
`;

function App() {
  const [clientId, setClientId] = useState(null);
  const [imageCount, setImageCount] = useState(0);
  const [numbers, setNumbers] = useState([]);
  const [visible, setVisible] = useState(1);
  const [back, setBack] = useState(false);
  const [clickedBox, setClickedBox] = useState(1);
  const clientName = useMemo(() => {
    if (clientId === "c6b8") return "정임숙";
    if (clientId === "4de9") return "우은빈";
    if (clientId === "7e0e") return "임유빈";
    if (clientId === "3af9") return "이애자";
  }, [clientId]);

  useEffect(() => {
    const ws = new WebSocket("wss://ws.thelifegalleryvideo.com");
    // const ws = new WebSocket("ws://54.83.200.150:8080");
    ws.onopen = () => console.log("서버에 연결됨");
    ws.onclose = () => console.log("서버와의 연결 종료");
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.action === "sync") {
        setClientId(message.currentSelection.clientId);
        setNumbers(message.ids);
        if (message.currentSelection.clientId === "4de9") {
          setImageCount(7);
        } else {
          setImageCount(1);
        }
      }
    };

    return () => {
      if (ws) ws.close();
    };
  }, []);

  // changing video
  const handleButtonClick = (number) => {
    setClickedBox(number);
    if (clientId !== null) {
      const ws = new WebSocket("wss://ws.thelifegalleryvideo.com");
      // const ws = new WebSocket("ws://54.83.200.150:8080");
      ws.onopen = () => {
        ws.send(
          JSON.stringify({ action: "update", clientId, videoId: number })
        );
      };
    }
  };

  return (
    <>
      <GlobalStyle />
      <Back>
        <Nav>
          <p>The Life Gallery</p>
        </Nav>
        <Contents>
          <ProfileZone>
            <Profile
              // src={`https://thelifegalleryvideo.com/image/${clientId}/profile.jpg`}
              src={`/image/${clientId}/profile.jpg`}
            />
            <ClientName>{clientName}</ClientName>
          </ProfileZone>
          <OtherZone>
            <PhotoGrid>
              {Array.from({ length: imageCount }, (_, i) => i + 1).map(
                (number) => (
                  <PhotoBox
                    key={number}
                    onClick={() => handleButtonClick(number)}
                    isActive={clickedBox === number}
                  >
                    <img
                      // src={`https://thelifegalleryvideo.com/image/${clientId}/${number}.jpg`}
                      src={`/image/${clientId}/${number}.jpg`}
                      alt={`Photo ${number}`}
                    />
                    {/* <span>{`${clientId} - ${number}`}</span> */}
                  </PhotoBox>
                )
              )}
            </PhotoGrid>
          </OtherZone>
        </Contents>
      </Back>
    </>
  );
}

export default App;
