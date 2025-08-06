// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};

export default {
  register: (data) => API.post('/auth/signup', data).then(res => res.data),
  login: (data) => API.post('/auth/login', data).then(res => res.data),
  setAuthToken,
};
