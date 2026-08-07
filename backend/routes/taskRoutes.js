const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { requireAdmin } = require("../middleware/roles");
const { updateTask, deleteTask } = require("../controllers/taskController");

router.put("/:id", auth, updateTask);       // role logic handled inside controller
router.delete("/:id", auth, requireAdmin, deleteTask);

module.exports = router;