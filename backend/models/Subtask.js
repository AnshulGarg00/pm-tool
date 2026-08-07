const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ["To Do", "In Progress", "Done"], default: "To Do" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Subtask", subtaskSchema);