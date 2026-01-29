import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Define color mapping for order status
const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  returned: "bg-gray-100 text-gray-800",
};

// Define color mapping for payment status
const paymentColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-indigo-100 text-indigo-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deletePopUp, setDeletePopUp] = useState(false);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/orders`
      );
      setOrders(data.orders || []);
      // console.log(data.orders);
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Cancel order (instead of delete)
  const cancelOrder = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE}/api/orders/delete/${id}`
      );
      toast.success("Order cancelled successfully!");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Filter orders by search
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(search.toLowerCase()) ||
      order.user_id?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-6">
      {/* Search */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center border rounded px-3 py-2 w-1/3">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search orders..."
            className="outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">S.No.</th>
              <th className="p-3">Order Number</th>
              <th className="p-3">User</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payment Status</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{order.order_number}</td>
                <td className="p-3">{order.user_id?.name || "N/A"}</td>
                <td className="p-3">₹ {order.total}</td>
                <td>
                  <span
                    className={`px-3 py-1 capitalize rounded-full ${
                      statusColors[order.status] || ""
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  <span
                    className={`px-3 py-1 capitalize rounded-full ${
                      paymentColors[order.payment_status] || ""
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </td>

                <td className="p-3">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="flex gap-3 p-3">
                  <button
                    className="text-[#d4a373] cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/dashboard/orders/view/${order._id}`)
                    }
                  >
                    <FaEye />
                  </button>
                  <button
                    className="text-[#d4a373] cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/dashboard/orders/edit/${order._id}`)
                    }
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                    onClick={() => {
                      setSelectedOrder(order);
                      setDeletePopUp(true);
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cancel Popup */}
      {deletePopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4">Cancel Order</h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to cancel{" "}
              <span className="font-semibold">
                {selectedOrder?.order_number}
              </span>
              ? This will mark the order as <strong>cancelled</strong>.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 cursor-pointer"
                onClick={() => setDeletePopUp(false)}
              >
                Close
              </button>
              <button
                onClick={async () => {
                  try {
                    await cancelOrder(selectedOrder._id);
                    setDeletePopUp(false);
                    fetchOrders();
                  } catch (error) {
                    console.error("Error cancelling order:", error);
                  }
                }}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
