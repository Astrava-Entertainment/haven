import axios from 'axios';

// !TODO: IMPORT NOR WORKING
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const instance = axios.create({
  baseURL: `${BASE_URL}/api`,
});

export default instance;
