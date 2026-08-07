const mongoose = require("mongoose");
const Subtask = require("../models/Subtask");
const Task = require("../models/Task");
const VALID_STATUSES = ["To Do", "In Progress", "Done"];


// POST /api/tasks/:id/subtasks — admin only
exports.createSubtask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const { title, assignedTo } = req.body;
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (assignedTo && !mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res.status(400).json({ message: "Invalid assignedTo user ID" });
    }

    const subtask = await Subtask.create({
      title: title.trim(),
      assignedTo,
      task: task._id
    });

    res.status(201).json(subtask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/tasks/:id/subtasks — role-filtered
exports.getSubtasksForTask = async (req, res) => {
  try {
    let filter = { task: req.params.id };
    if (req.user.role !== "admin") {
      filter.assignedTo = req.user.id;
    }
    const subtasks = await Subtask.find(filter).populate("assignedTo", "name email");
    res.json(subtasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/subtasks/:id — admin: full edit, member: status only + must be assignee
exports.updateSubtask = async (req, res) => {
  try {
    const subtask = await Subtask.findById(req.params.id);
    if (!subtask) return res.status(404).json({ message: "Subtask not found" });

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    if (req.body.status && !VALID_STATUSES.includes(req.body.status)) {
      return res.status(400).json({ message: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
    }

    if (req.user.role === "admin") {
      Object.assign(subtask, req.body);
    } else {
      const keys = Object.keys(req.body);
      const onlyStatus = keys.every((k) => k === "status");
      if (!onlyStatus) {
        return res.status(403).json({ message: "Members can only update status" });
      }
      if (!subtask.assignedTo || subtask.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({ message: "You can only update subtasks assigned to you" });
      }
      subtask.status = req.body.status;
    }

    await subtask.save();
    res.json(subtask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/subtasks/:id — admin only
exports.deleteSubtask = async (req, res) => {
  try {
    const subtask = await Subtask.findById(req.params.id);
    if (!subtask) return res.status(404).json({ message: "Subtask not found" });

    await subtask.deleteOne();
    res.json({ message: "Subtask deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};