const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { requireAdmin } = require("../middleware/roles");
const validateObjectId = require("../middleware/validateObjectId");
const { updateSubtask, deleteSubtask } = require("../controllers/subtaskController");

router.put("/:id", auth, validateObjectId, updateSubtask);      // role logic handled inside controller
router.delete("/:id", auth, requireAdmin, validateObjectId, deleteSubtask);

module.exports = router;