import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { backendUrl, mapBoxToken } from "../utils/backendUrl";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import RideOffer from "../components/RideOffer";
import { IoIosArrowDown, IoIosArrowUp  } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";
import { toastOptions } from "..";

mapboxgl.accessToken = mapBoxToken;

const GetRide = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const departureMarker = useRef(null);
  const destinationMarker = useRef(null);
  const isChoosingDepartureRef = useRef(true);
  const [lng, setLng] = useState(72.992268);
  const [lat, setLat] = useState(33.642782);
  const [zoom, setZoom] = useState(15);
  const [isDestinationSet, setIsDestinationSet] = useState(false);
  const [isDepartureSet, setIsDepartureSet] = useState(false);
  const [isChoosingDepartureStyle, setIsChoosingDepartureStyle] =  useState(true);
  const [isRidesOpen, setIsRidesOpen] =  useState(true);
  const [isReadyToFind, setIsReadyToFind] = useState(false);
  const [areRidesFound, setAreRidesFound] = useState(false);
  const [rides, setRides] = useState([]);

  useEffect(()=>localStorage.setItem("isDriverMode", JSON.stringify(false)));

  useEffect(() => {
    if (map.current) {
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    map.current.on("click", (e) => {
      const clickedLngLat = e.lngLat;
      if (isChoosingDepartureRef.current) {
        if (!departureMarker.current) {
          departureMarker.current = new mapboxgl.Marker({ color: "black" })
            .setLngLat([clickedLngLat.lng, clickedLngLat.lat])
            .addTo(map.current);
          setIsDepartureSet(true);
        } else {
          departureMarker.current.setLngLat([
            clickedLngLat.lng,
            clickedLngLat.lat,
          ]);
        }
      } else {
        if (!destinationMarker.current) {
          destinationMarker.current = new mapboxgl.Marker({ color: "blue" })
            .setLngLat([clickedLngLat.lng, clickedLngLat.lat])
            .addTo(map.current);
          setIsDestinationSet(true);
        } else {
          destinationMarker.current.setLngLat([
            clickedLngLat.lng,
            clickedLngLat.lat,
          ]);
        }
      }
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      placeholder: "Search for places",
      collapsed: true,
      bbox: [72.7878, 33.461, 73.2422, 33.8079],
      countries: "pk",
    });

    geocoder.on("result", (e) => {
      if (isChoosingDepartureRef.current) {
        if (!departureMarker.current) {
          departureMarker.current = new mapboxgl.Marker({ color: "black" })
            .setLngLat(e.result.center)
            .addTo(map.current);
          setIsDepartureSet(true);
        } else {
          departureMarker.current.setLngLat(e.result.center);
        }
      } else {
        if (!destinationMarker.current) {
          destinationMarker.current = new mapboxgl.Marker({ color: "blue" }) // Changed color to blue
            .setLngLat(e.result.center)
            .addTo(map.current);
          setIsDestinationSet(true);
        } else {
          destinationMarker.current.setLngLat(e.result.center);
        }
      }
    });

    map.current.addControl(geocoder);

    const radius = 20;
    const bbox = [
      lng - radius / (111.32 * Math.cos((lat * Math.PI) / 180)),
      lat - radius / 111.32,
      lng + radius / (111.32 * Math.cos((lat * Math.PI) / 180)),
      lat + radius / 111.32,
    ];

    map.current.setMaxBounds(bbox);

    const geocoderContainer = document.querySelector(
      ".mapboxgl-ctrl-geocoder .suggestions"
    );
    if (geocoderContainer) {
      geocoderContainer.style.zIndex = "15";
    }
  }, [lng, lat, zoom]);

  useEffect(() => {
    if (departureMarker.current && destinationMarker.current) {
      setIsReadyToFind(true);
    } else {
      setIsReadyToFind(false);
    }
  }, [isDepartureSet, isDestinationSet]);

  const handleDepartureButtonClick = (e) => {
    e.preventDefault();
    isChoosingDepartureRef.current = true;
    setIsChoosingDepartureStyle(true);
  };

  const handleDestinationButtonClick = (e) => {
    e.preventDefault();
    isChoosingDepartureRef.current = false;
    setIsChoosingDepartureStyle(false);
  };

  const handleArrow = (arrowType) => {
    if (arrowType == "up") {
      setIsRidesOpen(true);
    } else {
      setIsRidesOpen(false);
    }
  }

  const findRides = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.get(`${backendUrl}/api/rideListings/getRides/${departureMarker.current.getLngLat().lat}/${departureMarker.current.getLngLat().lng}/${destinationMarker.current.getLngLat().lat}/${destinationMarker.current.getLngLat().lng}`);

      if (data.length > 0) {
        setRides(data);
        setAreRidesFound(true);
        setIsRidesOpen(true);
        console.log(data);
      } else {
        console.log(data);
        setAreRidesFound(false);
        toast.error("No rides found right now, please try again later.", toastOptions);
      } 

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Navbar />
      <div className="mt-[10vh]">
        <div ref={mapContainer} className="map-container"></div>
        <div className="fixed top-[20vh] right-3 flex flex-col gap-2 items-end">
          <div
            className={`${
              isChoosingDepartureStyle
                ? "bg-[#4CE5B1] text-black p-4"
                : "bg-black text-white p-2"
            }  cursor-pointer rounded-3xl hover:bg-[#4CE5B1] hover:text-black hover:p-4 transition-all ease-in-out duration-150`}
            onClick={handleDepartureButtonClick}
          >
            Set Departure
          </div>
          <div
            className={`${
              !isChoosingDepartureStyle
                ? "bg-[#4CE5B1] text-black p-4"
                : "bg-white text-black p-2"
            } cursor-pointer rounded-3xl hover:bg-[#4CE5B1] hover:text-black hover:p-4 transition-all ease-in-out duration-150`}
            onClick={handleDestinationButtonClick}
          >
            Set Destination
          </div>
        </div>
        <div className="fixed bottom-20 flex justify-center w-full">
          <button
            className={` ${
              !isReadyToFind && "hidden"
            }  bg-[#4CE5B1] text-black p-4 rounded-3xl hover:text-white font-bold `}
          onClick={findRides}
          >
            Find Rides
          </button>
        </div>

        {
          areRidesFound && (
            <div className="fixed bottom-0 right-0 z-10  bg-black w-full text-white rounded-tl-3xl rounded-tr-3xl p-2 pb-6">
          <h2 className="text-center p-4 text-2xl font-bold ">RIDES</h2>
          {
            isRidesOpen ? <IoIosArrowDown size={30} color="#4CE5B1" className="absolute top-4 right-5 cursor-pointer" onClick={()=>handleArrow("down")}/> : <IoIosArrowUp size={30} color="#4CE5B1" className="absolute top-4 right-5 cursor-pointer" onClick={()=>handleArrow("up")}/>
          }
            <div className={`${isRidesOpen ? "max-h-[50vh]" : "max-h-0"} overflow-auto md:flex md:flex-row md:flex-wrap md:gap-4`}>

            {
              rides.map((ride, index)=>{
                return <RideOffer id={ride._id} image={ride.image} name={ride.driverName} car={ride.carName} date={ride.date} time={ride.time} passengers={ride.passengers} totalPassengers={ride.seatsAvailable} key={index} />
              })
            }

            </div>
        </div>
          )
        }
        
      </div>
    </>
  );
};

export default GetRide;
