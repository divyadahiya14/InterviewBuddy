import axios from "axios";
import toast from "react-hot-toast";

// Base URL (backend)
const API = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true, // ✅ Send cookies with every request
});

// Intercept responses to handle 401 Unauthorized and 429 Too Many Requests
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear UI session storage
      localStorage.clear();
      // Redirect to login if not already there
      if (!window.location.pathname.endsWith("/login")) {
        window.location.href = "/login";
      }
    }
    
    if (error.response && error.response.status === 429) {
      const msg = error.response.data?.error || "Too many requests. Please slow down!";
      toast.error(msg, { id: "rate-limit-toast" });
    }
    
    return Promise.reject(error);
  }
);

export default API;
