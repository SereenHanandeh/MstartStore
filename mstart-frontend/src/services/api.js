import axios from 'axios';

const API = axios.create({
  baseURL: 'https://localhost:7294/api', 
});

export default API;
