import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { toastOptions } from "..";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        try {
            e.preventDefault();

            if (email === "") {
                toast.error("Please enter an Email.");
            }

            const {data} = await axios.post(
                `${process.env.BACKEND_URL}/api/auth/forgotPassword`,
                {email}
            );

            if (!data.success) {
                return toast.error(data.error, toastOptions);
            }

            toast.success(`An email has been sent to ${email}. Reset your password from there.`, toastOptions);
            navigate(`/`);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
      if(!navigator.onLine){
        toast.error("You do not have an internet connection.", toastOptions);
      }
    },[])

    
  return (
    <div className="bg-black min-h-screen pb-8">
      <img
        src="forgotPasswordLogo.png"
        alt="logo"
        className="sm:h-[100vh] mx-auto"
      />

      <form className="mx-auto flex flex-col items-center gap-3 text-white w-screen  max-w-[550px] sm:w-[75vw] md:w-[50vw]" onSubmit={handleSubmit}>
        <h2 className=" text-4xl font-semibold ">Forgot Password</h2>

        <div className="flex flex-col w-[70%] gap-4">
          <label className="text-white text-3xl font-semibold mt-6">
            Enter Your Email
          </label>
          <input
            type="email"
            placeholder="Email"
            className="text-black h-12 rounded-[2rem] px-4 "
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-[#4CE5B1] cursor-pointer w-[70%] rounded-[2rem] h-14 hover:bg-black hover:text-[#4CE5B1] hover:border-2 hover:border-[#4CE5B1] transition-all duration-200 ease-in-out mt-4"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
