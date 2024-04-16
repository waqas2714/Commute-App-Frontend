import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Review from "../components/Review";
import axios from "axios";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { toastOptions } from "..";
import { backendUrl } from "../utils/backendUrl";

const DriverProfile = () => {
  const [driver, setDriver] = useState(null);
  const [reviews, setReview] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPassenger, setIsPassenger] = useState(false);
  const { driverId } = useParams();
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const navigate = useNavigate();

  const getDriverInfo = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/auth/driverInfo/${driverId}/${userId}`
      );
      if (!data.success) {
        setIsLoading(false);
        return toast.error("Driver Not Found.", toastOptions);
      }

      setDriver(data.driver);

      if (userId == driverId) {
        setIsPassenger(true);
      } else {
        setIsPassenger(data.isPassenger);
      }

    } catch (error) {
      console.log(error);
    }
  };

  const getReviews = async ()=>{
    try {
      const {data} = await axios.get(`${backendUrl}/api/reviews/getReviewsDriver/${driverId}`);
      if (!data.success) {
        return toast.error(data.error, toastOptions);
      }

      setReview(data.reviews)
    } catch (error) {
      console.log(error);
    }
  }

  const getInfo = async () => {
    try {
      await Promise.all([getReviews(), getDriverInfo()]);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  
  useEffect(()=>{
    if(!navigator.onLine){
      const mode = JSON.parse(localStorage.getItem("isDriverMode"));
      if (mode) {
        navigate('/currentRides');
      } else {
        navigate("/myRequests");
      }
      toast.error("You do not have an internet connection.", toastOptions);
    }
  },[])


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
    getInfo();
  }, []);

  return (
    <>
      <Navbar />
      {!isLoading ? (
        <>
          {!driver ? (
            <div className="mt-[10vh] bg-black min-h-[90vh] p-4">
              <h1 className="text-white text-3xl font-bold text-center">
                Driver Not Found.
              </h1>
            </div>
          ) : (
            <div className="mt-[10vh] bg-black min-h-[90vh] p-4">
              <h1 className="text-white text-3xl font-bold text-center">
                Driver Info
              </h1>
              <img
                src={driver.image}
                alt="driver's photo"
                className="min-w-[240px] max-w-[340px] mx-auto rounded-full mt-4"
              />

              <div className="sm:flex sm:flex-wrap sm:gap-2 pb-4 mt-8">
                <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
                  <h2 className="font-bold text-2xl text-[#4CE5B1]">Name:</h2>
                  <p className="text-white text-xl">{driver.username}</p>
                </div>

                {isPassenger && (
                  <>
                    <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
                      <h2 className="font-bold text-2xl text-[#4CE5B1]">
                        CMS:
                      </h2>
                      <p className="text-white text-xl">{driver.cms}</p>
                    </div>

                    <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
                      <h2 className="font-bold text-2xl text-[#4CE5B1]">
                        Phone:
                      </h2>
                      <p className="text-white text-xl">{driver.phone}</p>
                    </div>
                  </>
                )}

                <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
                  <h2 className="font-bold text-2xl text-[#4CE5B1]">School:</h2>
                  <p className="text-white text-xl">{driver.school}</p>
                </div>

                <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
                  <h2 className="font-bold text-2xl text-[#4CE5B1]">Car:</h2>
                  <p className="text-white text-xl">{driver.carDetails.name}</p>
                </div>

                <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
                  <h2 className="font-bold text-2xl text-[#4CE5B1]">Model:</h2>
                  <p className="text-white text-xl">
                    {driver.carDetails.model}
                  </p>
                </div>

                {isPassenger && (
                  <>
                    <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
                      <h2 className="font-bold text-2xl text-[#4CE5B1]">
                        Car Reg Number:
                      </h2>
                      <p className="text-white text-xl">
                        {driver.carDetails.number}
                      </p>
                    </div>

                    <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
                      <h2 className="font-bold text-2xl text-[#4CE5B1]">
                        Car Color:
                      </h2>
                      <p className="text-white text-xl">
                        {driver.carDetails.color}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <h1 className="text-white text-3xl font-bold text-center md:mb-4">
                Reviews
              </h1>
                
              <div className="md:flex md:flex-wrap gap-[1vw]">
              {
                  reviews.length > 0 ? (
                    reviews.map((review, index)=>{
                      return <Review key={index} name={review.from.username} school={review.from.school} comment={review.comment} />
                    })
                  )
                  
                  : <p className="text-center text-[#4CE5B1] text-xl font-semibold">
                  No Reviews Were Given.
                </p>
                }
              </div>
            </div>
          )}
        </>
      ) : (
        <h1 className="text-white text-3xl font-bold text-center mt-4">
          Loading...
        </h1>
      )}
    </>
  );
};

export default DriverProfile;
