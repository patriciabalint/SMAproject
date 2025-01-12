const express = require('express');
const tasksRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rute
app.use('/tasks', tasksRoutes);
app.use('/auth', authRoutes);

// Ascultă pe port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
