import React, { useState, useEffect } from 'react';
import Camera from './components/Camera';
import DetectionResults from './components/DetectionResults';
import Dashboard from './components/Dashboard';
import { visionAPI } from './services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [latestDetection, setLatestDetection] = useState(null);
  const [allDetections, setAllDetections] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchInitialDetections();
  }, []);

  const fetchInitialDetections = async () => {
    try {
      const response = await visionAPI.getDetections(10);
      if (response.success) {
        setAllDetections(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch initial detections:', error);
    }
  };

  const handleNewDetection = (detection) => {
    setLatestDetection(detection);
    setAllDetections(prev => [detection, ...prev.slice(0, 9)]);
    
    showNotification(`Detected ${detection.totalObjects} object(s)!`, 'success');
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="App">
      <div className="container-fluid py-4">

        <div className="row mb-4">
          <div className="col-12">
            <div className="text-center">
              <h1 className="display-4 mb-2">Sistem Deteksi Objek</h1>
              <p className="lead text-muted">
                Real-Time deteksi objek pake Google Cloud Vision API by Yssufsz
              </p>
            </div>
          </div>
        </div>


        {notification && (
          <div className="row mb-3">
            <div className="col-12">
              <div className={`alert alert-${notification.type} alert-dismissible fade show`} role="alert">
                {notification.message}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setNotification(null)}
                ></button>
              </div>
            </div>
          </div>
        )}

        <Dashboard 
          detections={allDetections} 
          isCapturing={isCapturing}
        />

        <div className="row">
          <div className="col-lg-6 mb-4">
            <Camera 
              onDetection={handleNewDetection}
              isCapturing={isCapturing}
              setIsCapturing={setIsCapturing}
            />
          </div>

          <div className="col-lg-6 mb-4">
            <DetectionResults 
              latestDetection={latestDetection}
            />
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <div className="text-center text-muted">
              <hr />
              <p className="mb-0">
                Pake google Google Cloud Vision API • Di buat pake React ama Node.js
              </p>
              <small>
                Project bareng ai hasil Yssufsz | Status Sistem: 
                <span className="text-success ms-1">Online</span>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;