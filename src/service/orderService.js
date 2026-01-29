import axios from "./axiosConfig";

// Create a new order
export const createOrder = async (orderData) => {
  return await axios.post("/orders/add", orderData);
};

// ✅ Get all orders (admin or all users)
export const getOrders = async () => {
  return await axios.get("/orders");
};

// ✅ Get all orders for a specific user (corrected)
export const getOrdersByUser = async (userId) => {
  return await axios.get(`/orders?user_id=${userId}`);
};

// ✅ Get a specific order by ID
export const getOrderById = async (orderId) => {
  return await axios.get(`/orders/${orderId}`);
};

// ✅ Delete an order
export const deleteOrder = async (orderId) => {
  return await axios.delete(`/orders/delete/${orderId}`);
};
