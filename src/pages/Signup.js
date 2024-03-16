import React, { useState } from "react";
import {
  Link
} from "react-router-dom";

const initialState = {
  name : "",
  cms : "",
  email : "",
  password : "",
  contactNo : "",
  school : "",
  isDriver : null,
}

const Signup = () => {
  const [image, setImage] = useState(null);
  const [openSchool, setOpenSchool] = useState(false);
  const [openRole, setOpenRole] = useState(false);
  const nustSchools = [
    "SEECS",
    "SMME",
    "SCEE",
    "SNS",
    "S3H",
    "SCME",
    "SADA",
    "NBS",
    "NSHS",
  ];
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="bg-black pt-3 ">
      <img src="/signupLogo.png" className=" max-w-[70%] mx-auto " alt="logo" />

      <form className="flex flex-col justify-center items-center gap-y-4  max-w-[730px] mx-auto">
        <h3 className="text-white text-center text-4xl font-semibold">
          Signup
        </h3>
        <div className="flex flex-col w-[70%] gap-2">
          <label className="text-white text-2xl font-semibold">Name</label>
          <input
            type="text"
            placeholder="Name"
            className=" h-12 rounded-[2rem] px-4 "
          />
        </div>
        <div className="flex flex-col w-[70%] gap-2">
          <label className="text-white text-2xl font-semibold">CMS</label>
          <input
            type="text"
            placeholder="CMS ID"
            className=" h-12 rounded-[2rem] px-4 "
          />
        </div>
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
        <div className="flex flex-col w-[70%] gap-2">
          <label className="text-white text-2xl font-semibold">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            className=" h-12 rounded-[2rem] px-4 "
          />
        </div>
        <div className="flex flex-col w-[70%] gap-2">
          <label className="text-white text-2xl font-semibold">
            Contact No.
          </label>
          <input
            type="text"
            placeholder="03XX-XXXXXXX"
            className=" h-12 rounded-[2rem] px-4 "
          />
        </div>

        <div className="flex gap-3">
          <div className="flex justify-center items-center bg-[#4CE5B1] cursor-pointer rounded-lg h-10 hover:bg-black hover:text-[#4CE5B1] transition-all duration-200 ease-in-out p-4" onClick={()=>setOpenSchool(!openSchool)}>
            Choose Your School
          </div>
          <div>
            { openSchool && nustSchools.map((school, index) => {
              return (
                <div
                  className="flex justify-center items-center bg-[#4CE5B1] cursor-pointer w-32 rounded-lg h-10 mb-1 hover:bg-black hover:text-[#4CE5B1] transition-all duration-200 ease-in-out"
                  key={index}
                >
                  {school}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center w-full gap-7">
          <label
            htmlFor="imageInput"
            className="relative cursor-pointer bg-gray-200 text-gray-700 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-300 transition duration-300 ease-in-out"
          >
            Select Image
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageChange}
            />
          </label>
          {image && (
            <div className="flex justify-center">
              <img
                src={image}
                alt="Uploaded Image"
                className=" max-w-32 h-auto"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <div className="flex justify-center items-center bg-[#4CE5B1] cursor-pointer w-32 rounded-lg h-10 hover:bg-black hover:text-[#4CE5B1] transition-all duration-200 ease-in-out" onClick={()=>setOpenRole(!openRole)}>
            Choose Role
          </div>
          {
            openRole && <div>
            <div className="flex justify-center items-center bg-[#4CE5B1] cursor-pointer w-32 rounded-lg h-10 mb-1 hover:bg-black hover:text-[#4CE5B1] transition-all duration-200 ease-in-out">
              Passenger
            </div>
            <div className="flex justify-center items-center bg-[#4CE5B1] cursor-pointer w-32 rounded-lg h-10 hover:bg-black hover:text-[#4CE5B1] transition-all duration-200 ease-in-out">
              Driver
            </div>
          </div>
          }
          
        </div>

        <div className="flex flex-col w-[70%] gap-2">
          <label className="text-white text-2xl font-semibold">
            Car Name
          </label>
          <input
            type="text"
            placeholder="Car Name"
            className=" h-12 rounded-[2rem] px-4 "
          />
        </div>

        <div className="flex flex-col w-[70%] gap-2">
          <label className="text-white text-2xl font-semibold">
            Model
          </label>
          <input
            type="text"
            placeholder="Model"
            className=" h-12 rounded-[2rem] px-4 "
          />
        </div>
        <div className="flex flex-col w-[70%] gap-2">
          <label className="text-white text-2xl font-semibold">
            Registration Number
          </label>
          <input
            type="text"
            placeholder="Registration Number"
            className=" h-12 rounded-[2rem] px-4 "
          />
        </div>
        <div className="flex flex-col w-[70%] gap-2">
          <label className="text-white text-2xl font-semibold">
            Color
          </label>
          <input
            type="text"
            placeholder="Color"
            className=" h-12 rounded-[2rem] px-4 "
          />
        </div>
        <button className="bg-[#4CE5B1] cursor-pointer w-[70%] rounded-[2rem] h-14 hover:bg-black hover:text-[#4CE5B1] transition-all duration-200 ease-in-out mt-4">Signup</button>
        <Link className="mb-10 text-[#4CE5B1] sm:text-white hover:text-[#4CE5B1] transition-all ease-in-out duration-150" to={'/'}>Already Have An Account?</Link>
      </form>
    </div>
  );
};

export default Signup;
