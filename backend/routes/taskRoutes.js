const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { requireAdmin } = require("../middleware/roles");
const validateObjectId = require("../middleware/validateObjectId");
const { updateTask, deleteTask } = require("../controllers/taskController");
const { createSubtask, getSubtasksForTask } = require("../controllers/subtaskController");


router.put("/:id", auth, validateObjectId, updateTask);       // role logic handled inside controller
router.delete("/:id", auth, requireAdmin, validateObjectId, deleteTask);
router.post("/:id/subtasks", auth, requireAdmin, validateObjectId, createSubtask);
router.get("/:id/subtasks", auth, validateObjectId, getSubtasksForTask);

module.exports = router;