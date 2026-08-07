import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import TaskItem from "../components/TaskItem";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortByDue, setSortByDue] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const { user } = useAuth();

  const loadData = async () => {
    const [projRes, taskRes] = await Promise.all([
      api.get(`/projects/${id}`),
      api.get(`/projects/${id}/tasks`)
    ]);
    setProject(projRes.data);
    setTasks(taskRes.data);
  };

  useEffect(() => { loadData(); }, [id]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    await api.post(`/projects/${id}/tasks`, { title: newTaskTitle, assignedTo: newTaskAssignee || undefined });
    setNewTaskTitle(""); setNewTaskAssignee("");
    loadData();
  };

  const filtered = tasks
    .filter((t) => statusFilter === "All" || t.status === statusFilter)
    .sort((a, b) => {
      if (!sortByDue) return 0;
      return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
    });

  const counts = {
    "To Do": tasks.filter((t) => t.status === "To Do").length,
    "In Progress": tasks.filter((t) => t.status === "In Progress").length,
    "Done": tasks.filter((t) => t.status === "Done").length
  };

  if (!project) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <Link to="/projects" className="text-sm text-blue-600">← Back to Projects</Link>
      <h1 className="text-2xl font-bold mt-2">{project.title}</h1>
      <p className="text-gray-500 mb-4">{project.description}</p>

      <div className="flex gap-4 mb-4 text-sm">
        <span className="bg-gray-200 px-3 py-1 rounded">To Do: {counts["To Do"]}</span>
        <span className="bg-yellow-200 px-3 py-1 rounded">In Progress: {counts["In Progress"]}</span>
        <span className="bg-green-200 px-3 py-1 rounded">Done: {counts["Done"]}</span>
      </div>

      <div className="flex gap-3 mb-4">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded px-2 py-1 text-sm">
          <option>All</option>
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <button onClick={() => setSortByDue(!sortByDue)} className="border rounded px-2 py-1 text-sm">
          {sortByDue ? "Sorted by due date ✓" : "Sort by due date"}
        </button>
      </div>

      {user.role === "admin" && (
        <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
          <input value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="New task title" className="border rounded px-2 py-1 flex-1 text-sm" />
          <input value={newTaskAssignee} onChange={(e) => setNewTaskAssignee(e.target.value)} placeholder="Assignee user ID" className="border rounded px-2 py-1 text-sm" />
          <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">Add Task</button>
        </form>
      )}

      {filtered.map((t) => (
        <TaskItem key={t._id} task={t} onUpdate={loadData} />
      ))}
      {filtered.length === 0 && <p className="text-gray-500">No tasks match this filter.</p>}
    </div>
  );
}