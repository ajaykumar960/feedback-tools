import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        username,
        password,
      });
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin");
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">Login</button>
      </form>

      {/* ✅ Sample credentials section */}
      <div style={{ marginTop: "2rem", fontSize: "14px", color: "#555" }}>
        <p><strong>Sample Credentials</strong></p>
        <p>Username: <code>admin</code></p>
        <p>Password: <code>admin123</code></p>
      </div>
    </div>
  );
}

export default AdminLogin;
