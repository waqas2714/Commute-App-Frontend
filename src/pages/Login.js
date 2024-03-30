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
          navigate("/home");
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
        className=" max-w-[70%] mx-auto lg:min-w-[100vh]"
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


        <div
          className={`flex gap-3 lg:w-[45%]`}
        >
          <div
            className="flex justify-center items-center bg-[#4CE5B1] cursor-pointer w-32 rounded-lg h-10 hover:bg-black hover:text-[#4CE5B1] transition-all duration-200 ease-in-out lg:ml-[25%] lg:my-10"
            onClick={() => setOpenRole(!openRole)}
          >
            {chooseRole}
          </div>
          {openRole && (
            <div>
              <div
                className={`flex justify-center items-center bg-[#4CE5B1] cursor-pointer w-32 rounded-lg h-10 mb-1 hover:bg-black hover:text-[#4CE5B1] transition-all duration-200 ease-in-out ${
                  !formData.isDriver && "bg-black text-[#4CE5B1]  border-2 border-[#4CE5B1]"
                }`}
                onClick={() => {
                  setOpenRole(false);
                  setChooseRole("Passenger");
                  setData({ ...formData, isDriver: false });
                }}
              >
                Passenger
              </div>
              <div
                className={`flex justify-center items-center bg-[#4CE5B1] cursor-pointer w-32 rounded-lg h-10 hover:bg-black hover:text-[#4CE5B1] transition-all duration-200 ease-in-out ${
                  formData.isDriver && "bg-black text-[#4CE5B1] border-2 border-[#4CE5B1]"
                }`}
                onClick={() => {
                  setOpenRole(false);
                  setChooseRole("Driver");
                  setData({ ...formData, isDriver: true });
                }}
              >
                Driver
              </div>
            </div>
          )}
        </div>


        <button
          type="submit"
          className="bg-[#4CE5B1] cursor-pointer w-[70%] rounded-[2rem] h-14 hover:bg-black hover:text-[#4CE5B1] transition-all duration-200 ease-in-out mt-4"
        >
          Login
        </button>
        <Link
          className=" mb-10 text-[#4CE5B1] sm:text-white hover:text-[#4CE5B1] transition-all ease-in-out duration-150"
          to={"/signup"}
        >
          Don't Have An Account?
        </Link>
      </form>
    </div>
  );
};

export default Login;
