import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client';
import { backendUrl } from './utils/backendUrl';

const socket = io(backendUrl);
const App = () => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const isListeningRef = useRef(false);

  const handleSubmit = (e)=>{
    e.preventDefault();
    socket.emit("send-msg", {msg : message});
    setChat((prevState)=>[...prevState, message]);
    setMessage("");
    console.log(chat);
  }

  useEffect(()=>{
    if (!isListeningRef.current) {
      
      socket.on("msg-recieve", (msg)=>{
        console.log("message recieved : " + msg);
        setChat((prevState)=>{
          return [...prevState, msg]
        })
      })
      isListeningRef.current = true;
    }
    })

  return (
    <>
    <div>
      <h2>Messages:</h2>
      {
        chat.length > 0 ?
        chat.map((message, index)=>{
          return <h5 key={index}>{message}</h5>
        })
        : <h5>No messages yet :{')'}</h5>
      }
    </div>

    <form onSubmit={handleSubmit}>
      <input type="text" placeholder='Chat' value={message} onChange={(e)=>setMessage(e.target.value)}/>
      <button type='submit'>Send</button>
    </form>
    </>
  )
}

export default App