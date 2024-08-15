import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
import User from './Components/User/User';
import Navbar from './Components/Navbar/Navbar';
import Auth from './Components/Auth/Auth';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users/:userId" element={<User />} />
        {/* Birisi /auth girmeye çalıştığında
        localStorage'de currentUser varsa /'a
        yoksa /auth'a yönlendir */}
        <Route
          path="/auth"
          element={
            localStorage.getItem("currentUser") != null ? <Navigate to="/" /> : <Auth />
          }
        />      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
