import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Chat from './pages/Chat.js';
import Signup from './pages/Signup.js';
import Login from './pages/Login.js';
import SignupDriver from './pages/SignupDriver.js';
import ForgotPassword from './pages/ForgotPassword.js';
import ResetPassword from './pages/ResetPassword.js';
import GetRide from './pages/GetRide.js';
import ListingDetail from './pages/ListingDetail.js';
import MyRequests from './pages/MyRequests.js';
import AddRide from './pages/AddRide.js';
import CurrentRides from './pages/CurrentRides.js';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path='/chat' element={<Chat />} /> */}
        <Route path='/signup' element={<Signup />} />
        <Route path='/' element={<Login />} />
        <Route path='/getRide' element={<GetRide />} />
        <Route path='/signupDriver' element={<SignupDriver />} />
        <Route path='/forgotPassword' element={<ForgotPassword />} />
        <Route path='/resetPassword/:token' element={<ResetPassword />} />
        <Route path='/listingDetail/:id' element={<ListingDetail />} />
        <Route path='/myRequests' element={<MyRequests />} />
        <Route path='/addRide' element={<AddRide />} />
        <Route path='/currentRides' element={<CurrentRides />} />
      </Routes>
    </Router>
  )
}

export default App