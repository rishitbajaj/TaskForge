// 1. Load the environment variables first
require('dotenv').config();

// 2. Define the tools we need
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Add this near the top with your other imports
const taskRoutes = require('./routes/taskRoutes');

// Add this after app.use(cors())


// 3. Initialize the app
const app = express();

// 4. Set up Middleware
app.use(express.json());
app.use(cors());
app.use('/api/tasks', taskRoutes);

// 5. Connect to the Database
// We use process.env.MONGO_URI which is inside your .env file
const dbURI = process.env.MONGO_URI;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => console.log("❌ Database Connection Error: ", err));

// 6. Basic Route
app.get('/', (req, res) => {
    res.send("TaskForge API is running...");
});

// 7. Start the Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});

