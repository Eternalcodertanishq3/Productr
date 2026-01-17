import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Functioning Local Backend
});

export default api;
