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
const validateObjectId = require("../middleware/validateObjectId");
const { createTask, getTasksForProject } = require("../controllers/taskController");


router.get("/", auth, getProjects);
router.get("/:id", auth, validateObjectId, getProjectById);
router.post("/", auth, requireAdmin, createProject);
router.put("/:id", auth, requireAdmin, validateObjectId, updateProject);
router.delete("/:id", auth, requireAdmin, validateObjectId, deleteProject);
router.post("/:id/tasks", auth, requireAdmin, validateObjectId, createTask);
router.get("/:id/tasks", auth, validateObjectId, getTasksForProject);

module.exports = router;