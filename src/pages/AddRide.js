import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { backendUrl, mapBoxToken } from "../utils/backendUrl";
import { RxCross1 } from "react-icons/rx";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import { toast } from "react-toastify";
import { toastOptions } from "..";
import { useNavigate } from "react-router-dom";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { IoSearchOutline } from "react-icons/io5";

mapboxgl.accessToken = mapBoxToken;

const initialState = {
  departure: "",
  destination: "",
  time: "",
  date: "",
  seatsAvailable: 0,
  pickupPoint: { long: "", lat: "" },
  driverId: "",
  longdest: "",
  latdest: "",
  longdep: "",
  latdep: "",
};

const AddRide = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const departureMarker = useRef(null);
  const destinationMarker = useRef(null);
  const isChoosingDepartureRef = useRef(true);
  const [lng, setLng] = useState(72.992268);
  const [lat, setLat] = useState(33.642782);
  const [zoom, setZoom] = useState(15);
  const [isDestinationSet, setIsDestinationSet] = useState([]);
  const [isDepartureSet, setIsDepartureSet] = useState([]);
  const [isChoosingDepartureStyle, setIsChoosingDepartureStyle] =
    useState(true);
  const [isReadyToAdd, setIsReadyToAdd] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listingData, setListingData] = useState(initialState);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [address, setAddress] = useState("");
  const searchOptions = {    
    locationRestriction: {
      north: 33.72779793901814, 
      south: 33.50455160136669, 
      east: 73.2195682300637, 
      west: 72.8055335597914  
    }
  }
  

  const navigate = useNavigate();
  const driverId = JSON.parse(localStorage.getItem("user"))._id;

  useEffect(() => localStorage.setItem("isDriverMode", JSON.stringify(true)));

  useEffect(() => {
    if (map.current) {
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
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
          setIsDepartureSet([clickedLngLat.lng, clickedLngLat.lat]);
        } else {
          departureMarker.current.setLngLat([
            clickedLngLat.lng,
            clickedLngLat.lat,
          ]);
          setIsDepartureSet([clickedLngLat.lng, clickedLngLat.lat]);
        }
      } else {
        if (!destinationMarker.current) {
          destinationMarker.current = new mapboxgl.Marker({ color: "gray" })
            .setLngLat([clickedLngLat.lng, clickedLngLat.lat])
            .addTo(map.current);
          setIsDestinationSet([clickedLngLat.lng, clickedLngLat.lat]);
        } else {
          destinationMarker.current.setLngLat([
            clickedLngLat.lng,
            clickedLngLat.lat,
          ]);
          setIsDestinationSet([clickedLngLat.lng, clickedLngLat.lat]);
        }
      }
    });

    const radius = 20;
    const bbox = [
      lng - radius / (111.32 * Math.cos((lat * Math.PI) / 180)),
      lat - radius / 111.32,
      lng + radius / (111.32 * Math.cos((lat * Math.PI) / 180)),
      lat + radius / 111.32,
    ];

    map.current.setMaxBounds(bbox);
  }, [lng, lat, zoom]);

  useEffect(() => {
    if (departureMarker.current && destinationMarker.current) {
      const depLngLat = departureMarker.current.getLngLat();
      const destLngLat = destinationMarker.current.getLngLat();
      getRoute(depLngLat.lng, depLngLat.lat, destLngLat.lng, destLngLat.lat);
      setIsReadyToAdd(true);
    } else {
      setIsReadyToAdd(false);
    }
    if (isDepartureSet.length === 2 && isDestinationSet.length === 2) {
      setListingData((prev) => ({
        ...prev,
        driverId,
        pickupPoint: {
          long: isDepartureSet[0],
          lat: isDepartureSet[1],
        },
        longdest: isDestinationSet[0],
        latdest: isDestinationSet[1],
        longdep: isDepartureSet[0],
        latdep: isDepartureSet[1],
      }));
    }
  }, [isDepartureSet, isDestinationSet]);

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
        const response = await axios.get(`${backendUrl}/api/auth/verifyToken`, {
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

  const getRoute = async (depLong, depLat, destLong, destLat) => {

    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${depLong},${depLat};${destLong},${destLat}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
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
    if (map.current.getSource("route")) {
      map.current.getSource("route").setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
      map.current.addLayer({
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
          "line-width":4,
          "line-opacity": 1,
        },
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setListingData({ ...listingData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if all fields are filled

      if (
        listingData.departure === "" ||
        listingData.destination === "" ||
        listingData.time === "" ||
        listingData.date === "" ||
        listingData.seatsAvailable === 0
      ) {
        return toast.error(
          "Please provide all the details of the ride.",
          toastOptions
        );
      }

      // Check if the date is not in the past
      const currentDate = new Date();
      const selectedDate = new Date(`${listingData.date}T${listingData.time}`);

      if (selectedDate < currentDate) {
        return toast.error("Please select a valid date/time.", toastOptions);
      }

        const {data} = await axios.post(`${backendUrl}/api/rideListings/addListing`, listingData);

        if (!data.success) {
          console.log("data not success");
          return toast.error(data.error, toastOptions);
        }

      toast.success("Ride added successfully", toastOptions);
      navigate(`/listingDetail/${data.listingId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = async (address) => {
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      console.log("Coordinates:", latLng);
      
      if (isChoosingDepartureRef.current) {
        if (!departureMarker.current) {
          departureMarker.current = new mapboxgl.Marker({ color: "black" })
            .setLngLat([latLng.lng, latLng.lat])
            .addTo(map.current);
          setIsDepartureSet([latLng.lng, latLng.lat]);
        } else {
          departureMarker.current.setLngLat([
            latLng.lng,
            latLng.lat,
          ]);
          setIsDepartureSet([latLng.lng, latLng.lat]);
        }
        listingData.departure = address;
      } else {
        if (!destinationMarker.current) {
          destinationMarker.current = new mapboxgl.Marker({ color: "gray" })
            .setLngLat([latLng.lng, latLng.lat])
            .addTo(map.current);
          setIsDestinationSet([latLng.lng, latLng.lat]);
        } else {
          destinationMarker.current.setLngLat([latLng.lng, latLng.lat]);
          setIsDestinationSet([latLng.lng, latLng.lat]);
        }
        listingData.destination = address;
      }

      map.current.flyTo({
        center: [latLng.lng, latLng.lat],
        zoom: 17, 
        speed: 1.5, 
      });

      setAddress("");
      
    } catch (error) {
      console.error("Error selecting place:", error);
    }
  };


  return (
    <>
      <Navbar />
      <div className="mt-[10vh]">
        <div ref={mapContainer} className="map-container"></div>
        <div className="fixed top-[12vh] right-3 flex flex-col gap-2 items-end">

        <div className="relative">
          
          <PlacesAutocomplete
              value={address}
              onChange={setAddress}
              onSelect={handleSelect}
              searchOptions={searchOptions}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                  <input
                    {...getInputProps({
                      placeholder: `${isSearchOpen ? "Find Your Location" : ""}`,
                      className : `text-lg py-2  ${isSearchOpen ? "w-full px-3 pr-8" : "w-12"} border-0 outline-none transition-all ease-in-out duration-150`

                    })}
                  />
                  <div>
                    {loading ? <div>Loading...</div> : null}

                    {suggestions.map((suggestion) => {
                      const style = {
                        backgroundColor: suggestion.active ? "#4CE5B1" : "#161616",
                        color: suggestion.active ? "black" : "white",
                        border: "1px solid black",
                        padding: "6px",
                      };

                      return (
                        <div {...getSuggestionItemProps(suggestion, { style })}>
                          {suggestion.description}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          
          <IoSearchOutline size={25} color="black" className="cursor-pointer absolute right-2 top-2" onClick={()=>setIsSearchOpen(true)}/>
          </div>

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
        {isModalOpen && (
          <div
            className="flex justify-center items-center h-[90vh] w-[100vw] fixed top-[10vh] z-[5] bg-[rgb(0,0,0,0.7)]"
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
                    value={listingData.departure}
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
                    value={listingData.destination}
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
                    value={listingData.date}
                    onChange={handleInputChange}
                    className="w-full h-9  p-2 border-0 outline-none "
                  />
                </div>
                <div className="sm:w-[45%]">
                  <h2 className="text-white text-lg ">Time</h2>
                  <input
                    type="time"
                    name="time"
                    value={listingData.time}
                    onChange={handleInputChange}
                    className="w-full h-9  p-2 border-0 outline-none "
                  />
                </div>
                <div className="sm:w-full">
                  <h2 className="text-white text-lg ">Seats Available</h2>
                  <input
                    type="number"
                    name="seatsAvailable"
                    value={listingData.seatsAvailable}
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
                  Add
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="fixed bottom-20 flex justify-center w-full">
          <button
            className={` ${
              !isReadyToAdd && "hidden"
            }  bg-[#4CE5B1] text-black p-4 rounded-3xl hover:text-white font-bold `}
            onClick={(e) => {
              e.preventDefault();
              setIsModalOpen(true);
            }}
          >
            Add Ride
          </button>
        </div>
      </div>
    </>
  );
};

export default AddRide;
