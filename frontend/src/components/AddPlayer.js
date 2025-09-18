import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddPlayer() {
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    role: "",
    matches: 0,
    runs: 0,
    wickets: 0,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8081/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.ok) {
          alert("Player added!");
          navigate("/players");
        } else {
          alert("Failed to add player");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error while saving player");
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Add Player</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} required />
        <input type="text" name="role" placeholder="Role" value={formData.role} onChange={handleChange} required />
        <input type="number" name="matches" placeholder="Matches" value={formData.matches} onChange={handleChange} />
        <input type="number" name="runs" placeholder="Runs" value={formData.runs} onChange={handleChange} />
        <input type="number" name="wickets" placeholder="Wickets" value={formData.wickets} onChange={handleChange} />
        <button type="submit" className="col-span-2 bg-green-600 text-white p-2 rounded">Add Player</button>
      </form>
    </div>
  );
}
