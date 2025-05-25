import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true, // 🔥 This is needed for CORS credentials

});


export default API;
