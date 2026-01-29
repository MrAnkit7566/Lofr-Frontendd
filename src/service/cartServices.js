import axios from "axios";


const API_URL = import.meta.env.VITE_API_BASE;
// console.log("logging on cartASErvice",API_URL)

export const getCart = async (userId) => {
  return await axios.get(`${API_URL}/api/cart/${userId}`);
};

export const addToCart = async (data) => {
  return await axios.post(`${API_URL}/api/cart/add`, data);
};

export const updateCart = async (data) => {
  return await axios.put(`${API_URL}/api/cart/update`, data);
};

export const removeItem = async (cartId, productId) => {
  const res = await axios.delete(`${API_URL}/api/cart/remove`, {
    data: { cartId, productId },
  });
  return res.data;
};

export const clearCart = async (userId) => {
  return await axios.delete(`${API_URL}/api/cart/clear/${userId}`);
};
