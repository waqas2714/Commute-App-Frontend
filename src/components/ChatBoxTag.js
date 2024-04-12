import axios from "axios";
import React from "react";
import { backendUrl } from "../utils/backendUrl";
import { toastOptions } from "..";
import { toast } from "react-toastify";

const ChatBoxTag = ({from, to, date, time, listingId, isDriver, setOpenChat, setChat, setDestination, setDeparture, setChatListing, socket, scrollToBottom}) => {
 
  const dateFormat = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);

    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  };

  date = dateFormat(date);

  const truncateString = (str) => {
    return str.length > 10 ? str.slice(0, 10) + "..." : str;
  };

  const getChat = async ()=>{
    try {
      const {data} = await axios.get(`${backendUrl}/api/chat/getChat/${listingId}`);

      if (!data.success) {
        return toast.error("Could not find chat for this listing, please try again.", toastOptions);
      }

      socket.emit("join-room", listingId);
      
      console.log(data.chats);
      setChat(data.chats);
      setDeparture(from);
      setDestination(to);
      const timeoutId = setTimeout(scrollToBottom, 100);
      setOpenChat(true); 
      setChatListing(listingId);     
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={` flex flex-wrap justify-between p-3 gap-y-3 sm:w-[46vw] md:w-[33vw] md:max-w-[290px] mt-2 ${isDriver ? "bg-[#94cebb] hover:bg-[#4CE5B1] text-black" : "bg-[#161616] hover:bg-[#2c2c2c] text-white"}  cursor-pointer  transition-all ease-in-out duration-150`} onClick={getChat}>
      <div className="flex align-baseline gap-1 w-[45%] text-sm">
        <h2>From: </h2>
        <p>{truncateString(from)}</p>
      </div>

      <div className="flex align-baseline gap-1 w-[45%] text-sm">
        <h2>To: </h2>
        <p>{truncateString(to)}</p>
      </div>

      <div className="flex align-baseline gap-1 w-[45%] text-sm">
        <h2>Date: </h2>
        <p>{date}</p>
      </div>

      <div className="flex align-baseline gap-1 w-[45%] text-sm">
        <h2>Time: </h2>
        <p>{time}</p>
      </div>
    </div>
  );
};

export default ChatBoxTag;
