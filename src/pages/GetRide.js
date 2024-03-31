import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { mapBoxToken } from "../utils/backendUrl";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

mapboxgl.accessToken = mapBoxToken;

const GetRide = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [lng, setLng] = useState(72.992268);
  const [lat, setLat] = useState(33.642782);
  const [zoom, setZoom] = useState(15);

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
      if (!marker.current) {
        // Create and set new marker
        marker.current = new mapboxgl.Marker({ color: "black" })
          .setLngLat([clickedLngLat.lng, clickedLngLat.lat])
          .addTo(map.current);

        console.log(marker.current);
      } else {
        marker.current.setLngLat([clickedLngLat.lng, clickedLngLat.lat]);
        console.log(marker.current);
      }
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      placeholder: "Search for places",
      collapsed: true, //  
      bbox: [72.7878, 33.4610, 73.2422, 33.8079], // Bounding box for Rawalpindi and Islamabad
      countries: "pk", // Restrict to Pakistan
    });

    // Add event listener for geocoder result selection
    geocoder.on("result", (e) => {
      // Remove previous geocoder marker if exists
      if (!marker.current) {
        // Create and set new marker
        marker.current = new mapboxgl.Marker({ color: "black" })
          .setLngLat(e.result.center)
          .addTo(map.current);

        console.log(marker.current);
      } else {
        marker.current.setLngLat(e.result.center);
        console.log(marker.current);
      }

    });

    map.current.addControl(geocoder);

    const radius = 20; // in kilometers
    const bbox = [
      lng - radius / (111.32 * Math.cos((lat * Math.PI) / 180)),
      lat - radius / 111.32,
      lng + radius / (111.32 * Math.cos((lat * Math.PI) / 180)),
      lat + radius / 111.32,
    ];

    // Set max bounds to restrict map view to the calculated bounding box
    map.current.setMaxBounds(bbox);

  }, [lng, lat, zoom]);

  return (
    <>
      <Navbar />
      <div className="mt-[10vh]">
        <div ref={mapContainer} className="map-container"></div>
      </div>
    </>
  );
};

export default GetRide;
