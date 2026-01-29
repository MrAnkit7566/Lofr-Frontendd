import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ViewOrders = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/orders/${id}`
      );
      console.log("data aa gay order", data);
      setOrder(data.order);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!order) return <p className="p-6 text-center">Order not found.</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b-2 border-indigo-500 pb-2">
        Order #{order.order_number}
      </h1>

      {/* User & Shipping */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
          <h3 className="text-lg font-semibold text-[#d4a373] mb-4">
            User Info
          </h3>
          <p className="text-gray-600">
            <strong className="text-gray-800">Name:</strong>{" "}
            {order.user_id?.name}
          </p>
          <p className="text-gray-600">
            <strong className="text-gray-800">Email:</strong>{" "}
            {order.user_id?.email}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
          <h3 className="text-lg font-semibold text-[#d4a373] mb-4">
            Shipping Address
          </h3>
          <p className="text-gray-600">{order.shipping_address.full_name}</p>
          <p className="text-gray-600">
            {order.shipping_address.address_line1}
          </p>
          {order.shipping_address.address_line2 && (
            <p className="text-gray-600">
              {order.shipping_address.address_line2}
            </p>
          )}
          <p className="text-gray-600">
            {order.shipping_address.city}, {order.shipping_address.state} -{" "}
            {order.shipping_address.postal_code}
          </p>
          <p className="text-gray-600">{order.shipping_address.country}</p>
          <p className="text-gray-600">Phone: {order.shipping_address.phone}</p>
        </div>
      </div>

      {/* Products */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-[#d4a373] mb-6">Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="border-2 border-gray-200  rounded-xl p-4 flex flex-col  hover:bg-gray-50 transition duration-300"
            >
              {item.image && (
                <img
                  src={`${import.meta.env.VITE_API_BASE}/${
                    item.product_id.image
                  }`}
                  alt={item.product_id.name || item.name}
                  className="w-full h-full object-cover rounded-lg mb-3 shadow-md"
                />
              )}
              <h4 className="text-md font-medium text-gray-800 mb-1">
                {item.name}
              </h4>
              <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
              {item.size && (
                <p className="text-gray-600 text-sm">Size: {item.size}</p>
              )}
              {item.color && (
                <p className="text-gray-600 text-sm">Color: {item.color}</p>
              )}
              <p className="text-lg font-bold text-[#d4a373] mt-2">
                ${item.price}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-[#d4a373] mb-6">
          Order Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-600">
              <strong className="text-gray-800">Subtotal:</strong> $
              {order.subtotal}
            </p>
            <p className="text-gray-600">
              <strong className="text-gray-800">Discount:</strong> $
              {order.discount}
            </p>
            <p className="text-gray-600">
              <strong className="text-gray-800">Total:</strong> ${order.total}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong className="text-gray-800">Coupon:</strong>{" "}
              {order.coupon_code || "N/A"}
            </p>
            <p className="text-gray-600">
              <strong className="text-gray-800">Status:</strong>{" "}
              <span
                className={`capitalize px-2 py-1 rounded ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "confirmed"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.status}
              </span>
            </p>
            <p className="text-gray-600">
              <strong className="text-gray-800">Payment Status:</strong>{" "}
              <span
                className={`capitalize px-2 py-1 rounded ${
                  order.payment_status === "completed"
                    ? "bg-green-100 text-green-800"
                    : order.payment_status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.payment_status}
              </span>
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong className="text-gray-800">Payment Method:</strong>{" "}
              {order.payment_method}
            </p>
            <p className="text-gray-600">
              <strong className="text-gray-800">Tracking #:</strong>{" "}
              {order.tracking_number || "N/A"}
            </p>
            <p className="text-gray-600">
              <strong className="text-gray-800">Carrier:</strong>{" "}
              {order.shipping_carrier || "N/A"}
            </p>
            <p className="text-gray-600">
              <strong className="text-gray-800">Estimated Delivery:</strong>{" "}
              {order.estimated_delivery
                ? new Date(order.estimated_delivery).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {order.additionalComments && (
        <div className="bg-white p-6 rounded-xl shadow-lg mt-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-[#d4a373] mb-4">
            Comments
          </h3>
          <p className="text-gray-600">{order.additionalComments}</p>
        </div>
      )}
    </div>
  );
};

export default ViewOrders;
