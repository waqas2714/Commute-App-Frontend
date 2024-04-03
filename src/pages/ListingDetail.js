import React from "react";
import Navbar from "../components/Navbar";
import Passenger from "../components/Passenger";

const ListingDetail = () => {
  return (
    <>
      <Navbar />
      <div className="mt-[10vh] pt-8 bg-black">
        <h1 className="text-center text-white font-extrabold text-4xl mb-4">
          DETAILS
        </h1>

        <div className="sm:flex sm:flex-row-reverse sm:justify-around sm:items-center"> 
        <div className="h-[50vh] w-[50vw] bg-cyan-500 mt-4"></div>
        <div className="mt-4">
          <img
            src="/signupLogo.png"
            alt="driver's image"
            className="w-[75vw] max-w-[250px] mx-auto rounded-full"
          />
        </div>
        </div>

        <div className="sm:flex sm:flex-wrap sm:gap-2">
          <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
            <h2 className="font-bold text-2xl text-[#4CE5B1]">Driver:</h2>
            <p className="text-white text-xl">Waqas</p>
          </div>
          <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
            <h2 className="font-bold text-2xl text-[#4CE5B1]">School:</h2>
            <p className="text-white text-xl">SEECS</p>
          </div>
          <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
            <h2 className="font-bold text-2xl text-[#4CE5B1]">Car:</h2>
            <p className="text-white text-xl">Aston Martin</p>
          </div>
          <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
            <h2 className="font-bold text-2xl text-[#4CE5B1]">Model/Color:</h2>
            <p className="text-white text-xl">DBS-770/Black</p>
          </div>
          <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
            <h2 className="font-bold text-2xl text-[#4CE5B1]">Departure:</h2>
            <p className="text-white text-xl">SEECS, NUST</p>
          </div>
          <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
            <h2 className="font-bold text-2xl text-[#4CE5B1]">Destination:</h2>
            <p className="text-white text-xl">APS, DHAI</p>
          </div>
          <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
            <h2 className="font-bold text-2xl text-[#4CE5B1]">Date:</h2>
            <p className="text-white text-xl">14-7-2024</p>
          </div>
          <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
            <h2 className="font-bold text-2xl text-[#4CE5B1]">Time:</h2>
            <p className="text-white text-xl">16:00</p>
          </div>
          <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
            <h2 className="font-bold text-2xl text-[#4CE5B1]">
              Max Passengers:
            </h2>
            <p className="text-white text-xl">2</p>
          </div>
          <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
            <h2 className="font-bold text-2xl text-[#4CE5B1]">Seats Left:</h2>
            <p className="text-white text-xl">1</p>
          </div>
            <h2 className="font-bold text-2xl p-4 text-[#4CE5B1] w-[100vw]">
              Passengers:
            </h2>
          <div className="w-[100vw] sm:flex sm:flex-wrap sm:gap-y-2 sm:gap-x-8 p-4">
            <Passenger />
            <Passenger />
            <Passenger />
            <Passenger />
          </div>

          <h2 className="font-bold text-2xl p-4 text-[#4CE5B1] w-[100vw]">Route:</h2>
          <div className="h-[50vh] bg-cyan-500 w-[100vw] sm:h-[50vh] md:h-[70vh] mx-4 mb-4"></div>
        </div>
      </div>
    </>
  );
};

export default ListingDetail;
