import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toastOptions } from "..";
import axios from "axios";
import { backendUrl } from "../utils/backendUrl";

const initialState = {
  email: "",
  password: "",
  isDriver: false
};

const Login = () => {
  const [formData, setData] = useState(initialState);
  const navigate = useNavigate();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.email === "" || formData.password === "") {
        toast.error("Please fill in all fields.", toastOptions);
        return;
      }

      const { data } = await axios.post(
          `${backendUrl}/api/auth/login`,
          formData
        );
  
        if (data.success) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate("/getRide");
        } else {
          toast.error(data.error, toastOptions);
        }  
    } catch (error) {
      console.error(error)
    }
    
  };

  return (
    <div className="bg-black pt-3 ">
      <img
        src="/mainLogo.png"
        className="max-w-[240px] sm:max-w-[70%] mx-auto md:min-w-[100vh]"
        alt="logo"
      />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center gap-y-4  max-w-[730px] mx-auto"
      >
        <h3 className="text-white text-center text-4xl font-semibold">Login</h3>
        <div className="flex flex-col w-[70%] gap-2">
          <label className="text-white text-2xl font-semibold">Email</label>
          <input
            type="email"
            placeholder="Email"
            className=" h-12 rounded-[2rem] px-4 "
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col w-[70%] gap-2">
          <label className="text-white text-2xl font-semibold">Password</label>
          <input
            type="password"
            placeholder="Password"
            className=" h-12 rounded-[2rem] px-4 "
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>

        <button
          type="submit"
          className="bg-[#4CE5B1] cursor-pointer w-[70%] rounded-[2rem] h-14 hover:bg-black hover:text-[#4CE5B1] hover:border-2 hover:border-[#4CE5B1] transition-all duration-200 ease-in-out mt-4"
        >
          Login
        </button>
        <div className="flex flex-col items-center gap-4 mb-10 sm:flex-row sm:justify-between sm:w-[60%]">
        <Link
          className="text-[#4CE5B1]  hover:text-white transition-all ease-in-out duration-150"
          to={"/forgotPassword"}
        >
          Forgot Password?
        </Link>
        <Link
          className="text-[#4CE5B1]  hover:text-white transition-all ease-in-out duration-150"
          to={"/signup"}
        >
          Don't Have An Account?
        </Link>
        </div>
        
      </form>
    </div>
  );
};

export default Login;
