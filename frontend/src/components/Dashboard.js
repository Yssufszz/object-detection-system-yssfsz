import React, { useState, useEffect, useCallback } from 'react';
import { visionAPI } from '../services/api';

const Dashboard = ({ detections, isCapturing }) => {
  const [stats, setStats] = useState({
    totalDetections: 0,
    totalObjects: 0,
    mostDetectedObject: null,
    averageObjectsPerDetection: 0
  });
  const [apiStatus, setApiStatus] = useState('checking');

  const checkApiHealth = useCallback(async () => {
    try {
      await visionAPI.healthCheck();
      setApiStatus('healthy');
    } catch (error) {
      setApiStatus('error');
    }
  }, []);

  const calculateStats = useCallback(() => {
    if (!detections || detections.length === 0) {
      setStats({
        totalDetections: 0,
        totalObjects: 0,
        mostDetectedObject: null,
        averageObjectsPerDetection: 0
      });
      return;
    }

    const totalDetections = detections.length;
    let totalObjects = 0;
    const objectCounts = {};

    detections.forEach(detection => {
      if (detection.objects) {
        totalObjects += detection.objects.length;
        detection.objects.forEach(obj => {
          objectCounts[obj.name] = (objectCounts[obj.name] || 0) + 1;
        });
      }
    });

    const mostDetectedObject = Object.keys(objectCounts).length > 0
      ? Object.entries(objectCounts).reduce((a, b) => objectCounts[a[0]] > objectCounts[b[0]] ? a : b)[0]
      : null;

    const averageObjectsPerDetection = totalDetections > 0 
      ? (totalObjects / totalDetections).toFixed(1) 
      : 0;

    setStats({
      totalDetections,
      totalObjects,
      mostDetectedObject,
      averageObjectsPerDetection
    });
  }, [detections]);

  useEffect(() => {
    checkApiHealth();
  }, [checkApiHealth]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'healthy': return <span className="badge bg-success">Healty</span>;
      case 'error': return <span className="badge bg-danger">Error</span>;
      case 'checking': return <span className="badge bg-warning">Checking...</span>;
      default: return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Dashboard Sistem</h5>
          </div>
          <div className="card-body">
            <div className="row">
              
              {/* Status API */}
              <div className="col-md-3 mb-3">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h6 className="card-title">API Status</h6>
                    {getStatusBadge(apiStatus)}
                    <div className="mt-2">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={checkApiHealth}
                      >
                        Check
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Jepretan */}
              <div className="col-md-3 mb-3">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h6 className="card-title">Status Jepretan</h6>
                    <span className={`badge ${isCapturing ? 'bg-success' : 'bg-secondary'}`}>
                      {isCapturing ? 'Active' : 'Inactive'}
                    </span>
                    <div className="mt-2">
                      <small className="text-muted">
                        {isCapturing ? 'Auto-capturing enabled' : 'Manual mode'}
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Deteksinya */}
              <div className="col-md-3 mb-3">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h6 className="card-title">Total Deteksi</h6>
                    <h3 className="text-primary">{stats.totalDetections}</h3>
                    <small className="text-muted">Sesi Proses</small>
                  </div>
                </div>
              </div>

              {/* Total Objeknya */}
              <div className="col-md-3 mb-3">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h6 className="card-title">Total Objek yang ketangkep</h6>
                    <h3 className="text-success">{stats.totalObjects}</h3>
                    <small className="text-muted">Objects yang ke detek</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">

              {/* Objek yang paling banyak muncul/kedeteknya */}
              <div className="col-md-6 mb-3">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h6 className="card-title">Objek yang paling banyak ke detek</h6>
                    {stats.mostDetectedObject ? (
                      <div>
                        <h4 className="text-info">{stats.mostDetectedObject}</h4>
                        <small className="text-muted">Paling banyak ke detek</small>
                      </div>
                    ) : (
                      <div className="text-muted">
                        <p>Belum ada data</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Rata-rata objek */}
              <div className="col-md-6 mb-3">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h6 className="card-title">Rata rata objek/deteksi</h6>
                    <h4 className="text-warning">{stats.averageObjectsPerDetection}</h4>
                    <small className="text-muted">Objek per foto</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;