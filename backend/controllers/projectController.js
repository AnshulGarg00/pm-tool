const Project = require("../models/Project");
const Task = require("../models/Task");
const Subtask = require("../models/Subtask");

// GET /api/projects — role-filtered
exports.getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === "admin") {
      projects = await Project.find().populate("members", "name email").populate("createdBy", "name email");
    } else {
      projects = await Project.find({ members: req.user.id })
        .populate("members", "name email")
        .populate("createdBy", "name email");
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/projects/:id — single project (role-checked)
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members", "name email")
      .populate("createdBy", "name email");

    if (!project) return res.status(404).json({ message: "Project not found" });

    const isMember = project.members.some((m) => m._id.toString() === req.user.id);
    if (req.user.role !== "admin" && !isMember) {
      return res.status(403).json({ message: "Not authorized to view this project" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/projects — admin only
exports.createProject = async (req, res) => {
  try {
    const { title, description, members } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const project = await Project.create({
      title,
      description,
      createdBy: req.user.id,
      members: members || []
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/projects/:id — admin only
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/projects/:id — admin only, cascades to tasks & subtasks
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const tasks = await Task.find({ project: project._id });
    const taskIds = tasks.map((t) => t._id);

    await Subtask.deleteMany({ task: { $in: taskIds } });
    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ message: "Project and related tasks/subtasks deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};