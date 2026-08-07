import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { user, logout } = useAuth();

  const loadProjects = async () => {
    const res = await api.get("/projects");
    setProjects(res.data);
  };

  useEffect(() => { loadProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post("/projects", { title, description });
    setTitle(""); setDescription(""); setShowForm(false);
    loadProjects();
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex gap-3 items-center">
          <span className="text-sm text-gray-500">{user?.name} ({user?.role})</span>
          <button onClick={logout} className="text-sm text-red-500">Logout</button>
        </div>
      </div>

      {user?.role === "admin" && (
        <div className="mb-4">
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded">
            {showForm ? "Cancel" : "New Project"}
          </button>
          {showForm && (
            <form onSubmit={handleCreate} className="mt-3 space-y-2 bg-white p-4 rounded shadow">
              <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
              <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" />
              <button className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
            </form>
          )}
        </div>
      )}

      <div className="space-y-2">
        {projects.map((p) => (
          <Link key={p._id} to={`/projects/${p._id}`} className="block bg-white p-4 rounded shadow hover:bg-gray-50">
            <h2 className="font-semibold">{p.title}</h2>
            <p className="text-sm text-gray-500">{p.description}</p>
          </Link>
        ))}
        {projects.length === 0 && <p className="text-gray-500">No projects yet.</p>}
      </div>
    </div>
  );
}