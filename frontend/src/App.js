import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Players from "./components/Players";
import AddPlayer from "./components/AddPlayer";

export default function App() {
  return (
    <div>
      <nav className="p-4 bg-gray-200">
        <Link to="/" className="mr-4">Home</Link>
        <Link to="/players">Players</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1 className="text-center mt-10 text-3xl">CrickSphere Frontend</h1>} />
        <Route path="/players" element={<Players />} />
        <Route path="/add-player" element={<AddPlayer />} />
      </Routes>
    </div>
  );
}
