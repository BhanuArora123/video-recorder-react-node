import { useState } from 'react';
import './App.css';

function App() {
  // const [stream , setStream] = useState();
  const data = [];
  let stream;
  navigator.mediaDevices.getUserMedia({
    audio : true,
    video : true
  })
  .then((mediaStream) => {
    // setStream(stream);
    let videoEle = document.getElementById("vid");
    videoEle.srcObject = mediaStream;
    stream = mediaStream;
  })
  let videoRecording;
  const startRecording = () => {
    videoRecording = new MediaRecorder(stream);
    videoRecording.start(0);
    videoRecording.ondataavailable = (e) => {
      data.push(e.data);
    }
  }
  const stopRecording = async () => {
    videoRecording.stop();
    let blob = new Blob(data,{
      type : "video/webm"
    })
    console.log(blob);
    let videoFile = new File([blob],"testing.webm");
    console.log(videoFile);
    const url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style="display: none;";
    a.href =url;
    a.download = "test.webm";
    a.click();
    console.log(url);
    // sending this file to a server
    let formData = new FormData();
    formData.append("video",videoFile);
    let res = await fetch("http://localhost:8080/storeRecording",{
      method:"POST",
      body:formData
    })
    let data1 = await res.json();
    console.log(data1);
  }
  return (
    <>
      <video muted id="vid" autoPlay style={{
        height : "300px",
        width : "50%"
      }}></video>
      <button id="start" onClick={startRecording}>Start</button>
      <button id="stop" onClick={stopRecording}>Stop</button>
    </>
  );
}

export default App;
