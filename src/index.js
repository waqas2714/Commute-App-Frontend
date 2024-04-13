import React from "react";
import ReactDOM from "react-dom/client";
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';  
import "./index.css";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swDev from "./swDev";

export const toastOptions = {
  position: "top-right",
  autoClose: 3500,
  hideProgressBar: true, 
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark"
};


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer />
  </React.StrictMode>
);


swDev();