const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// JSON parsing middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// GET /
app.get("/", (req, res) => {
  res.send("My Week 2 API");
});

// POST /user
app.post("/user", (req, res) => {
  const { name, email } = req.body;

  // Check if name or email is missing
  if (!name || !email) {
    return res.status(400).json({
      error: "Name and email are required"
    });
  }

  res.json({
    message: `Hello, ${name}`
  });
});

// GET /user/:id
app.get("/user/:id", (req, res) => {
  const { id } = req.params;

  res.json({
    message: `You requested user with ID: ${id}`
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});