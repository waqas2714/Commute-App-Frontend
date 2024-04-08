import React from "react";
import { RxCross1 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa6";
import axios from "axios";
import { backendUrl } from "../utils/backendUrl";
import { toast } from "react-toastify";
import { toastOptions } from "..";

const RideRequest = ({
  rideRequestId,
  name,
  school,
  date,
  time,
  from,
  to,
  img,
  setRideRequests,
}) => {
  const dateFormat = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);

    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  };

  date = dateFormat(date);

  const action = async (decision) => {
    try {
      if (decision === "reject") {
        const { data } = await axios.delete(
          `${backendUrl}/api/rideListings/rejectRideRequest/${rideRequestId}`
        );

        if (!data.success) {
          return toast.error(
            "Could not reject the request. Please try again.",
            toastOptions
          );
        }

        // Remove the object with _id equal to rideRequestId from the state
        setRideRequests((prevRideRequests) =>
          prevRideRequests.filter((request) => request._id !== rideRequestId)
        );
      } else {
        const { data } = await axios.get(
          `${backendUrl}/api/rideListings/acceptRideRequest/${rideRequestId}`
        );

        if (!data.success) {
          return toast.error(data.error, toastOptions);
        }

        setRideRequests((prevRideRequests) =>
          prevRideRequests.filter((request) => request._id !== rideRequestId)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex gap-x-2 justify-between min-h-[15vh] rounded-xl bg-[#161616] p-2 mt-1 transition-all ease-in-out sm:w-[45vw] md:w-[30vw] duration-150 text-white">
      <div className="flex justify-center items-center w-[25%]">
        <img
          src={img}
          alt="driver's image"
          className="w-[150px] rounded-full"
        />
      </div>

      <div className="w-[70%] flex flex-wrap gap-x-3 ">
        <div className="flex gap-1">
          <h4 className="font-bold text-[#4CE5B1] ">Name:</h4>
          <p>{name}</p>
        </div>
        <div className="flex gap-1">
          <h4 className="font-bold text-[#4CE5B1] ">School:</h4>
          <p>{school}</p>
        </div>
        <div className="flex gap-1">
          <h4 className="font-bold text-[#4CE5B1] ">Date:</h4>
          <p>{date}</p>
        </div>
        <div className="flex gap-1">
          <h4 className="font-bold text-[#4CE5B1] ">Time:</h4>
          <p>{time}</p>
        </div>
        <div className="flex gap-1">
          <h4 className="font-bold text-[#4CE5B1] ">From:</h4>
          <p>{from}</p>
        </div>
        <div className="flex gap-1">
          <h4 className="font-bold text-[#4CE5B1] ">To:</h4>
          <p>{to}</p>
        </div>
      </div>

      <div className="flex flex-col justify-around bg-[#0f0f0f] p-1 rounded-lg">
        <RxCross1
          size={25}
          className="cursor-pointer hover:text-red-600 transition-all ease-in-out duration-100"
          onClick={() => action("reject")}
        />
        <FaCheck
          size={25}
          className="cursor-pointer hover:text-green-500 transition-all ease-in-out duration-100"
          onClick={() => action("accept")}
        />
      </div>
    </div>
  );
};

export default RideRequest;
