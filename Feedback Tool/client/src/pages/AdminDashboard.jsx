import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js modules
ChartJS.register(ArcElement, Tooltip, Legend);

const socket = io("http://localhost:5000");

function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({});
  const [sort, setSort] = useState("createdAt");
  const sortRef = useRef("createdAt");
  const navigate = useNavigate();

  const fetchData = async (sortField) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const res = await axios.get(`http://localhost:5000/api/feedback/all?sortBy=${sortField}&order=desc`, config);
      const stat = await axios.get("http://localhost:5000/api/feedback/stats", config);
      setFeedbacks(res.data);
      setStats(stat.data);
    } catch (err) {
      console.error("Error fetching data", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("adminToken");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    sortRef.current = sort;
    fetchData(sort);
  }, [sort]);

  useEffect(() => {
    const handleNewFeedback = () => fetchData(sortRef.current);
    socket.on("new-feedback", handleNewFeedback);
    return () => socket.off("new-feedback", handleNewFeedback);
  }, []);

  const ratingCounts = feedbacks.reduce((acc, f) => {
    acc[f.rating] = (acc[f.rating] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(ratingCounts).map(r => `${r} Stars`),
    datasets: [{
      data: Object.values(ratingCounts),
      backgroundColor: ["#ffcc00", "#ff9900", "#ff6600", "#ff3300", "#cc0000"]
    }]
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Total Feedbacks: {stats.total}</h2>
      <h3>Average Rating: {stats.averageRating?.toFixed(2)}</h3>

      <label>Sort by: </label>
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="createdAt">Newest</option>
        <option value="rating">Highest Rating</option>
      </select>

      <ul>
        {feedbacks.map(f => (
          <li key={f._id}>
            <b>{f.feedback}</b> – {f.rating} ⭐ by {f.name || "Anonymous"}
          </li>
        ))}
      </ul>

      <h4>Rating Distribution:</h4>
      <div style={{ width: "300px", height: "300px", margin: "0 auto" }}>
  <Pie data={chartData} />
</div>
    </div>
  );
}

export default AdminDashboard;