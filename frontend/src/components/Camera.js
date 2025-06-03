import React, { useRef, useEffect, useState } from 'react';
import { visionAPI } from '../services/api';

const Camera = ({ onDetection, isCapturing, setIsCapturing }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');

  const captureInterval = parseInt(process.env.REACT_APP_CAPTURE_INTERVAL) || 5000;

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      stopCapture();
    };
  }, []);

  useEffect(() => {
    if (isCapturing) {
      startCapture();
    } else {
      stopCapture();
    }
  }, [isCapturing]);

  const startCamera = async () => {
    try {
      setStatus('starting-camera');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setError(null);
        setStatus('camera-ready');
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Cannot access camera. Please check permissions.');
      setStatus('error');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setStatus('stopped');
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.8);
    });
  };

  const processCapture = async () => {
    try {
      setStatus('capturing');
      const imageBlob = await captureImage();
      
      if (!imageBlob) {
        throw new Error('Failed to capture image');
      }

      setStatus('processing');
      const result = await visionAPI.detectObjects(imageBlob);
      
      if (result.success) {
        onDetection(result.data);
        setStatus('detection-complete');
        setTimeout(() => setStatus('capturing-active'), 1000);
      } else {
        throw new Error('Detection failed');
      }
      
    } catch (error) {
      console.error('Capture error:', error);
      setError(`Capture failed: ${error.message}`);
      setStatus('error');
      setTimeout(() => {
        setError(null);
        if (isCapturing) setStatus('capturing-active');
      }, 3000);
    }
  };

  const startCapture = () => {
    if (intervalRef.current) return;
    
    setStatus('capturing-active');
    processCapture();
    
    intervalRef.current = setInterval(() => {
      processCapture();
    }, captureInterval);
  };

  const stopCapture = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStatus('camera-ready');
  };

  const toggleCapture = () => {
    setIsCapturing(!isCapturing);
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'starting-camera': return 'Lagi nunggu kamera...';
      case 'camera-ready': return 'Kamera udah ready nih';
      case 'capturing-active': return `Otomatis nangkep ${captureInterval/1000}s`;
      case 'capturing': return 'Foto lagi diambil...';
      case 'processing': return 'Proses ama vision API...';
      case 'detection-complete': return 'Berhasil Kedeteksi';
      case 'error': return 'Error';
      case 'stopped': return 'Camera Berhenti';
      default: return 'Inisialisasi Kamera...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'capturing-active': return 'success';
      case 'processing': return 'warning';
      case 'error': return 'danger';
      case 'detection-complete': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Live Kamera</h5>
        <div>
          <span className={`badge bg-${getStatusColor()} me-2`}>
            {getStatusMessage()}
          </span>
        </div>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        <div className="position-relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-100 rounded"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />
        </div>

        <div className="mt-3 d-flex gap-2">
          <button
            className={`btn ${isCapturing ? 'btn-danger' : 'btn-success'}`}
            onClick={toggleCapture}
            disabled={status === 'error' || status === 'starting-camera'}
          >
            {isCapturing ? 'Berhenti Auto Jepret' : 'Mulai Auto Jepret'}
          </button>
          
          <button
            className="btn btn-primary"
            onClick={processCapture}
            disabled={status === 'processing' || status === 'capturing'}
          >
            Foto
          </button>
          
          <button
            className="btn btn-secondary"
            onClick={startCamera}
            disabled={status === 'starting-camera'}
          >
            Restart Kamera
          </button>
        </div>
        
        <div className="mt-2">
          <small className="text-muted">
            Auto Jepret dalam: {captureInterval/1000} detik
          </small>
        </div>
      </div>
    </div>
  );
};

export default Camera;