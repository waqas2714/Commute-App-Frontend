import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Passenger from "../components/Passenger";
import axios from "axios";

import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import mapboxgl from "mapbox-gl";
import { toastOptions } from "..";
import { CiEdit } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";
import { MdOutlinePersonRemoveAlt1 } from "react-icons/md";
import { GoKebabHorizontal } from "react-icons/go";
import { IoCheckmarkDone } from "react-icons/io5";

mapboxgl.accessToken = process.env.MAPBOX_TOKEN;

const ListingDetail = () => {
  const [details, setDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPassenger, setIsPassenger] = useState(false);
  const [lng, setLng] = useState(72.992268);
  const [lat, setLat] = useState(33.642782);
  const [isRequested, setIsRequested] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDriverOptions, setOpenDriverOptions] = useState(false);
  const { id } = useParams();
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const pickupPointMapContainer = useRef(null);
  const pickupPointMap = useRef(null);
  const routeMapContainer = useRef(null);
  const routeMap = useRef(null);
  const navigate = useNavigate();

  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  const revertDateFormat = (formattedDate) => {
    const [day, month, year] = formattedDate.split("-");
    const date = new Date(`${year}-${month}-${day}`);
    const isoString = date.toISOString();
    return isoString.slice(0, isoString.length - 1);
  };

  const getData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.BACKEND_URL}/api/rideListings/getListing/${id}/${userId}`
      );
      if (!data.listing.success) {
        toast.error(data.error);
        return;
      }
      data.listing.listing.date = dateFormat(data.listing.listing.date);
      setDetails(data.listing.listing);
      setIsRequested(data.isRequested);
      setIsLoading(false);
      data.listing.listing.passengers.forEach((passenger) => {
        // If passenger's _id matches userId, set isPassenger to true
        if (passenger.userId == userId) {
          setIsPassenger(true);
          return; // Exit the loop early since we found a match
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getRoute = async (dep, dest) => {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${dep.long},${dep.lat};${dest.long},${dest.lat}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: "GET" }
    );

    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const geojson = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: route,
      },
    };
    // if the route already exists on the map, we'll reset it using setData
    if (routeMap.current.getSource("route")) {
      routeMap.current.getSource("route").setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
      routeMap.current.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: geojson,
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#4CE5B1",
          "line-width": 4,
          "line-opacity": 1,
        },
      });
    }
  };

  const makeRequest = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.BACKEND_URL}/api/rideListings/addRideRequest`,
        { userId, listingId: id }
      );

      if (!data.success) {
        return toast.error(data.error, toastOptions);
      }

      setIsRequested(true);
      toast.success("Request Sent!", toastOptions);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        details.departure === "" ||
        details.destination === "" ||
        details.time === "" ||
        details.date === "" ||
        details.seatsAvailable === 0
      ) {
        return toast.error(
          "Please provide all the details of the ride.",
          toastOptions
        );
      }

      // Check if the date is not in the past
      const currentDate = new Date();
      const selectedDate = new Date(`${details.date}T${details.time}`);

      if (selectedDate < currentDate) {
        return toast.error("Please select a valid date/time.", toastOptions);
      }

      const updatedListing = {
        departure: details.departure,
        destination: details.destination,
        date: details.date,
        time: details.time,
        seatsAvailable: details.seatsAvailable,
      };

      const { data } = await axios.put(
        `${process.env.BACKEND_URL}/api/rideListings/updateListing/${id}`,
        updatedListing
      );

      if (!data.success) {
        return toast.error(data.error, toastOptions);
      }

      toast.success("Listing Updated Successfully!", toastOptions);

      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const removeMe = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(
        `${process.env.BACKEND_URL}/api/rideListings/removePassenger/${id}/${userId}`
      );

      if (!data.success) {
        return toast.error(data.error, toastOptions);
      }

      toast.success("You left that ride.", toastOptions);
      navigate("/myRequests");
    } catch (error) {
      console.log(error);
    }
  };

  const finishRide = async ()=>{
    try {
      console.log(id);
      const {data} = await axios.delete(`${process.env.BACKEND_URL}/api/rideListings/finishRide/${id}`)

      if (!data.success) {
        return toast.error(data.error, toastOptions);
      }

      toast.success("Ride Finished!", toastOptions);
      navigate('/addRide');
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    if(!navigator.onLine){
      const mode = JSON.parse(localStorage.getItem("isDriverMode"));
      if (mode) {
        navigate('/currentRides');
      } else {
        navigate("/myRequests");
      }
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
        const response = await axios.get(`${process.env.BACKEND_URL}/api/auth/verifyToken`, {
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


  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (
      !isLoading &&
      details.pickupPoint &&
      pickupPointMap.current === null &&
      pickupPointMapContainer.current
    ) {
      pickupPointMap.current = new mapboxgl.Map({
        container: pickupPointMapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [
          parseFloat(details.pickupPoint.long),
          parseFloat(details.pickupPoint.lat),
        ],
        zoom: 12,
      });

      new mapboxgl.Marker({
        color: 'black' 
      })
        .setLngLat([
          parseFloat(details.pickupPoint.long),
          parseFloat(details.pickupPoint.lat),
        ])
        .addTo(pickupPointMap.current);

      // Create a button element
      const button = document.createElement("button");
      button.textContent = "Go to Pickup Point";
      button.className = "mapboxgl-ctrl-icon btn-style";
      button.style.position = "absolute"; // Set absolute positioning
      button.style.top = "10px"; // Adjust top position as needed
      button.style.left = "10px"; // Adjust left position as needed
      button.style.zIndex = "1"; // Ensure the button appears above the pickupPointMap

      // Add button to the pickupPointMap container
      pickupPointMapContainer.current.appendChild(button);

      // Add event listener to the button
      button.addEventListener("click", () => {
        pickupPointMap.current.flyTo({
          center: [
            parseFloat(details.pickupPoint.long),
            parseFloat(details.pickupPoint.lat),
          ],
          zoom: 15, // Zoom level
          essential: true, // This animation is considered essential with respect to prefers-reduced-motion
        });
      });

      const radius = 20;
      const bbox = [
        lng - radius / (111.32 * Math.cos((lat * Math.PI) / 180)),
        lat - radius / 111.32,
        lng + radius / (111.32 * Math.cos((lat * Math.PI) / 180)),
        lat + radius / 111.32,
      ];

      pickupPointMap.current.setMaxBounds(bbox);
    }

    if (
      !isLoading &&
      details.pickupPoint &&
      routeMap.current === null &&
      routeMapContainer.current
    ) {
      routeMap.current = new mapboxgl.Map({
        container: routeMapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [
          parseFloat(details.pickupPoint.long),
          parseFloat(details.pickupPoint.lat),
        ],
        zoom: 12,
      });

      // Add marker for pickup point
      new mapboxgl.Marker({
        color : 'black'
      })
        .setLngLat([
          parseFloat(details.pickupPoint.long),
          parseFloat(details.pickupPoint.lat),
        ])
        .addTo(routeMap.current);
      

      // Add marker for destination
      new mapboxgl.Marker({
      color : "gray"  
      })
        .setLngLat([parseFloat(details.longdest), parseFloat(details.latdest)])
        .addTo(routeMap.current);

      const radius = 20;
      const bbox = [
        lng - radius / (111.32 * Math.cos((lat * Math.PI) / 180)),
        lat - radius / 111.32,
        lng + radius / (111.32 * Math.cos((lat * Math.PI) / 180)),
        lat + radius / 111.32,
      ];

      routeMap.current.setMaxBounds(bbox);

      // Fetch route using Mapbox Directions API
      routeMap.current.on("load", () => {
        getRoute(details.pickupPoint, details.pickupPoint);

        const end = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: [
                  parseFloat(details.longdest),
                  parseFloat(details.latdest),
                ],
              },
            },
          ],
        };
        getRoute(details.pickupPoint, {
          long: details.longdest,
          lat: details.latdest,
        });
      });
    }
  }, [isLoading, details]);

  return (
    <>
      <Navbar />
      {!isLoading ? (
        <div className="mt-[10vh] pt-8 bg-black">
          {/* Modal and  Backdrop for editing */}
          {isModalOpen && (
            <div
              className="flex justify-center items-center h-[90vh] w-[100vw] fixed top-[10vh] z-[30] bg-[rgb(0,0,0,0.7)]"
              onClick={() => setIsModalOpen(false)}
            >
              <div
                className="relative bg-black p-4 h-[90%] sm:h-[65%] w-[95%] max-w-[1028px]"
                onClick={(e) => e.stopPropagation()}
              >
                <h1 className="text-white text-center text-2xl font-semibold">
                  Ride Info
                </h1>
                <RxCross1
                  size={25}
                  className="absolute top-4 right-4 text-white cursor-pointer"
                  onClick={() => setIsModalOpen(false)}
                />

                <form
                  className="flex flex-col sm:flex-row  sm:flex-wrap sm:gap-x-6 gap-3"
                  onSubmit={handleSubmit}
                >
                  <div className="sm:w-[45%]">
                    <h2 className="text-white text-lg ">Departure</h2>
                    <input
                      type="text"
                      name="departure"
                      value={details.departure}
                      onChange={handleInputChange}
                      placeholder="Name Departure Location"
                      className="w-full h-9  p-2 border-0 outline-none "
                    />
                  </div>
                  <div className="sm:w-[45%]">
                    <h2 className="text-white text-lg ">Destination</h2>
                    <input
                      type="text"
                      name="destination"
                      value={details.destination}
                      onChange={handleInputChange}
                      placeholder="Name Destination Location"
                      className="w-full h-9  p-2 border-0 outline-none "
                    />
                  </div>
                  <div className="sm:w-[45%]">
                    <h2 className="text-white text-lg ">Date</h2>
                    <input
                      type="date"
                      name="date"
                      value={details.date}
                      onChange={handleInputChange}
                      className="w-full h-9  p-2 border-0 outline-none "
                    />
                  </div>
                  <div className="sm:w-[45%]">
                    <h2 className="text-white text-lg ">Time</h2>
                    <input
                      type="time"
                      name="time"
                      value={details.time}
                      onChange={handleInputChange}
                      className="w-full h-9  p-2 border-0 outline-none "
                    />
                  </div>
                  <div className="sm:w-full">
                    <h2 className="text-white text-lg ">Seats Available</h2>
                    <input
                      type="number"
                      name="seatsAvailable"
                      value={details.seatsAvailable}
                      onChange={handleInputChange}
                      className="w-full sm:w-[45%] h-9  p-2 border-0 outline-none "
                      min={1}
                      max={10}
                    />
                  </div>

                  <button
                    className="bg-[#4CE5B1] text-black p-1 rounded-lg sm:rounded-xl text-lg hover:text-white sm:hover:px-4 transition-all ease-in-out duration-150 font-bold sm:ml-[45%] sm:px-3 mt-3"
                    type="submit"
                  >
                    Edit
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="relative">
            <h1 className="text-center text-white font-extrabold text-4xl mb-4">
              DETAILS
            </h1>
            {isPassenger && (
              <MdOutlinePersonRemoveAlt1
                size={35}
                className="absolute right-5 sm:right-28 top-0 text-white hover:text-red-500 transition-all ease-in-out duration-150 cursor-pointer"
                onClick={removeMe}
              />
            )}
            {details.driverId._id === userId && (
              <div className="absolute right-2 top-0 z-[15]">
                <GoKebabHorizontal
                  size={40}
                  className="text-white hover:bg-[#4CE5B1] p-1 transition-all ease-in-out duration-150 cursor-pointer"
                  onClick={() => setOpenDriverOptions(!openDriverOptions)}
                />
                {openDriverOptions && (
                  <div className="flex flex-col absolute left-[-50px] w-fit bg-[#161616]">
                    <CiEdit
                      size={50}
                      className="text-white p-2 border border-black hover:text-[#4CE5B1] transition-all ease-in-out duration-150 cursor-pointer"
                      onClick={() => setIsModalOpen(true)}
                    />
                    <IoCheckmarkDone
                      size={50}
                      className="text-white p-2 border border-black hover:text-[#4CE5B1] transition-all ease-in-out duration-150 cursor-pointer"
                      onClick={finishRide}
                    />
                  </div>
                )}
              </div>
            )}
            {isRequested ? (
              <button
                className={
                  details.driverId._id !== userId && !isPassenger
                    ? "absolute right-0 sm:right-12 top-1 text-lg font-semibold p-1 bg-gray-500"
                    : "hidden"
                }
                disabled
              >
                Requested
              </button>
            ) : (
              <button
                className={
                  details.driverId._id !== userId && !isPassenger
                    ? "absolute right-2 sm:right-12 top-0 text-lg fond font-semibold p-2 bg-[#4CE5B1]"
                    : "hidden"
                }
                onClick={makeRequest}
              >
                Request
              </button>
            )}
          </div>

          <div className="sm:flex sm:flex-row-reverse sm:justify-around sm:items-center">
            <div className="px-4">
              <h2 className="font-bold text-2xl text-[#4CE5B1]">
                Pickup Point:
              </h2>
              <div
                ref={pickupPointMapContainer}
                className="relative h-[50vh] sm:w-[50vw] mt-4"
              ></div>
            </div>
            <Link
              className="block mt-8"
              to={`/driverProfile/${details.driverId._id}`}
            >
              <img
                src={details.driverId.image}
                alt="driver's image"
                className="w-[75vw] max-w-[250px] mx-auto rounded-full"
              />
            </Link>
          </div>

          <div className="sm:flex sm:flex-wrap sm:gap-2 pb-4 mt-8">
            <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
              <h2 className="font-bold text-2xl text-[#4CE5B1]">Driver:</h2>
              <p className="text-white text-xl">{details.driverId.username}</p>
            </div>
            <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
              <h2 className="font-bold text-2xl text-[#4CE5B1]">School:</h2>
              <p className="text-white text-xl">{details.driverId.school}</p>
            </div>

            {isPassenger && (
              <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
                <h2 className="font-bold text-2xl text-[#4CE5B1]">Contact:</h2>
                <p className="text-white text-xl">{details.driverId.phone}</p>
              </div>
            )}

            <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
              <h2 className="font-bold text-2xl text-[#4CE5B1]">Car:</h2>
              <p className="text-white text-xl">
                {details.driverId.carDetails.name}
              </p>
            </div>
            <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
              <h2 className="font-bold text-2xl text-[#4CE5B1]">
                Model/Color:
              </h2>
              <p className="text-white text-xl">
                {details.driverId.carDetails.model}/
                {details.driverId.carDetails.color}
              </p>
            </div>
            <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
              <h2 className="font-bold text-2xl text-[#4CE5B1]">Departure:</h2>
              <p className="text-white text-xl">{details.departure}</p>
            </div>
            <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
              <h2 className="font-bold text-2xl text-[#4CE5B1]">
                Destination:
              </h2>
              <p className="text-white text-xl">{details.destination}</p>
            </div>
            <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
              <h2 className="font-bold text-2xl text-[#4CE5B1]">Date:</h2>
              <p className="text-white text-xl">{details.date}</p>
            </div>
            <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
              <h2 className="font-bold text-2xl text-[#4CE5B1]">Time:</h2>
              <p className="text-white text-xl">{details.time}</p>
            </div>
            <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
              <h2 className="font-bold text-2xl text-[#4CE5B1]">
                Max Passengers:
              </h2>
              <p className="text-white text-xl">{details.seatsAvailable}</p>
            </div>
            <div className="flex gap-2 items-baseline p-4 sm:w-[40vw] md:w-[30vw]">
              <h2 className="font-bold text-2xl text-[#4CE5B1]">Seats Left:</h2>
              <p className="text-white text-xl">
                {details.seatsAvailable - details.passengers.length}
              </p>
            </div>
            <h2 className="font-bold text-2xl p-4 text-[#4CE5B1] w-[100vw]">
              Passengers:
            </h2>
            {details.passengers.length > 0 ? (
              <div className="w-[100vw] sm:flex sm:flex-wrap sm:gap-y-2 sm:gap-x-8 p-4">
                {details.passengers.map((passenger, index) => {
                  return (
                    <Passenger
                      name={passenger.name}
                      photo={passenger.photo}
                      school={passenger.school}
                      isDriver={details.driverId._id == userId}
                      listingId={id}
                      passengerId={passenger.userId}
                      key={index}
                      setDetails={setDetails}
                    />
                  );
                })}
              </div>
            ) : (
              <h2 className="font-semibold text-2xl p-4 text-white w-[100vw] text-center">
                No Passengers Yet!
              </h2>
            )}

            <h2 className="font-bold text-2xl p-4 text-[#4CE5B1] w-[100vw]">
              Possible Route:
            </h2>
            <div
              className="h-[50vh] w-[100vw] md:h-[70vh] sm:mx-4"
              ref={routeMapContainer}
            ></div>
          </div>
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
};

export default ListingDetail;
