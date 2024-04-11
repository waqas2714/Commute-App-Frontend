import React from "react";

const ChatBoxTag = () => {
    const isDriver = true;
  return (
    <div className={`flex flex-wrap justify-between p-3 gap-y-3 sm:w-[46vw] md:w-[33vw] md:max-w-[290px] mt-2 ${isDriver ? "bg-[#94cebb] hover:bg-[#4CE5B1] text-black" : "bg-[#161616] hover:bg-[#2c2c2c] text-white"}  cursor-pointer  transition-all ease-in-out duration-150`}>
      <div className="flex align-baseline gap-1 w-[45%]">
        <h2>From: </h2>
        <p>DHA</p>
      </div>

      <div className="flex align-baseline gap-1 w-[45%]">
        <h2>To: </h2>
        <p>Isb</p>
      </div>

      <div className="flex align-baseline gap-1 w-[45%]">
        <h2>Date: </h2>
        <p>01-07-24</p>
      </div>

      <div className="flex align-baseline gap-1 w-[45%]">
        <h2>Time: </h2>
        <p>03:00</p>
      </div>
    </div>
  );
};

export default ChatBoxTag;
