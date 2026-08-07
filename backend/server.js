require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const subtaskRoutes = require("./routes/subtaskRoutes");

// temporary 
const auth = require("./middleware/auth");
const { requireAdmin } = require("./middleware/roles");

// temporary */

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// Basic error handler (catches thrown errors from controllers)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/subtasks", subtaskRoutes);
/* temporary */
app.get("/api/test-admin", auth, requireAdmin, (req, res) => {
  res.json({ message: `Hello Admin ${req.user.id}` });
});

// temporary */

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));