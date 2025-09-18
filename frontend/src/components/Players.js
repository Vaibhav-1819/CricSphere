import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Players() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/api/players")
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Error fetching players:", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Players</h2>
      <Link to="/add-player" className="bg-green-600 text-white p-2 rounded mb-4 inline-block">
        Add Player
      </Link>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Country</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Matches</th>
            <th className="border p-2">Runs</th>
            <th className="border p-2">Wickets</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td className="border p-2">{player.name}</td>
              <td className="border p-2">{player.country}</td>
              <td className="border p-2">{player.role}</td>
              <td className="border p-2">{player.matches}</td>
              <td className="border p-2">{player.runs}</td>
              <td className="border p-2">{player.wickets}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
