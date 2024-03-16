import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Chat from './pages/Chat.js';
import Signup from './pages/Signup.js';
import Login from './pages/Login.js';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/chat' element={<Chat />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/' element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App