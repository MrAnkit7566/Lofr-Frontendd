import React, { createContext, useState, useEffect } from "react";
import { getUserProfile } from "../service/userService";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // while fetching user
  const [error, setError] = useState(null);

  // ✅ Fetch user on page load
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);

        // Check token expiry
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.clear();
          toast.error("Session expired. Please login again.");
          setLoading(false);
          return;
        }

        // Fetch user profile from backend
        const res = await getUserProfile(userId);
        // console.log("loggin res",res)
        setUser(res.data.user);

        // Optional: auto logout when token expires
        const expiresInMs = decoded.exp * 1000 - Date.now();
        setTimeout(() => {
          localStorage.clear();
          setUser(null);
          toast.error("Session expired. Please login again.");
        }, expiresInMs);

      } catch (err) {
        console.error("AuthContext error:", err);
        localStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ Logout method
  const logout = () => {
    localStorage.clear();
    setUser(null);
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};
