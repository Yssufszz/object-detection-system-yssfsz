import React, { useState, useEffect } from 'react';
import { visionAPI } from '../services/api';

const DetectionResults = ({ latestDetection }) => {
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDetections();
  }, []);

  useEffect(() => {
    if (latestDetection) {
      setDetections(prev => [latestDetection, ...prev.slice(0, 9)]);
    }
  }, [latestDetection]);

  const fetchDetections = async () => {
    try {
      setLoading(true);
      const response = await visionAPI.getDetections(10);
      if (response.success) {
        setDetections(response.data);
      }
    } catch (err) {
      setError('Gagal ngambil history deteksi');
      console.error('Error fetching detections:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'danger';
  };

  const DetectionCard = ({ detection, isLatest = false }) => (
    <div className={`card mb-3 ${isLatest ? 'border-success' : ''}`}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-0">
            Hasil Deteksi #{detection.id ? detection.id.slice(-6) : 'New'}
            {isLatest && <span className="badge bg-success ms-2">Terbaru</span>}
          </h6>
          <small className="text-muted">
            {formatTimestamp(detection.timestamp)}
          </small>
        </div>
        <span className="badge bg-primary">
          Ada {detection.totalObjects} Objek{detection.totalObjects !== 1 ? '' : ''}
        </span>
      </div>
      
      <div className="card-body">
        {detection.objects && detection.objects.length > 0 ? (
          <div className="row">
            {detection.objects.map((obj, index) => (
              <div key={index} className="col-md-6 mb-2">
                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                  <span className="fw-bold">{obj.name}</span>
                  <span className={`badge bg-${getConfidenceColor(obj.confidence)}`}>
                    {(obj.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted py-3">
            <i className="bi bi-search"></i>
            <p className="mb-0">Gaada Objeknya</p>
          </div>
        )}
        
        {detection.imageUrl && (
          <div className="mt-3">
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={() => window.open(detection.imageUrl, '_blank')}
            >
              Liat Foto
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (loading && detections.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 mb-0">Loading Riwayat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Hasil Deteksi</h5>
        <button 
          className="btn btn-sm btn-outline-primary"
          onClick={fetchDetections}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      <div className="card-body">
        {error && (
          <div className="alert alert-warning" role="alert">
            {error}
          </div>
        )}

        {detections.length === 0 ? (
          <div className="text-center text-muted py-5">
            <i className="bi bi-camera"></i>
            <h6>Belum Ada Hasil</h6>
            <p className="mb-0">Mulai Foto atau live buat liat hasil</p>
          </div>
        ) : (
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {detections.map((detection, index) => (
              <DetectionCard 
                key={detection.id || index} 
                detection={detection}
                isLatest={index === 0 && latestDetection && detection.id === latestDetection.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetectionResults;