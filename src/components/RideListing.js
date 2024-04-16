import React from "react";
import { CiTrash } from "react-icons/ci";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import axios from "axios";
import { toastOptions } from "..";
import { backendUrl } from "../utils/backendUrl";

const RideListing = ({ id, from, to, date, time, setRideListings }) => {
  const dateFormat = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);

    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  };

  date = dateFormat(date);

  const removeListing = async (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if (navigator.onLine) {
      try {
        const { data } = await axios.delete(
          `${backendUrl}/api/rideListings/removeListing/${id}`
        );
  
        if (!data.success) {
          return toast.error(data.error, toastOptions);
        }
  
        setRideListings((prevRideListings) =>
          prevRideListings.filter(
            (listing) => listing._id !== data.removedListing
          )
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Please try again when you are online.", toastOptions);
    }
    
  };

  return (
    <Link
      className="flex gap-x-2 justify-between min-h-[15vh] rounded-xl bg-[#161616] p-2 mt-1 transition-all ease-in-out w-[100vw] sm:w-[30vw] duration-150 text-white"
      to={`/listingDetail/${id}`}
    >
      <div className="w-[70%] flex flex-wrap gap-x-3 ">
        <div className="flex gap-1">
          <h4 className="font-bold text-[#4CE5B1] ">From:</h4>
          <p>{from}</p>
        </div>
        <div className="flex gap-1">
          <h4 className="font-bold text-[#4CE5B1] ">To:</h4>
          <p>{to}</p>
        </div>

        <div className="flex gap-1">
          <h4 className="font-bold text-[#4CE5B1] ">Date:</h4>
          <p>{date}</p>
        </div>
        <div className="flex gap-1">
          <h4 className="font-bold text-[#4CE5B1] ">Time:</h4>
          <p>{time}</p>
        </div>
      </div>

      <div className="flex flex-col justify-center bg-[#0f0f0f] p-1 rounded-lg">
        <CiTrash
          size={25}
          className="cursor-pointer hover:text-red-600 transition-all ease-in-out duration-100"
          onClick={removeListing}
        />
      </div>
    </Link>
  );
};

export default RideListing;
