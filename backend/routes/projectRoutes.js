const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { requireAdmin } = require("../middleware/roles");
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require("../controllers/projectController");
const { createTask, getTasksForProject } = require("../controllers/taskController");


router.get("/", auth, getProjects);
router.get("/:id", auth, getProjectById);
router.post("/", auth, requireAdmin, createProject);
router.put("/:id", auth, requireAdmin, updateProject);
router.delete("/:id", auth, requireAdmin, deleteProject);
router.post("/:id/tasks", auth, requireAdmin, createTask);
router.get("/:id/tasks", auth, getTasksForProject);

module.exports = router;