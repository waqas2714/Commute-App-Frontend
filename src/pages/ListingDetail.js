import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Passenger from "../components/Passenger";
import axios from "axios";
import { backendUrl, mapBoxToken } from "../utils/backendUrl";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import polyline from "@mapbox/polyline";
import mapboxgl from "mapbox-gl";
import { toastOptions } from "..";

mapboxgl.accessToken = mapBoxToken;

const ListingDetail = () => {
  const [details, setDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [lng, setLng] = useState(72.992268);
  const [lat, setLat] = useState(33.642782);
  const [isRequested, setIsRequested] = useState(false);
  const { id } = useParams();
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const pickupPointMapContainer = useRef(null);
  const pickupPointMap = useRef(null);
  const routeMapContainer = useRef(null);
  const routeMap = useRef(null);

  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  const getData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/rideListings/getListing/${id}/${userId}`
      );
      if (!data.listing.success) {
        toast.error(data.error);
        return;
      }
      data.listing.listing.date = dateFormat(data.listing.listing.date);
      setDetails(data.listing.listing);
      setIsRequested(data.isRequested)
      setIsLoading(false);
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
          "line-color": "#3887be",
          "line-width": 5,
          "line-opacity": 0.75,
        },
      });
    }
  };

  const makeRequest = async (e)=>{
    e.preventDefault();
    try {
      const {data} = await axios.post(`${backendUrl}/api/rideListings/addRideRequest`, {userId, listingId : id});
      
      if (!data.success) {
        return toast.error(data.error, toastOptions);
      }

      setIsRequested(true);
      toast.success("Request Sent!", toastOptions);
    } catch (error) {
      console.log(error);
    }
  }

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
        style: "mapbox://styles/mapbox/streets-v11",
        center: [
          parseFloat(details.pickupPoint.long),
          parseFloat(details.pickupPoint.lat),
        ],
        zoom: 12,
      });

      new mapboxgl.Marker()
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
        style: "mapbox://styles/mapbox/streets-v11",
        center: [
          parseFloat(details.pickupPoint.long),
          parseFloat(details.pickupPoint.lat),
        ],
        zoom: 12,
      });

      // Add marker for pickup point
      new mapboxgl.Marker()
        .setLngLat([
          parseFloat(details.pickupPoint.long),
          parseFloat(details.pickupPoint.lat),
        ])
        .addTo(routeMap.current);

      // Add marker for destination
      new mapboxgl.Marker()
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
          <div className="relative">
          <h1 className="text-center text-white font-extrabold text-4xl mb-4">
            DETAILS
          </h1>
          {
            isRequested ? <button className="absolute right-2 sm:right-12 top-0 text-lg fond font-semibold p-2 bg-gray-500"  disabled>Requested</button> : <button className="absolute right-6 sm:right-12 top-0 text-lg fond font-semibold p-2 bg-[#4CE5B1]" onClick={makeRequest}>Request</button>
          }
          
          
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
            <div className="mt-4">
              <img
                src={details.driverId.image}
                alt="driver's image"
                className="w-[75vw] max-w-[250px] mx-auto rounded-full"
              />
            </div>
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
                      key={index}
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
              Suggested Route:
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
