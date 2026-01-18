import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Vercel handles the routing to server
});

export default api;
