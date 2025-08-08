import axios from 'axios'

// const BASE_URL = import.meta.env.BASE_URL;
const BASE_URL = 'http://localhost:3000';

const instance = axios.create({
  baseURL: `${BASE_URL}/api`,
});

export default instance;
