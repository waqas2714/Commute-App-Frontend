import React from "react";
import { Link } from "react-router-dom";

const RideOffer = ({
  image,
  name,
  car,
  date,
  time,
  passengers,
  totalPassengers,
  id
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
  return (
    <Link className="group flex justify-between min-h-[15vh] rounded-xl bg-[#161616] p-2 mt-1 hover:bg-[#4CE5B1] transition-all ease-in-out md:w-[30vw] duration-150 md:ml-[1vw]"
    to={`/listingDetail/${id}`}
    >
      <div className="flex justify-center items-center w-[25%]">
        <img
          src={image}
          alt="driver's image"
          className="w-[150px] rounded-full"
        />
      </div>

      <div className="w-[70%] flex flex-wrap gap-x-3 ">
        <div className="flex gap-1">
          <h4 className="font-bold text-[#4CE5B1] group-hover:text-black">
            Name:
          </h4>
          <p className="group-hover:text-black">{name}</p>
        </div>
        <div className="flex gap-1">
          <h4 className="font-bold text-[#4CE5B1] group-hover:text-black">
            Car:
          </h4>
          <p className="group-hover:text-black">{car}</p>
        </div>
        <div className="flex gap-1">
          <h4 className="font-bold text-[#4CE5B1] group-hover:text-black">
            Date:
          </h4>
          <p className="group-hover:text-black">{date}</p>
        </div>
        <div className="flex gap-1">
          <h4 className="font-bold text-[#4CE5B1] group-hover:text-black">
            Time:
          </h4>
          <p className="group-hover:text-black">{time}</p>
        </div>
        <div className="flex gap-1">
          <h4 className="font-bold text-[#4CE5B1] group-hover:text-black">
            Passengers:
          </h4>
          <p className="group-hover:text-black">{passengers}</p>
        </div>
        <div className="flex gap-1">
          <h4 className="font-bold text-[#4CE5B1] group-hover:text-black">
            Total Passengers:
          </h4>
          <p className="group-hover:text-black">{totalPassengers}</p>
        </div>
      </div>
    </Link>
  );
};

export default RideOffer;
