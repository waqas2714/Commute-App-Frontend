import React, { useState } from "react";
import {
  Link
} from "react-router-dom";

const Login = () => {

  return (
    <div className="bg-black pt-3 ">
      <img src="/mainLogo.png" className=" max-w-[70%] mx-auto " alt="logo" />

      <form className="flex flex-col justify-center items-center gap-y-4  max-w-[730px] mx-auto">
        <h3 className="text-white text-center text-4xl font-semibold">
          Login
        </h3>
        <div className="flex flex-col w-[70%] gap-2">
          <label className="text-white text-2xl font-semibold">Email</label>
          <input
            type="email"
            placeholder="Email"
            className=" h-12 rounded-[2rem] px-4 "
          />
        </div>
        <div className="flex flex-col w-[70%] gap-2">
          <label className="text-white text-2xl font-semibold">Password</label>
          <input
            type="password"
            placeholder="Password"
            className=" h-12 rounded-[2rem] px-4 "
          />
        </div>
        
        <button className="bg-[#4CE5B1] cursor-pointer w-[70%] rounded-[2rem] h-14 hover:bg-black hover:text-[#4CE5B1] transition-all duration-200 ease-in-out mt-4">Login</button>
        <Link className=" mb-10 text-[#4CE5B1] sm:text-white hover:text-[#4CE5B1] transition-all ease-in-out duration-150" to={'/signup'}>Don't Have An Account?</Link>
      </form>
    </div>
  );
};

export default Login;
