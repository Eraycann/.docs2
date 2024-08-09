import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
import User from './Components/User/User';
import Navbar from './Components/Navbar/Navbar';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* "/": Home Component'i gösterir */}
          <Route path="/" element={<Home />} />                
          {/* "/users/:userId": User Component'i ve parametreyi gösterir */}
          <Route path="/users/:userId" element={<User />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
