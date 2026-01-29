import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const CouponForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Agar id hogi to edit mode
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode); // edit mode me data fetch hoga
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    minimum_purchase: 0,
    start_date: "",
    expiry_date: "",
    usage_limit: 0,
    is_active: true,
  });

  // Coupon fetch only in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchCoupon = async () => {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_BASE}/api/coupons/${id}`
          );
          const coupon = data.coupon;

          setFormData({
            code: coupon.code || "",
            description: coupon.description || "",
            discount_type: coupon.discount_type || "percentage",
            discount_value: coupon.discount_value || 0,
            minimum_purchase: coupon.minimum_purchase || 0,
            start_date: coupon.start_date
              ? coupon.start_date.split("T")[0]
              : "",
            expiry_date: coupon.expiry_date
              ? coupon.expiry_date.split("T")[0]
              : "",
            usage_limit: coupon.usage_limit || 0,
            is_active: coupon.is_active ?? true,
          });
          setLoading(false);
        } catch (error) {
          console.error(error);
          toast.error("Failed to fetch coupon");
          setLoading(false);
        }
      };
      fetchCoupon();
    }
  }, [id, isEditMode]);

  // Input change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Update existing coupon
        await axios.put(
          `${import.meta.env.VITE_API_BASE}/api/coupons/${id}`,
          formData
        );
        toast.success("Coupon updated successfully!");
      } else {
        // Add new coupon
        await axios.post(
          `${import.meta.env.VITE_API_BASE}/api/coupons/add`,
          formData
        );
        toast.success("Coupon added successfully!");
      }
      navigate("/admin/dashboard/coupons");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save coupon");
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[#d4a373]">
        {isEditMode ? "Edit Coupon" : "Add Coupon"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Code */}
        <div>
          <label className="block mb-1 font-semibold">Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Discount type and value */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Discount Type</label>
            <select
              name="discount_type"
              value={formData.discount_type}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Discount Value</label>
            <input
              type="number"
              name="discount_value"
              value={formData.discount_value}
              onChange={handleChange}
              required
              min="0"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* Minimum purchase */}
        <div>
          <label className="block mb-1 font-semibold">
            Minimum Purchase ($)
          </label>
          <input
            type="number"
            name="minimum_purchase"
            value={formData.minimum_purchase}
            onChange={handleChange}
            min="0"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Start and expiry dates */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Expiry Date</label>
            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* Usage limit */}
        <div>
          <label className="block mb-1 font-semibold">
            Usage Limit (0 for unlimited)
          </label>
          <input
            type="number"
            name="usage_limit"
            value={formData.usage_limit}
            onChange={handleChange}
            min="0"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Active toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="cursor-pointer"
          />
          <label className="font-semibold cursor-pointer">Active</label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="bg-[#fde9d4] text-[#d4a373] px-6 py-2 rounded hover:bg-[#fcd8b8] hover:scale-105 transition-all"
        >
          {isEditMode ? "Update Coupon" : "Add Coupon"}
        </button>
      </form>
    </div>
  );
};

export default CouponForm;
