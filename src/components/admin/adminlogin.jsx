// src/components/admin/AdminLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (form.username === "admin" && form.password === "1234") {
      localStorage.setItem("isAdmin", "1");
      navigate("/admindsh"); // ✅ Redirect to dashboard after login
    } else {
      setError("Invalid credentials");
    }
  };

  // Already logged in → go to dashboard
  useEffect(() => {
    if (localStorage.getItem("isAdmin") === "1") {
      navigate("/admindsh");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000] text-white">
      <div className="bg-white/5 p-8 rounded-xl shadow-lg w-[320px]">
        <h1 className="text-xl font-semibold mb-4 text-center">Admin Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="bg-white/10 p-2 rounded text-white outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="bg-white/10 p-2 rounded text-white outline-none"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition p-2 rounded mt-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
