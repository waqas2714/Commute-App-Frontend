import React from "react";

const Passenger = ({name, photo,school }) => {
  return (
    <div className="p-4 mb-1 flex items-center gap-2 bg-[#161616] sm:w-[30%] md:w-[20%]">
      <img
        src={photo}
        alt="passenger's Image"
        className="max-w-[20%] rounded-full"
      />
      <div className="w-[70%]">
        <div className="flex items-baseline gap-2">
          <h2 className="font-bold text-[#4CE5B1]">Name:</h2>
          <p className="text-white text-sm">{name}</p>
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="font-bold text-[#4CE5B1]">School:</h2>
          <p className="text-white text-sm">{school}</p>
        </div>
      </div>
    </div>
  );
};

export default Passenger;
