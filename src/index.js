const constants = require('./constants/appConstants');
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const routes = require('./routes/index');
const path = require('path');
const fs = require('fs');
const { setupCleanupScheduler } = require('./utils/file.helpers');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
// Don't parse JSON globally - the webhook route needs raw bodies
// Routes will use JSON parsing individually as needed
// app.use(express.json());

app.use('/labels', express.static(path.join(__dirname, 'uploads/labels')));
app.use('/uploads', express.static(path.join(__dirname, 'temp_data')));

// Use routes - the webhook route is defined here with special middleware
app.use('/api', routes);

// Apply JSON parsing to all other routes that are not webhooks
app.use(express.json());

setupCleanupScheduler(); 

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Database connection and server start
const PORT = constants.PORT || 3001;

// Create temp directory if it doesn't exist
const tempDir = path.join(__dirname, 'temp_uploads');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// setupCleanupScheduler();

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync database (in development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synced');
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();