import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaCar, FaInfo } from "react-icons/fa";
import { GoHistory } from "react-icons/go";
import { GiArchiveRegister, GiMountainRoad } from "react-icons/gi";
import { BiPowerOff } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { RiMapPinTimeFill } from "react-icons/ri";
import { GrChapterPrevious } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  const [isDriver, setIsDriver] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsDriver(() => JSON.parse(localStorage.getItem("user")).isDriver);
  }, []);


  return (
    <>
      <div className="fixed top-0 w-[100vw] z-30 bg-[#161616] flex items-center justify-around pb-1">
        <img src="nameLogo.png" alt="logo" className="h-[10vh]" />

        <RxHamburgerMenu size={35} color="white" className="cursor-pointer" onClick={()=>setIsSidebarOpen(!isSidebarOpen)}/>
      </div>

      {isSidebarOpen && (
        <>
          {/* Backdrop */}
          <div className="h-[90vh] w-[100vw] fixed top-[10vh] z-10 bg-[rgb(0,0,0,0.7)]"></div>
          </>
      )}
          <nav className={`flex flex-col gap-4 bg-[#161616] text-[#4CE5B1] font-semibold h-[90vh] w-[50vw] min-w-[260px] md:w-[25vw] p-4 text-lg fixed top-[10vh] z-20 ${isSidebarOpen ? "nav-open" : "nav-close"}  transition-all ease-in-out duration-150`}>
            {isDriver ? (
              // Driver Links
              <>
                <NavLink
                  exact 
                  to="/"
                  className={({isActive}) => isActive ? "nav-link bg-[#4CE5B1] text-white flex justify-between": "nav-link flex justify-between" }
                >
                  <p>Add Ride!</p>
                  <IoMdAdd size={25} />
                </NavLink>
                <NavLink
                  exact 
                  to="/"
                  className={({isActive}) => isActive ? "nav-link bg-[#4CE5B1] text-white flex justify-between": "nav-link flex justify-between" }
                >
                  <p>Current Rides</p>
                  <RiMapPinTimeFill size={25} />
                </NavLink>
                <NavLink
                  exact 
                  to="/"
                  className={({isActive}) => isActive ? "nav-link bg-[#4CE5B1] text-white flex justify-between": "nav-link flex justify-between" }
                >
                  <p>Previous Rides</p>
                  <GrChapterPrevious size={25} />
                </NavLink>
                <NavLink
                  exact 
                  to="/"
                  className={({isActive}) => isActive ? "nav-link bg-[#4CE5B1] text-white flex justify-between": "nav-link flex justify-between" }
                >
                  <p>Profile</p>
                  <CgProfile size={25} />
                </NavLink>
              </>
            ) : (
              //Passenger Links
              <>
                <NavLink
                  exact 
                  to="/getRide"
                  className={({isActive}) => isActive ? "nav-link bg-[#4CE5B1] text-white flex justify-between": "nav-link flex justify-between" }
                >
                  <p>Get A Ride</p>
                  <FaCar size={25} />
                </NavLink>
                <NavLink
                  exact 
                  to="/"
                  className={({isActive}) => isActive ? "nav-link bg-[#4CE5B1] text-white flex justify-between": "nav-link flex justify-between" }
                >
                  <p>History</p>
                  <GoHistory size={25} />
                </NavLink>
                <NavLink
                  exact 
                  to="/"
                  className={({isActive}) => isActive ? "nav-link bg-[#4CE5B1] text-white flex justify-between": "nav-link flex justify-between" }
                >
                  <p>Register as Driver</p>
                  <GiArchiveRegister size={25} />
                </NavLink>
                <NavLink
                  exact 
                  to="/"
                  className={({isActive}) => isActive ? "nav-link bg-[#4CE5B1] text-white flex justify-between": "nav-link flex justify-between" }
                >
                  <p>Drive!</p>
                  <GiMountainRoad size={25} />
                </NavLink>
              </>
            )}

            {/* General Links */}

            <NavLink
              exact 
                  to="/"
                  className={({isActive}) => isActive ? "nav-link bg-[#4CE5B1] text-white flex justify-between": "nav-link flex justify-between" }
            >
              <p>About Us</p>
              <FaInfo size={20} />
            </NavLink>
            <btn className="cursor-pointer hover:text-xl hover:bg-red-500 transition-all ease-out duration-150 hover:text-white p-4 flex justify-between">
              <p>Log Out</p>
              <BiPowerOff size={25} />
            </btn>
          </nav>
        
    </>
  );
};

export default Navbar;
