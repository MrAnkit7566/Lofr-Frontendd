import axios from "axios";

const instance = axios.create({
  // baseURL: "https://lofr-in.onrender.com/api",
  baseURL:`${import.meta.env.VITE_API_BASE}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
