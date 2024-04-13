import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaCar, FaInfo, FaMapMarkedAlt, FaBus } from "react-icons/fa";
import { GiArchiveRegister, GiMountainRoad } from "react-icons/gi";
import { BiPowerOff } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { RiMapPinTimeFill } from "react-icons/ri";
import { GrChapterPrevious } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";
import { IoChatboxSharp } from "react-icons/io5";

const Navbar = () => {
  const [isDriver, setIsDriver] = useState(false);
  const [isDriverMode, setIsDriverMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const navigate = useNavigate();

  useEffect(() => {
    setIsDriver(() => JSON.parse(localStorage.getItem("user")).isDriver);
    setIsDriverMode(() => JSON.parse(localStorage.getItem("isDriverMode")));
  }, []);

  return (
    <>
      <div className="fixed top-0 w-[100vw] z-50 bg-black flex items-center justify-around pb-1">
        <img src="/nameLogo.png" alt="logo" className="h-[10vh]" />

        <RxHamburgerMenu
          size={35}
          color="white"
          className="cursor-pointer"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>

      {isSidebarOpen && (
        <>
          {/* Backdrop */}
          <div className="h-[90vh] w-[100vw] fixed top-[10vh] z-40 bg-[rgb(0,0,0,0.7)]" onClick={()=>setIsSidebarOpen(false)}></div>
        </>
      )}
      <nav
        className={`flex flex-col gap-4 bg-black text-[#4CE5B1] font-semibold h-[90vh] w-[50vw] min-w-[260px] md:w-[25vw] p-4 text-lg fixed top-[10vh] z-50 ${
          isSidebarOpen ? "nav-open" : "nav-close"
        }  transition-all ease-in-out duration-150`}
      >
        {isDriverMode ? (
          // Driver Links
          <>
            <NavLink
              
              to="/addRide"
              className={({ isActive }) =>
                isActive
                  ? "nav-link bg-[#4CE5B1] text-white flex justify-between"
                  : "nav-link flex justify-between"
              }
            >
              <p>Add Ride!</p>
              <IoMdAdd size={25} />
            </NavLink>
            <NavLink
              
              to="/currentRides"
              className={({ isActive }) =>
                isActive
                  ? "nav-link bg-[#4CE5B1] text-white flex justify-between"
                  : "nav-link flex justify-between"
              }
            >
              <p>Current Rides</p>
              <RiMapPinTimeFill size={25} />
            </NavLink>
            <NavLink
              
              to={`/driverProfile/${userId}`}
              className={({ isActive }) =>
                isActive
                  ? "nav-link bg-[#4CE5B1] text-white flex justify-between"
                  : "nav-link flex justify-between"
              }
            >
              <p>Profile</p>
              <CgProfile size={25} />
            </NavLink>

            <NavLink
              
              to="/getRide"
              className={({ isActive }) =>
                isActive
                  ? "nav-link bg-[#4CE5B1] text-white flex justify-between"
                  : "nav-link flex justify-between"
              }
            >
              <p>Passenger Mode</p>
              <FaBus size={25} />
            </NavLink>
          </>
        ) : (
          //Passenger Links
          <>
            <NavLink
              
              to="/getRide"
              className={({ isActive }) =>
                isActive
                  ? "nav-link bg-[#4CE5B1] text-white flex justify-between"
                  : "nav-link flex justify-between"
              }
            >
              <p>Get A Ride</p>
              <FaCar size={25} />
            </NavLink>

            <NavLink
              
              to="/myRequests"
              className={({ isActive }) =>
                isActive
                  ? "nav-link bg-[#4CE5B1] text-white flex justify-between"
                  : "nav-link flex justify-between"
              }
            >
              <p>My Requests</p>
              <FaMapMarkedAlt size={25} />
            </NavLink>
            
            {isDriver ? (
              <NavLink
                
                to="/addRide"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link bg-[#4CE5B1] text-white flex justify-between"
                    : "nav-link flex justify-between"
                }
                onClick={()=>setIsDriverMode(true)}
              >
                <p>Drive!</p>
                <GiMountainRoad size={25} />
              </NavLink>
            ) : (
              <NavLink
                
                to="/signupDriver"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link bg-[#4CE5B1] text-white flex justify-between"
                    : "nav-link flex justify-between"
                }
              >
                <p>Register as Driver</p>
                <GiArchiveRegister size={25} />
              </NavLink>
            )}
          </>
        )}

        {/* General Links */}
        <NavLink 
          to='/chat'
          className={({ isActive }) =>
            isActive
              ? "nav-link bg-[#4CE5B1] text-white flex justify-between"
              : "nav-link flex justify-between"
          }
        >
          
          <p>Chat</p>
          <IoChatboxSharp size={25}/>
        </NavLink>
        {/* <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "nav-link bg-[#4CE5B1] text-white flex justify-between"
              : "nav-link flex justify-between"
          }
        >
          <p>About Us</p>
          <FaInfo size={20} />
        </NavLink> */}
        <button className="cursor-pointer hover:text-xl hover:bg-red-500 transition-all ease-out duration-150 hover:text-white p-4 flex justify-between" onClick={(e)=>{
          e.preventDefault();
          localStorage.clear();
          navigate('/');
        }}> 
          <p>Log Out</p>
          <BiPowerOff size={25} />
        </button>
      </nav>
    </>
  );
};

export default Navbar;
