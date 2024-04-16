import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

import { toast } from "react-toastify";
import RideOffer from "../components/RideOffer";
import ReviewUser from "../components/ReviewUser";
import { toastOptions } from "..";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../utils/backendUrl";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [scheduled, setScheduled] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user"))._id;

  const getPassengerRequests = async () => {
    try {
      if (navigator.onLine) {
        const { data } = await axios.get(
          `${backendUrl}/api/rideListings/passengerRideRequests/${userId}`
        );
        if (!data.success) {
          return toast.error(
            "An error occurred while getting your requests, please try again later", toastOptions
          );
        }
        localStorage.setItem("passengerRequests", JSON.stringify(data.rideRequests));
        setRequests(data.rideRequests);
      } else {
        const savedData = localStorage.getItem("passengerRequests");
        if (savedData) {
          setRequests(JSON.parse(savedData));
        } else {
          toast.error("You are offline and there is no saved data.", toastOptions);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const getScheduledRides = async () => {
    try {
      if (navigator.onLine) {
        const res = await axios.get(
          `${backendUrl}/api/rideListings/getScheduledRidesPassenger/${userId}`
        );
        if (!res.data.success) {
          return toast.error(
            "An error occurred while getting your scheduled rides, please try again later", toastOptions
          );
        }
        localStorage.setItem("scheduledRides", JSON.stringify(res.data.rideListings));
        setScheduled(res.data.rideListings);
      } else {
        const savedData = localStorage.getItem("scheduledRides");
        if (savedData) {
          setScheduled(JSON.parse(savedData));
        } else {
          toast.error("You are offline and there is no saved data.", toastOptions);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const getUserReviews = async () => {
    try {
      if (navigator.onLine) {
        const resReviews = await axios.get(
          `${backendUrl}/api/reviews/getReviewsUser/${userId}`
        );
  
        if (!resReviews.data.success) {
          return toast.error(
            "An error occurred while getting your reviews, please try again later", toastOptions
          );
        }
        localStorage.setItem("userReviews", JSON.stringify(resReviews.data.reviews));
        setReviews(resReviews.data.reviews);
      } else {
        const savedData = localStorage.getItem("userReviews");
        if (savedData) {
          setReviews(JSON.parse(savedData));
        } else {
          toast.error("You are offline and there is no saved data.", toastOptions);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  const getRequests = async () => {
    try {
      setIsLoading(true);
      
      await Promise.all([
        getPassengerRequests(),
        getScheduledRides(),
        getUserReviews(),
      ]);
      setIsLoading(false);
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          localStorage.clear();
          return toast.error("Please Log In.", toastOptions);
        }
        // Call API to verify token
        const response = await axios.get(`${backendUrl}/api/auth/verifyToken`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // If response is false, redirect to "/" and toast error
        if (!response.data) {
          navigate("/");
          localStorage.clear();
          return toast.error("Session Expired. Please Log In Again.", toastOptions);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkToken(); // Call the function
  }, []);


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
        <div className="p-4 md:flex md:flex-wrap md:gap-2 text-white">
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
            <p className="text-center text-[#4CE5B1] text-xl font-semibold">
              No Rides Were Scheduled.
            </p>
          )}
        </div>

        <h1 className="text-center text-white text-4xl p-4 font-bold">
          My Requests
        </h1>
        <div className="p-4 md:flex md:flex-wrap md:gap-2 text-white">
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
            <p className="text-center text-[#4CE5B1] text-xl font-semibold">
              No Requests Were Made.
            </p>
          )}
        </div>

        <h1 className="text-center text-white text-4xl p-4 font-bold">
          Reviews to Give
        </h1>
        <div className="p-4 sm:flex sm:flex-wrap sm:gap-[1vw] text-white">
          {isLoading ? (
            <p>Loading...</p>
          ) : reviews.length > 0 ? (
            reviews.map((review, index) => {
              return (
                <ReviewUser
                  image={review.image}
                  driverName={review.driverName}
                  from={review.departure}
                  to={review.destination}
                  reviewId={review.reviewId}
                  key={index}
                  setReviews={setReviews}
                />
              );
            })
          ) : (
            <p className="text-center text-[#4CE5B1] text-xl font-semibold">
              No Reviews to be Given.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default MyRequests;
