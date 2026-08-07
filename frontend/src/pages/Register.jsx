import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate("/projects");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded px-3 py-2">
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button className="w-full bg-blue-600 text-white py-2 rounded">Register</button>
      </form>
      <p className="text-sm mt-3">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
    </div>
  );
}