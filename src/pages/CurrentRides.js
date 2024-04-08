import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RideRequest from "../components/RideRequest";
import RideListing from "../components/RideListing";
import axios from "axios";
import { toast } from "react-toastify";
import { toastOptions } from "..";
import { backendUrl } from "../utils/backendUrl";

const CurrentRides = () => {
  const [rideRequests, setRideRequests] = useState([]);
  const [rideListings, setRideListings] = useState([]);

  const driverId = JSON.parse(localStorage.getItem("user"))._id;

  const fetchRideRequests = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/rideListings/myRideRequests/${driverId}`
      );
  
      if (!data.success) {
        return toast.error(data.error, toastOptions);
      }
  
      setRideRequests(data.rideRequests);
    } catch (error) {
      console.log(error);
    }
  };
  
  const fetchRideListings = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/rideListings/myListings/${driverId}`
      );
  
      if (!data.success) {
        return toast.error(data.error, toastOptions);
      }
  
      setRideListings(data.listings);
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    // Call both API functions when the component mounts
    fetchRideRequests();
    fetchRideListings();
  }, []);
  

  return (
    <>
      <Navbar />
      <div className="mt-[10vh] min-h-[90vh] bg-black py-4 px-8">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Ride Requests
        </h1>
        {rideRequests.length > 0 ? (
          <div className="sm:flex sm:gap-2 sm:flex-wrap">
            {rideRequests.map((request, index) => {
              return (
                <RideRequest
                  rideRequestId={request._id}
                  name={request.username}
                  school={request.school}
                  date={request.date}
                  time={request.time}
                  from={request.departure}
                  to={request.destination}
                  img={request.image}
                  setRideRequests={setRideRequests}
                  key={index}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-[#4CE5B1] text-xl mx-auto">No Requests Found.</p>
        )}

        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          My Ride Listings
        </h1>
        {rideListings.length > 0 ? (
          <div className="flex gap-3 flex-wrap">
            {
              rideListings.map((listing, index)=>{
                return <RideListing id={listing._id} from={listing.departure} to={listing.destination} date={listing.date} time={listing.time} setRideListings={setRideListings} key={index}/>
              })
            }
          </div>
        ) : (
          <p className="text-[#4CE5B1] text-xl mx-auto">No Listings Found.</p>
        )}
      </div>
    </>
  );
};

export default CurrentRides;
