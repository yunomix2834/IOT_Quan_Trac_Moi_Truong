import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MapPage from "./pages/MapPage";
import ViewDetails from "./pages/ViewDetails";
import Details from "./pages/Details";
import NotFound from "./pages/NotFound"; // Import trang NotFound

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/details" element={<Details />} />
      <Route path="/details/view" element={<ViewDetails />} />

      {/* Trang NotFound */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
