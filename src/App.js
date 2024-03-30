import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Chat from './pages/Chat.js';
import Signup from './pages/Signup.js';
import Login from './pages/Login.js';
import Home from './pages/Home.js';
import SignupDriver from './pages/SignupDriver.js';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path='/chat' element={<Chat />} /> */}
        <Route path='/signup' element={<Signup />} />
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/signupDriver' element={<SignupDriver />} />
      </Routes>
    </Router>
  )
}

export default App