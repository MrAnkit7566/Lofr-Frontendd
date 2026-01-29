import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditOrders = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "returned",
  ];

  const paymentOptions = ["pending", "processing", "completed", "failed", "refunded"];

  // Fetch order details
  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE}/api/orders/${id}`);
      setOrder(data.order);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch order");
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (!order) return <p className="p-6">Loading order data...</p>;

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE}/api/orders/update/${id}`, order);
      toast.success("Order updated successfully!");
      navigate("/admin/dashboard/orders");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Edit Order #{order.order_number}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Order Status</label>
          <select
            name="status"
            value={order.status}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Payment Status</label>
          <select
            name="payment_status"
            value={order.payment_status}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          >
            {paymentOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Additional Comments</label>
          <textarea
            name="additionalComments"
            value={order.additionalComments || ""}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#faedcd] hover:bg-[#f9e4c1] text-black font-semibold py-2 rounded-md mt-4"
        >
          {loading ? "Saving..." : "Update Order"}
        </button>
      </form>
    </div>
  );
};

export default EditOrders;
