import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { mapBoxToken } from "../utils/backendUrl";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

mapboxgl.accessToken = mapBoxToken;

const GetRide = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const departureMarker = useRef(null);
  const destinationMarker = useRef(null);
  const [lng, setLng] = useState(72.992268);
  const [lat, setLat] = useState(33.642782);
  const [zoom, setZoom] = useState(15);
  const [isChoosingDepartureStyle, setIsChoosingDepartureStyle] = useState(true);
  const isChoosingDepartureRef = useRef(true);


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
              console.log("black marker created");
        } else {
          departureMarker.current.setLngLat([
            clickedLngLat.lng,
            clickedLngLat.lat,
          ]);
          console.log("Black Marker Updated"); 
        }
        
      } else {
        if (!destinationMarker.current) {
          destinationMarker.current = new mapboxgl.Marker({ color: "blue" })
              .setLngLat([clickedLngLat.lng, clickedLngLat.lat])
              .addTo(map.current);
              console.log("blue marker created");  
        } else {
          destinationMarker.current.setLngLat([
            clickedLngLat.lng,
            clickedLngLat.lat,
          ]);
          console.log("Blue Marker Updated");
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
          console.log("Black Marker created");
        } else {
          departureMarker.current.setLngLat(e.result.center);
          console.log("Black Marker Updated");
        }
      } else {
        if (!destinationMarker.current) {
          destinationMarker.current = new mapboxgl.Marker({ color: "blue" }) // Changed color to blue
            .setLngLat(e.result.center)
            .addTo(map.current);
          console.log("Blue Marker created");
        } else {
          destinationMarker.current.setLngLat(e.result.center);
          console.log("Blue Marker Updated");
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

    const geocoderContainer = document.querySelector(".mapboxgl-ctrl-geocoder .suggestions");
    if (geocoderContainer) {
      geocoderContainer.style.zIndex = "15";
    }
  }, 
  [lng, lat, zoom]
  );

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

  return (
    <>
      <Navbar />
      <div className="mt-[10vh]">
        <div ref={mapContainer} className="map-container"></div>
        <div className="fixed top-[20vh] right-3 flex flex-col gap-2 items-end">
          <button
            className={`${
              isChoosingDepartureStyle
                ? "bg-[#4CE5B1] text-black p-4"
                : "bg-black text-white p-2"
            }  rounded-3xl hover:bg-[#4CE5B1] hover:text-black hover:p-4 transition-all ease-in-out duration-150`}
            onClick={handleDepartureButtonClick}
          >
            Set Departure
          </button>
          <button
            className={`${
              !isChoosingDepartureStyle
                ? "bg-[#4CE5B1] text-black p-4"
                : "bg-white text-black p-2"
            } rounded-3xl hover:bg-[#4CE5B1] hover:text-black hover:p-4 transition-all ease-in-out duration-150`}
            onClick={handleDestinationButtonClick}
          >
            Set Destination
          </button>
        </div>
        <div className="fixed bottom-12 flex justify-center w-full">
          <button className=" bg-[#4CE5B1] text-black p-4 rounded-3xl hover:text-white font-extrabold ">
            Find Rides
          </button>
        </div>
      </div>
    </>
  );
};

export default GetRide;

