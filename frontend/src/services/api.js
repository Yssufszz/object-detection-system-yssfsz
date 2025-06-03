import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const visionAPI = {
  detectObjects: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post('/api/vision/detect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  getDetections: async (limit = 10) => {
    const response = await api.get(`/api/vision/detections?limit=${limit}`);
    return response.data;
  },

  getDetectionById: async (id) => {
    const response = await api.get(`/api/vision/detections/${id}`);
    return response.data;
  },

  healthCheck: async () => {
    const response = await api.get('/api/vision/health');
    return response.data;
  }
};

export default api;