import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import Navbar from "../components/Navbar";
import ChatBoxTag from "../components/ChatBoxTag";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdSend } from "react-icons/md";
import axios from "axios";
import { toastOptions } from "..";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../utils/backendUrl";

const socket = io(backendUrl);
const Chat = () => {
  const [chat, setChat] = useState([]);
  const [chatTags, setChatTags] = useState([]);
  const [chatTagsLoading, setChatTagsLoading] = useState(true);
  const [openChat, setOpenChat] = useState(false);
  const [message, setMessage] = useState("");
  const [destination, setDestination] = useState("");
  const [departure, setDeparture] = useState("");
  const [chatListing, setChatListing] = useState("");
  const [scrollToBot, setScrollToBot] = useState(false);
  const isListeningRef = useRef(false);
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const username = JSON.parse(localStorage.getItem("user")).username;
  const chatRef = useRef(null)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (message !== "") {
      try {
        const { data } = await axios.post(
          `${backendUrl}/api/chat/addChat/${chatListing}/${userId}`,
          { message }
        );
        if (!data.success) {
          return toast.error("Message could not be sent. Please try again.", toastOptions);
        }
        socket.emit("send-msg", { message, username, _id: userId, listingId : chatListing });
        setChat((prevState) => [...prevState, { message, username, _id: userId }]);
        setMessage("");
        setScrollToBot(!scrollToBot);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getChatTags = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/chat/getAllChats/${userId}`
      );
      if (!data.success) {
        return toast.error(
          "Chats could not be found. Please try again.",
          toastOptions
        );
      }
      setChatTags(data.chats);
      setChatTagsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    if(!navigator.onLine){
      navigate("/myRequests");
      toast.error("You do not have an internet connection.", toastOptions);
    }
  },[])


  useEffect(() => {
    if (!isListeningRef.current) {
      socket.on("msg-recieve", (msg) => {
        console.log(msg);
        setChat((prevState) => {
          return [...prevState, msg];
        });
      });
      isListeningRef.current = true;
    }
  });

  useEffect(() => {
    const checkToken = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          localStorage.clear();
          return toast.error("Please Log In.", toastOptions);
        }
        // Call API to verify token
        const response = await axios.get(`${backendUrl}/api/auth/verifyToken`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // If response is false, redirect to "/" and toast error
        if (!response.data) {
          navigate("/");
          localStorage.clear();
          return toast.error("Session Expired. Please Log In Again.", toastOptions);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkToken(); // Call the function
  }, []);


  useEffect(() => {
    getChatTags();
  }, []);

  // Scroll to the bottom of the chat window
  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(() => {

  // Delay scrolling to the bottom to ensure message is rendered
  const timeoutId = setTimeout(scrollToBottom, 100);

  // Clean up
  return () => clearTimeout(timeoutId);
  }, [scrollToBot]);

  return (
    <>
      <Navbar />
      <div className="mt-[10vh] h-[90vh] p-[2vw] bg-black text-white overflow-hidden">
        <h1 className="text-center text-4xl font-bold text-white md:w-[300px]">
          Chat
        </h1>

        <div className="relative flex">
          <div className="mt-2 md:mt-0 max-h-[75vh]  w-[96vw] overflow-auto sm:flex sm:flex-wrap sm:gap-x-[1vw] md:block md:w-[34vw] md:max-w-[305px]">
            {chatTagsLoading ? (
              <p>Loading...</p>
            ) : chatTags.length > 0 ? (
              chatTags.map((tag, index) => (
                <ChatBoxTag
                  from={tag.departure}
                  to={tag.destination}
                  date={tag.date}
                  time={tag.time}
                  listingId={tag.listingId}
                  isDriver={tag.isDriver}
                  setOpenChat={setOpenChat}
                  setChat={setChat}
                  setDestination={setDestination}
                  setDeparture={setDeparture}
                  setChatListing={setChatListing}
                  chatListing={chatListing}
                  socket={socket}
                  scrollToBottom={scrollToBottom}
                  key={index}
                />
              ))
            ) : (
              <p className="text-center text-[#4CE5B1] text-xl font-semibold">
                No Chats Available.
              </p>
            )}
          </div>

          <div
            className={`
            ${openChat ? "translate-x-[-2vw]" : "translate-x-[102vw]"}
            translate-y-[2vh]
            w-[100vw] 
            h-[90vh]  
            absolute   
            md:h-[74vh]
            chatbox
            chatbox-translate
            transition-all
            ease-in-out
            duration-150
              `}
          >
            {
              chatListing.length > 0 ? /* Heading  */
              <>
              <div className=" h-[15%] flex justify-between items-center md:px-6 bg-[#111111]">
                <div className="w-[12%] h-full bg-[#303030] hover:bg-[#585858] transition-all ease-in-out duration-200 flex justify-center items-center cursor-pointer md:hidden"
                onClick={() => {
                  socket.emit("leave-room", chatListing);
                  setOpenChat(false)
                }}
                >
                  <IoMdArrowRoundBack
                    size={35}
                  />
                </div>
  
                <div className="w-[87%] flex flex-col  ">
                  <div className="flex gap-x-1 items-baseline text-lg">
                    <h1>From:</h1>
                    <p className="sidebar-content w-[80%]">{departure}</p>
                  </div>
                  <div className="flex gap-x-1 items-baseline text-lg">
                    <h1>To:</h1>
                    <p className="sidebar-content w-[80%]">{destination}</p>
                  </div>
                </div>
              </div>
              
              {/* Chat Part  */}
              <div className="bg-[#161616] h-[75%]">
                <div ref={chatRef} className="flex flex-col h-[85%] md:h-[95%] p-4 overflow-auto scrollbar">
                  
                  {chat.length > 0 ? (
                    chat.map((chat, index) => {
                      return (
                        <div
                          className={`${
                            userId == chat._id && "self-end"
                          } w-fit max-w-[60%] md:max-w-[50%]`}
                          key={index}
                        >
                          <h5
                            className={`text-[#4CE5B1] ${
                              userId == chat._id && "text-right text-sm"
                            }`}
                          >
                            {userId == chat._id ? "Me" : chat.username}
                          </h5>
                          <p className=" bg-[#303030] p-3 rounded-lg">
                            {chat.message}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <h2 className="text-center text-[#4CE5B1] text-xl font-semibold">
                      Send the first message.
                    </h2>
                  )}
                </div>
  
                {/* Input  */}
                <div className=" h-[15%] md:h-[19%]">
                  <form
                    className="bg-[#111111] relative h-[100%] flex justify-center items-center"
                    onSubmit={handleSubmit}
                  >
                    <input
                      type="text"
                      placeholder="Message..."
                      className="text-black text-lg p-3 pr-[52px] w-[90%] rounded-full border-0 outline-none"
                      value={message}
                      onChange={(e)=>setMessage(e.target.value)}
                    />
                    <MdSend
                      size={55}
                      className="absolute right-3 sm:right-7 md:right-6 lg:right-9 bg-black p-2 rounded-full cursor-pointer hover:text-[#4CE5B1]"
                      type="submit"
                      onClick={handleSubmit}
                    />
                  </form>
                </div>
              </div> </>: <p className="text-center text-[#4CE5B1] text-xl font-semibold">Select an inbox to chat</p>
            }
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
