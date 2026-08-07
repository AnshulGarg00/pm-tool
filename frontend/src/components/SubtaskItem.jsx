import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function SubtaskItem({ subtask, onUpdate }) {
  const { user } = useAuth();
  const isOwner = subtask.assignedTo?._id === user.id;
  const canEditStatus = user.role === "admin" || isOwner;

  const handleStatusChange = async (e) => {
    await api.put(`/subtasks/${subtask._id}`, { status: e.target.value });
    onUpdate();
  };

  const handleDelete = async () => {
    await api.delete(`/subtasks/${subtask._id}`);
    onUpdate();
  };

  return (
    <div className="flex justify-between items-center py-1 pl-6 text-sm border-l">
      <span>{subtask.title} {subtask.assignedTo && <span className="text-gray-400">({subtask.assignedTo.name})</span>}</span>
      <div className="flex items-center gap-2">
        <select value={subtask.status} onChange={handleStatusChange} disabled={!canEditStatus} className="border rounded px-2 py-1 text-xs">
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        {user.role === "admin" && (
          <button onClick={handleDelete} className="text-red-500 text-xs">Delete</button>
        )}
      </div>
    </div>
  );
}