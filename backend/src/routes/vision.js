const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { detectObjects, getDetections, getDetectionById } = require('../controllers/visionController');

router.post('/detect', upload.single('image'), detectObjects);

router.get('/detections', getDetections);

router.get('/detections/:id', getDetectionById);

router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Vision API service is running',
    timestamp: new Date()
  });
});

module.exports = router;