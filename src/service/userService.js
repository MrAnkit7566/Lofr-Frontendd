import axios from "./axiosConfig";

// Login API Call
export const loginUser = async (userData) => {
  return await axios.post("/user/login", userData);
};

// Signup API Call
export const signupUser = async (userData) => {
  return await axios.post("/user/add", userData);
};

export const getUserProfile = async (userId) => {
  return await axios.get(`/user/getUserById/${userId}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

export const updateUser = async (userId, userData, config = {}) => {
  return await axios.put(`/updateUser/${userId}`, userData, config);
};