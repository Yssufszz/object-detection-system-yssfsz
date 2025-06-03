const vision = require('@google-cloud/vision');
const { firestore, bucket } = require('../config/firebase');
const fs = require('fs');
const path = require('path');

const client = new vision.ImageAnnotatorClient({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

async function testFirestoreConnection() {
  try {
    await firestore.listCollections();
    console.log('✅ Koneksi ke Firestore berhasil');
    return true;
  } catch (error) {
    console.error('❌ Koneksi ke Firestore eror:', error.message);
    return false;
  }
}

const detectObjects = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'Gaada file yang diunggah' 
      });
    }

    const imagePath = req.file.path;
    
    const [result] = await client.objectLocalization(imagePath);
    const objects = result.localizedObjectAnnotations || [];

    const detectionResult = {
      timestamp: new Date(),
      imagePath: imagePath,
      filename: req.file.filename,
      objects: objects.map(object => ({
        name: object.name,
        confidence: Math.round(object.score * 100) / 100,
        boundingBox: {
          vertices: object.boundingPoly ? object.boundingPoly.normalizedVertices : []
        }
      })),
      totalObjects: objects.length
    };

    let imageUrl = null;
    
    if (bucket && process.env.CLOUD_STORAGE_BUCKET) {
      try {
        const fileName = `detections/${Date.now()}-${req.file.filename}`;
        await bucket.upload(imagePath, {
          destination: fileName,
          metadata: {
            cacheControl: 'public, max-age=31536000',
          },
        });
        imageUrl = `https://storage.googleapis.com/${process.env.CLOUD_STORAGE_BUCKET}/${fileName}`;
        detectionResult.imageUrl = imageUrl;
      } catch (uploadError) {
        console.warn('Cloud Storage upload failed:', uploadError.message);
      }
    }

    try {
      const collectionName = process.env.FIRESTORE_COLLECTION || 'detections';
      
      const isConnected = await testFirestoreConnection();
      if (!isConnected) {
        throw new Error('Firestore connection failed');
      }
      
      const docRef = await firestore.collection(collectionName).add(detectionResult);
      detectionResult.id = docRef.id;
      console.log('✅ Saved to Firestore with ID:', docRef.id);
      
    } catch (firestoreError) {
      console.error('Firestore save failed:', firestoreError);
      console.log('Detection result (not saved to Firestore):', detectionResult);
    }

    fs.unlink(imagePath, (err) => {
      if (err) console.log('Error deleting local file:', err);
    });

    res.json({
      success: true,
      data: detectionResult
    });

  } catch (error) {
    console.error('Vision API Error:', error);
    
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.log('Error deleting file after error:', err);
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to process image',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getDetections = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const collectionName = process.env.FIRESTORE_COLLECTION || 'detections';
    
    console.log(`Attempting to fetch ${limit} detections from collection: ${collectionName}`);
    
    const isConnected = await testFirestoreConnection();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: 'Firestore service unavailable',
        details: 'Unable to connect to Firestore database'
      });
    }
    
    const collections = await firestore.listCollections();
    const collectionExists = collections.some(col => col.id === collectionName);
    
    if (!collectionExists) {
      console.log(`Collection '${collectionName}' does not exist yet`);
      return res.json({
        success: true,
        data: [],
        count: 0,
        message: 'No detections found. Collection will be created when first detection is saved.'
      });
    }
    
    const snapshot = await firestore
      .collection(collectionName)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    const detections = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      detections.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp.toDate ? data.timestamp.toDate() : data.timestamp
      });
    });

    console.log(`✅ Successfully fetched ${detections.length} detections`);

    res.json({
      success: true,
      data: detections,
      count: detections.length
    });

  } catch (error) {
    console.error('Firestore Error:', error);
    
    let errorMessage = 'Failed to fetch detections';
    let statusCode = 500;
    
    if (error.code === 5) {
      errorMessage = 'Firestore database or collection not found';
      statusCode = 503;
    } else if (error.code === 3) {
      errorMessage = 'Invalid query parameters';
      statusCode = 400;
    } else if (error.code === 7) { 
      errorMessage = 'Permission denied to access Firestore';
      statusCode = 403;
    }
    
    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      errorCode: error.code,
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getDetectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const collectionName = process.env.FIRESTORE_COLLECTION || 'detections';
    
    const isConnected = await testFirestoreConnection();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: 'Firestore service unavailable'
      });
    }
    
    const doc = await firestore.collection(collectionName).doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ 
        success: false,
        error: 'Detection not found' 
      });
    }

    const data = doc.data();
    res.json({
      success: true,
      data: {
        id: doc.id,
        ...data,
        timestamp: data.timestamp.toDate ? data.timestamp.toDate() : data.timestamp
      }
    });

  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch detection',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

testFirestoreConnection();

module.exports = {
  detectObjects,
  getDetections,
  getDetectionById,
  testFirestoreConnection
};