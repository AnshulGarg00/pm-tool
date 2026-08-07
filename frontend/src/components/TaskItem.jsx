import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import SubtaskItem from "./SubtaskItem";

export default function TaskItem({ task, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const { user } = useAuth();
  const isOwner = task.assignedTo?._id === user.id;
  const canEditStatus = user.role === "admin" || isOwner;

  const loadSubtasks = async () => {
    const res = await api.get(`/tasks/${task._id}/subtasks`);
    setSubtasks(res.data);
  };

  useEffect(() => { if (expanded) loadSubtasks(); }, [expanded]);

  const handleStatusChange = async (e) => {
    await api.put(`/tasks/${task._id}`, { status: e.target.value });
    onUpdate();
  };

  const handleDelete = async () => {
    await api.delete(`/tasks/${task._id}`);
    onUpdate();
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    await api.post(`/tasks/${task._id}/subtasks`, { title: newSubtaskTitle, assignedTo: task.assignedTo?._id });
    setNewSubtaskTitle("");
    loadSubtasks();
  };

  return (
    <div className="border rounded p-3 mb-2 bg-white">
      <div className="flex justify-between items-center">
        <button onClick={() => setExpanded(!expanded)} className="font-medium text-left">
          {expanded ? "▾" : "▸"} {task.title} {task.assignedTo && <span className="text-gray-400 text-sm">({task.assignedTo.name})</span>}
        </button>
        <div className="flex items-center gap-2">
          <select value={task.status} onChange={handleStatusChange} disabled={!canEditStatus} className="border rounded px-2 py-1 text-xs">
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
          {user.role === "admin" && (
            <button onClick={handleDelete} className="text-red-500 text-xs">Delete</button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-2">
          {subtasks.map((s) => (
            <SubtaskItem key={s._id} subtask={s} onUpdate={loadSubtasks} />
          ))}
          {user.role === "admin" && (
            <form onSubmit={handleAddSubtask} className="flex gap-2 mt-2 pl-6">
              <input
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="New subtask"
                className="border rounded px-2 py-1 text-xs flex-1"
              />
              <button className="bg-green-600 text-white px-2 py-1 rounded text-xs">Add</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}