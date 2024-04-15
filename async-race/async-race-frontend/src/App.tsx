import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Garage from './pages/Garage/Garage';
import Winners from './pages/Winners/Winners';
import Menu from './components/Menu/Menu';
import './App.css';

function App() {
  return (
    <div className="App">
      <Menu />
      <Routes>
        <Route path="/" element={<Garage />} />
        <Route path="/garage" element={<Garage />} />
        <Route path="/winners" element={<Winners />} />
      </Routes>
    </div>
  );
}

export default App;
