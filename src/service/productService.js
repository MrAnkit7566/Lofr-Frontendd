import axios from "./axiosConfig";

// Get all products
export const getAllProducts = async () => {
  return axios.get("/products");  
};

// Add product
export const addProduct = async (productData) => {
  return axios.post("/products/add", productData, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

// Get product by id ✅ (fixed)
export const getProductById = async (productId) => {
  return axios.get(`/products/getproduct/${productId}`);
};

// Update product
export const updateProduct = async (productId, productData) => {
  return axios.put(`/products/update/${productId}`, productData, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

// Delete product
export const deleteProduct = async (productId) => {
  return axios.delete(`/products/delete/${productId}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};
