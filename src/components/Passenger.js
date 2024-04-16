import React from "react";
import { CiTrash } from "react-icons/ci";
import axios from "axios";

import { toastOptions } from "..";
import { toast } from "react-toastify";

const Passenger = ({
  name,
  photo,
  school,
  isDriver,
  listingId,
  passengerId,
  setDetails,
}) => {
  const removePassenger = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.delete(
        `${process.env.BACKEND_URL}/api/rideListings/removePassenger/${listingId}/${passengerId}`
      );
      if (!data.success) {
        return toast.error(data.error, toastOptions);
      }
      setDetails((prev) => ({
        ...prev,
        passengers: prev.passengers.filter(
          (passenger) => passenger.userId !== passengerId
        ),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 mb-1 flex items-center gap-2 bg-[#161616] sm:w-[30%] md:w-[20%]">
      <img
        src={photo}
        alt="passenger's Image"
        className="max-w-[20%] rounded-full"
      />

      <div className={isDriver ? "w-[50%]" : "w-[70%]"}>
        <div className="flex items-baseline gap-2">
          <h2 className="font-bold text-[#4CE5B1]">Name:</h2>
          <p className="text-white text-sm">{name}</p>
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="font-bold text-[#4CE5B1]">School:</h2>
          <p className="text-white text-sm">{school}</p>
        </div>
      </div>

      {isDriver && (
        <div className="w-[25%] h-full flex flex-col justify-center items-center bg-[#0f0f0f] p-1 rounded-lg">
          <CiTrash
            size={30}
            className="cursor-pointer text-gray-700 hover:text-red-600 transition-all ease-in-out duration-100"
            onClick={removePassenger}
          />
        </div>
      )}
    </div>
  );
};

export default Passenger;
