import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toastOptions } from "..";
import { backendUrl } from "../utils/backendUrl";
import axios from "axios";

const initialStateUser = {
  name: "",
  cms: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  school: "",
  isDriver: false,
};

const Signup = () => {
  const [image, setImage] = useState(null);
  const [openSchool, setOpenSchool] = useState(false);
  const [user, setUser] = useState(initialStateUser);
  const [isCarOpen, setIsCarOpen] = useState(false);
  const [chooseSchool, setChooseSchool] = useState("Choose Your School");
  const navigate = useNavigate();
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

  const handleInputChangeUser = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      user.name === "" ||
      user.cms === "" ||
      user.email === "" ||
      user.password === "" ||
      user.confirmPassword === "" ||
      user.phone === "" ||
      user.school === ""
    ) {
      toast.error("Please fill in all fields.", toastOptions);
      return;
    }

    // Check CMS format
    const cmsRegex = /^\d{6}$/;
    if (!cmsRegex.test(user.cms)) {
      toast.error("CMS ID should be a 6-digit number.", toastOptions);
      return;
    }

    // Check email format
    const emailRegex =
      /^[a-zA-Z]+\.[a-zA-Z0-9]+(\d{2})[a-zA-Z]+@([a-zA-Z]+)\.edu\.pk$/;
    if (!emailRegex.test(user.email)) {
      toast.error("Please enter a valid NUST email address.", toastOptions);
      return;
    }

    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    const isPasswordValid = regex.test(user.password);
    if (!isPasswordValid) {
      toast.error(
        "Password should contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.",
        toastOptions
      );
      return;
    }

    // Check if passwords match
    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match.", toastOptions);
      return;
    }

    // Check phone number format
    const phoneRegex = /^03\d{9}$/;
    if (!phoneRegex.test(user.phone)) {
      toast.error("Please enter a valid phone number.", toastOptions);
      return;
    }

    if (!image) {
      toast.error("Please select an image.", toastOptions);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("email", user.email);
      formData.append("username", user.name);
      formData.append("password", user.password);
      formData.append("phone", user.phone);
      formData.append("school", user.school);
      formData.append("isDriver", user.isDriver);
      formData.append("cms", user.cms);
      
      const { data } = await axios.post(
        `${backendUrl}/api/auth/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(
          `An email has been sent to the address ${user.email}. Please verify your email.`,
          toastOptions
        );
        navigate("/");
      } else {
        toast.error(data.error, toastOptions);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(()=>{
    if(!navigator.onLine){
      toast.error("You do not have an internet connection.", toastOptions);
    }
  },[])

  return (
    <div className="bg-black pt-3 ">
      <img
        src="/signupLogo.png"
        className="max-w-[240px] sm:max-w-[70%] mx-auto md:min-w-[100vh]"
        alt="logo"
      />
      <h3 className="text-white text-center text-4xl font-semibold mb-10">
        Signup
      </h3>

      <form
        className="flex flex-col lg:flex-row lg:flex-wrap lg:justify-around justify-center items-center gap-y-4  max-w-[730px] lg:max-w-screen-lg mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col w-[70%] lg:w-[45%] gap-2">
          <label className="text-white text-2xl font-semibold">Name</label>
          <input
            type="text"
            placeholder="Name"
            className=" h-12 rounded-[2rem] px-4 "
            name="name"
            value={user.name}
            onChange={handleInputChangeUser}
          />
        </div>
        <div className="flex flex-col w-[70%] lg:w-[45%] gap-2">
          <label className="text-white text-2xl font-semibold">CMS</label>
          <input
            type="text"
            placeholder="CMS ID"
            className=" h-12 rounded-[2rem] px-4 "
            name="cms"
            value={user.cms}
            onChange={handleInputChangeUser}
          />
        </div>
        <div className="flex flex-col w-[70%] lg:w-[45%] gap-2">
          <label className="text-white text-2xl font-semibold">Email</label>
          <input
            type="email"
            placeholder="NUST Email"
            className=" h-12 rounded-[2rem] px-4 "
            name="email"
            value={user.email}
            onChange={handleInputChangeUser}
          />
        </div>
        <div className="flex flex-col w-[70%] lg:w-[45%] gap-2">
          <label className="text-white text-2xl font-semibold">Password</label>
          <input
            type="password"
            placeholder="Password"
            className=" h-12 rounded-[2rem] px-4 "
            name="password"
            value={user.password}
            onChange={handleInputChangeUser}
          />
        </div>
        <div className="flex flex-col w-[70%] lg:w-[45%] gap-2">
          <label className="text-white text-2xl font-semibold">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            className=" h-12 rounded-[2rem] px-4 "
            name="confirmPassword"
            value={user.confirmPassword}
            onChange={handleInputChangeUser}
          />
        </div>
        <div className="flex flex-col w-[70%] lg:w-[45%] gap-2">
          <label className="text-white text-2xl font-semibold">
            Contact No.
          </label>
          <input
            type="text"
            placeholder="03XXXXXXXXX"
            className=" h-12 rounded-[2rem] px-4 "
            name="phone"
            value={user.phone}
            onChange={handleInputChangeUser}
          />
        </div>

        <div className="flex gap-3 lg:w-[45%]">
          <div
            className="flex justify-center items-center bg-[#4CE5B1] cursor-pointer rounded-lg h-10 hover:bg-black hover:text-[#4CE5B1] transition-all duration-200 ease-in-out p-4 lg:ml-[25%] lg:my-10"
            onClick={() => setOpenSchool(!openSchool)}
          >
            {chooseSchool}
          </div>
          <div>
            {openSchool &&
              nustSchools.map((school, index) => {
                return (
                  <div
                    className={`flex justify-center items-center bg-[#4CE5B1] cursor-pointer w-32 rounded-lg h-10 mb-1 hover:bg-black hover:text-[#4CE5B1] transition-all duration-200 ease-in-out ${
                      user.school == school &&
                      "bg-black text-[#4CE5B1] border-2 border-[#4CE5B1]"
                    } `}
                    key={index}
                    onClick={() => {
                      setUser({ ...user, school });
                      setOpenSchool(false);
                      setChooseSchool(school);
                    }}
                  >
                    {school}
                  </div>
                );
              })}
          </div>
        </div>

        <div className="flex items-center justify-center w-full gap-7 lg:w-[45%]">
          <label
            htmlFor="imageInput"
            className="relative cursor-pointer bg-gray-200 text-gray-700 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-300 transition duration-300 ease-in-out lg:my-10"
          >
            Select Image
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              name="image"
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

        <button
          className="bg-[#4CE5B1] cursor-pointer w-[70%] lg:w-[50%] lg:mx-[10%] rounded-[2rem] h-14 hover:bg-black hover:text-[#4CE5B1] hover:border-2 hover:border-[#4CE5B1] transition-all duration-200 ease-in-out mt-4"
          type="submit"
        >
          Signup
        </button>
        <Link
          className="mb-10 lg:mx-[25%] text-[#4CE5B1] sm:text-white hover:text-[#4CE5B1] transition-all ease-in-out duration-150"
          to={"/"}
        >
          Already Have An Account?
        </Link>
      </form>
    </div>
  );
};

export default Signup;
