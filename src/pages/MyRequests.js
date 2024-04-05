import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { backendUrl } from "../utils/backendUrl";
import { toast } from "react-toastify";
import RideOffer from "../components/RideOffer";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [scheduled, setScheduled] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = JSON.parse(localStorage.getItem("user"))._id;

  const getRequests = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/rideListings/passengerRideRequests/${userId}`
      );
      if (!data.success) {
        return toast.error(
          "An error occured while getting your requests, please try again later"
        );
      }

      setRequests(data.rideRequests);

      const res = await axios.get(
        `${backendUrl}/api/rideListings/getScheduledRidesPassenger/${userId}`
      );
      if (!res.data.success) {
        return toast.error(
          "An error occured while getting yor scheduled rides, please try again later"
        );
      }

      setScheduled(res.data.rideListings);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  return (
    <>
      <Navbar />
      <div className="mt-[10vh] min-h-[90vh] bg-black">
        <h1 className="text-center text-white text-4xl p-4 font-bold">
          Scheduled Rides
        </h1>
        <div className="p-4">
          {isLoading ? (
            <p>Loading...</p>
          ) : scheduled.length > 0 ? (
            scheduled.map((request, index) => {
              return (
                <RideOffer
                  id={request.listingId}
                  image={request.driverImage}
                  name={request.driverName}
                  car={request.carName}
                  date={request.date}
                  time={request.time}
                  passengers={request.passengers}
                  totalPassengers={request.seatsAvailable}
                  key={index}
                />
              );
            })
          ) : (
            <p className="text-center text-[#4CE5B1] text-xl font-semibold">No Rides Were Scheduled.</p>
          )}
        </div>

        <h1 className="text-center text-white text-4xl p-4 font-bold">
          My Requests
        </h1>
        <div className="p-4">
          {isLoading ? (
            <p>Loading...</p>
          ) : requests.length > 0 ? (
            requests.map((request, index) => {
              return (
                <RideOffer
                  id={request.listingId}
                  image={request.image}
                  name={request.driverName}
                  car={request.driverCarName}
                  date={request.date}
                  time={request.time}
                  passengers={request.passengers}
                  totalPassengers={request.seatsAvailable}
                  key={index}
                />
              );
            })
          ) : (
            <p className="text-center text-[#4CE5B1] text-xl font-semibold">No Requests Were Made.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default MyRequests;
