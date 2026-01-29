import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
// console.log("logging on wishlislih",API_BASE)


const getTokenHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token,
  };
};

export const fetchWishlist = async () => {
  return axios.get(`${API_BASE}/api/wishlist`, { headers: getTokenHeaders() });
};

export const addToWishlist = async (data) => {
  try {
    const res = await axios.post(
      `${API_BASE}/api/wishlist/add`,
      data,
      { headers: getTokenHeaders()  }
    );
    // console.log("Response from backend:", res.data);
    return res.data; //  return actual data, not undefined
  } catch (error) {
    console.error(" addToWishlist error:", error.response?.data || error.message);
    throw error;
  }
};


export const removeFromWishlist = async (productId) => {
  return axios.delete(`${API_BASE}/api/wishlist/remove/${productId}`, { headers: getTokenHeaders() });
};

export const clearWishlist = async () => {
  return axios.delete(`${API_BASE}/api/wishlist/clear`, { headers: getTokenHeaders() });

};
