import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toastOptions } from "..";

import axios from "axios";
import Navbar from "../components/Navbar";

const initialStateCar = {
  name: "",
  model: "",
  number: "",
  color: "",
};

const SignupDriver = () => {
  const [car, setCar] = useState(initialStateCar);
  const id = JSON.parse(localStorage.getItem("user"))._id;
  const navigate = useNavigate();

  const handleInputChangeCar = (e) => {
    const { name, value } = e.target;
    setCar({ ...car, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      car.name === "" ||
      car.model === "" ||
      car.number === "" ||
      car.color === ""
    ) {
      toast.error("Please fill in all fields.", toastOptions);
      return;
    }

    try {
      const {data} = await axios.post(`${backendUrl}/api/auth/registerDriver`, {
        ...car,
        id
      })

      if (!data.success) {
        toast.error(data.error, toastOptions);
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("You have successfully signed up as a driver!");
      navigate('/getRide');
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(()=>{
    if(!navigator.onLine){
      navigate("/myRequests");
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


  return (
    <>
    <Navbar />
    <div className="bg-black pt-3 mt-[10vh]">
      <img
        src="/resetPasswordLogo.png"
        className=" max-w-[70%] mx-auto lg:min-w-[100vh]"
        alt="logo"
      />
      <h3 className="text-white text-center text-4xl font-semibold mb-10">
        Register As A Driver
      </h3>

      <form
        className="flex flex-col lg:flex-row lg:flex-wrap lg:justify-around justify-center items-center gap-y-4  max-w-[730px] lg:max-w-screen-lg mx-auto"
        onSubmit={handleSubmit}
      >

       
            <div className="flex flex-col w-[70%] lg:w-[45%] gap-2">
              <label className="text-white text-2xl font-semibold">
                Car Name
              </label>
              <input
                type="text"
                placeholder="Car Name"
                className=" h-12 rounded-[2rem] px-4 "
                name="name"
                value={car.name}
                onChange={handleInputChangeCar}
              />
            </div>

            <div className="flex flex-col w-[70%] lg:w-[45%] gap-2">
              <label className="text-white text-2xl font-semibold">Model</label>
              <input
                type="text"
                placeholder="Model"
                className=" h-12 rounded-[2rem] px-4 "
                name="model"
                value={car.model}
                onChange={handleInputChangeCar}
              />
            </div>
            <div className="flex flex-col w-[70%] lg:w-[45%] gap-2">
              <label className="text-white text-2xl font-semibold">
                Registration Number
              </label>
              <input
                type="text"
                placeholder="Registration Number"
                className=" h-12 rounded-[2rem] px-4 "
                name="number"
                value={car.number}
                onChange={handleInputChangeCar}
              />
            </div>
            <div className="flex flex-col w-[70%] lg:w-[45%] gap-2">
              <label className="text-white text-2xl font-semibold">Color</label>
              <input
                type="text"
                placeholder="Color"
                className=" h-12 rounded-[2rem] px-4 "
                name="color"
                value={car.color}
                onChange={handleInputChangeCar}
              />
            </div>
       
        <button
          className="bg-[#4CE5B1] cursor-pointer w-[70%] lg:w-[50%] lg:mx-[10%] rounded-[2rem] h-14 hover:bg-black hover:text-[#4CE5B1] hover:border-2 hover:border-[#4CE5B1] transition-all duration-200 ease-in-out my-4"
          type="submit"
        >
          Register!
        </button>

      </form>
    </div>
    </>
  );
};

export default SignupDriver;
