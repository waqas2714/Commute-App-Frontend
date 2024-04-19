import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { toastOptions } from "..";
import axios from "axios";
import { backendUrl } from "../utils/backendUrl";
import Loader from "../components/Loader";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  function checkPasswordStrength(password) {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    const meetsAllConditions =
      hasUppercase && hasLowercase && hasDigit && hasSpecialChar;

    return meetsAllConditions;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password === "" || confirmPassword === "") {
        return toast.error("Please fill both fields.", toastOptions);
      }

      const isPasswordValid = checkPasswordStrength(password);
      if (!isPasswordValid) {
        toast.error(
          "Password should contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.",
          toastOptions
        );
        return;
      }

      if (password !== confirmPassword) {
        return toast.error("Passwords should match.", toastOptions);
      }

      setIsLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/auth/resetPassword`,
        { password, token }
      );

      if (!data.success) {
        setIsLoading(false);
        return toast.error(data.error, toastOptions);
      }

      setIsLoading(false);
      toast.success(data.message, toastOptions);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!navigator.onLine) {
      toast.error("You do not have an internet connection.", toastOptions);
    }
  }, []);

  return (
    <>
    {
      isLoading && <Loader />
    }

    <div className="bg-black min-h-screen pb-8">
      <img
        src="/resetPasswordLogo.png"
        alt="logo"
        className="sm:h-[100vh] mx-auto"
      />

      <form
        className="mx-auto flex flex-col items-center gap-3 text-white w-screen  max-w-[550px] sm:w-[75vw] md:w-[50vw]"
        onSubmit={handleSubmit}
      >
        <h2 className=" text-4xl font-semibold ">Reset Password</h2>

        <div className="flex flex-col w-[70%] gap-4">
          <label className="text-white text-2xl font-semibold mt-6">
            New Password
          </label>
          <input
            type="password"
            placeholder="Password"
            className="text-black h-12 rounded-[2rem] px-4 "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col w-[70%] gap-4">
          <label className="text-white text-2xl font-semibold mt-6">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            className="text-black h-12 rounded-[2rem] px-4 "
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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

    </>
  );
};

export default ResetPassword;
