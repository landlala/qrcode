import React, { useEffect, useState } from "react";
import { createGlobalStyle, styled } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const Back = styled.div`
  background-color: black;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1.5fr;
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
`;

const VideoZone = styled.div`
  background-color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow: hidden;
`;

const Video = styled.video`
  width: 70%;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  aspect-ratio: 5 / 7;
`;

const Info = styled.div`
  color: white;
`;

function LaptopApp() {
  const [movie, setMovie] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [info, setInfo] = useState("");

  useEffect(() => {
    const ws = new WebSocket("wss://ws.thelifegalleryvideo.com");
    // const ws = new WebSocket("ws://54.83.200.150:8080");
    ws.onopen = () => console.log("Connected to WebSocket server");
    ws.onclose = () => console.log("Disconnected from WebSocket server");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.action === "sync") {
        console.log("현재 상태:", data);
        const { clientId, videoId } = data.currentSelection;
        if (clientId && videoId) {
          const videoPath = `/videos/${clientId}/video${videoId}.mp4`;
          setMovie(videoPath);
          setInfo(`client: ${clientId}, video: ${videoId}`);
        }
      }
    };

    return () => {
      if (ws) ws.close();
    };
  }, []);

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <Back />
        <VideoZone>
          <Video key={movie} autoPlay muted playsInline loop>
            <source src={movie} type="video/mp4" />
          </Video>
          <Info>{info}</Info>
        </VideoZone>

        <Back />
      </Wrapper>
    </>
  );
}

export default LaptopApp;
