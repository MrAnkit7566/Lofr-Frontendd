// src/service/couponService.js
import axios from "axios";

// Always ensure /api is present in the base URL
let BASE_URL = import.meta.env.VITE_API_BASE;
if (!BASE_URL.endsWith("/api")) BASE_URL += "/api";

export const validateCoupon = async (code, subtotal) => {
  try {
    // console.log("🔍 Sending coupon validation request:", code, subtotal);
    const res = await axios.post(`${BASE_URL}/coupons/validate`, { code, subtotal });
    // console.log("✅ Coupon validation response:", res.data);
    return res.data;
  } catch (error) {
    // console.error("❌ Coupon validation error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Coupon validation failed");
  }
};
