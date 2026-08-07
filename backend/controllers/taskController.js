const Task = require("../models/Task");
const Project = require("../models/Project");
const Subtask = require("../models/Subtask");

// POST /api/projects/:id/tasks — admin only
exports.createTask = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const { title, description, assignedTo, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const task = await Task.create({
      title,
      description,
      assignedTo,
      dueDate,
      project: project._id
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/projects/:id/tasks — role-filtered
exports.getTasksForProject = async (req, res) => {
  try {
    let filter = { project: req.params.id };
    if (req.user.role !== "admin") {
      filter.assignedTo = req.user.id;
    }
    const tasks = await Task.find(filter).populate("assignedTo", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/tasks/:id — admin: full edit, member: status only + must be assignee
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role === "admin") {
      Object.assign(task, req.body);
    } else {
      // Member restrictions
      const keys = Object.keys(req.body);
      const onlyStatus = keys.every((k) => k === "status");
      if (!onlyStatus) {
        return res.status(403).json({ message: "Members can only update status" });
      }
      if (!task.assignedTo || task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({ message: "You can only update tasks assigned to you" });
      }
      task.status = req.body.status;
    }

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/tasks/:id — admin only, cascades to subtasks
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await Subtask.deleteMany({ task: task._id });
    await task.deleteOne();

    res.json({ message: "Task and related subtasks deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};