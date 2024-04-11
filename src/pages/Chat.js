import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { backendUrl } from "../utils/backendUrl";
import Navbar from "../components/Navbar";
import ChatBoxTag from "../components/ChatBoxTag";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdSend } from "react-icons/md";

const socket = io(backendUrl);
const Chat = () => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const isListeningRef = useRef(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("send-msg", { msg: message });
    setChat((prevState) => [...prevState, message]);
    setMessage("");
    console.log(chat);
  };

  useEffect(() => {
    if (!isListeningRef.current) {
      socket.on("msg-recieve", (msg) => {
        console.log("message recieved : " + msg);
        setChat((prevState) => {
          return [...prevState, msg];
        });
      });
      isListeningRef.current = true;
    }
  });

  return (
    <>
      <Navbar />
      <div className="mt-[10vh] h-[90vh] p-[2vw] bg-black text-white overflow-hidden">
        <h1 className="text-center text-4xl font-bold text-white md:w-[300px]">Chat</h1>

        <div className="relative flex">
          <div className="mt-2 md:mt-0 max-h-[75vh]  w-[96vw] overflow-auto sm:flex sm:flex-wrap sm:gap-x-[1vw] md:block md:w-[35vw] md:max-w-[305px]">
            <ChatBoxTag />
            <ChatBoxTag />
            <ChatBoxTag />
            <ChatBoxTag />
            <ChatBoxTag />
            <ChatBoxTag />
            <ChatBoxTag />
            <ChatBoxTag />
            <ChatBoxTag />
            <ChatBoxTag />
            <ChatBoxTag />
            <ChatBoxTag />
            <ChatBoxTag />
            <ChatBoxTag />
            <ChatBoxTag />
          </div>

          <div className="w-[100vw] h-[100vh]  absolute translate-x-[-2vw] 
              translate-y-[-6vh]
              md:translate-x-[300px] 
              md:h-[81vh]
              md:w-[65vw]
              lg:w-[72vw]
              "
          >
            
              
            {/* Heading  */}
            <div className="bg-[#161616] h-[15%] flex justify-between items-center">
              <div className="w-[12%] h-full bg-[#303030] flex justify-center items-center cursor-pointer ">
                <IoMdArrowRoundBack size={35} />
              </div>
              {/* <div className="flex gap-x-1 items-baseline w-[39%]  text-xl">
                <h1>From:</h1>
                <p className="sidebar-content">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
              <div className="flex gap-x-1 items-baseline w-[39%]  text-xl">
                <h1>To:</h1>
                <p className="sidebar-content">NUST</p>
              </div> */}
              <div className="w-[87%] flex flex-col  ">
              <div className="flex gap-x-1 items-baseline text-lg">
                <h1>From:</h1>
                <p className="sidebar-content">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
              <div className="flex gap-x-1 items-baseline text-lg">
                <h1>To:</h1>
                <p className="sidebar-content">NUST</p>
              </div>
              </div>
            </div>
            {/* Chat Part  */}
            <div className="bg-[#161616] h-[75%]">
                
              <div className="flex flex-col h-[83%] md:h-[99%] p-4 overflow-auto scrollbar">

                <div>
                    <h5 className="text-[#4CE5B1]">Maaz</h5>
                    <p className="max-w-[60%] bg-[#303030] p-3 rounded-lg">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore quia optio obcaecati ame</p>
                </div>

                <div className="self-end">
                    <h5 className="text-[#4CE5B1] text-right">Me</h5>
                    <p className="max-w-[60vw] bg-[#303030] p-3 rounded-lg">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore quia optio obcaecati ame</p>
                </div>

                <div>
                    <h5 className="text-[#4CE5B1]">Maaz</h5>
                    <p className="max-w-[60vw] bg-[#303030] p-3 rounded-lg">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore quia optio obcaecati ame</p>
                </div>

                <div className="self-end">
                    <h5 className="text-[#4CE5B1] text-right">Me</h5>
                    <p className="max-w-[60vw] bg-[#303030] p-3 rounded-lg">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore quia optio obcaecati ame</p>
                </div>

                <div>
                    <h5 className="text-[#4CE5B1]">Maaz</h5>
                    <p className="max-w-[60vw] bg-[#303030] p-3 rounded-lg">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore quia optio obcaecati ame</p>
                </div>


              </div>
              
              {/* Input  */}
              <div className=" h-[15%]">
                <form className="bg-[#111111] relative h-[100%] flex justify-center items-center">
                    <input type="text" placeholder="Message..." className="text-black text-lg p-3 pr-[52px] w-[90%] rounded-full border-0 outline-none"/>
                    <MdSend size={55} className="absolute right-3 sm:right-7 md:right-6 lg:right-9 bg-black p-2 rounded-full cursor-pointer hover:text-[#4CE5B1]" />
                </form>
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
