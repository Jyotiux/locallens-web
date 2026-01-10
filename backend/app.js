// Core dependencies
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Database connection
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Establish database connection
connectDB();

// Global middlewares
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Routes
const spotRoutes = require("./routes/spotRoutes");
app.use("/api", spotRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
