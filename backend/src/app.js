const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const visionRoutes = require('./routes/vision');

const app = express();
const PORT = process.env.PORT || 5000;

if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/vision', visionRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Object Detection API Server',
    version: '1.0.0',
    endpoints: {
      detect: 'POST /api/vision/detect',
      getDetections: 'GET /api/vision/detections',
      getDetectionById: 'GET /api/vision/detections/:id',
      health: 'GET /api/vision/health'
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Deteksi Objek API lagi run di http://localhost:${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}`);
  console.log(`🔍 Vision API Endpoint: http://localhost:${PORT}/api/vision/detect`);
  console.log(`📋 Health Check: http://localhost:${PORT}/api/vision/health\n`);
});