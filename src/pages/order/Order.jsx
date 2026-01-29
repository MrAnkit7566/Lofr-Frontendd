import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, Truck, XCircle, X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { getOrdersByUser, getOrderById, deleteOrder } from "../../service/orderService";

const statusColors = {
  delivered: "bg-green-100 text-green-800",
  processing: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
  pending: "bg-gray-100 text-gray-800",
  confirmed: "bg-blue-100 text-blue-800",
};

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelModal, setCancelModal] = useState({ show: false, orderId: null });
  const [expandedOrders, setExpandedOrders] = useState({});
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        toast.error("User not logged in");
        return;
      }
      setLoading(true);
      try {
        const res = await getOrdersByUser(userId);
        setOrders(res.data?.orders || []);
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to fetch orders";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleViewDetails = async (orderId) => {
    try {
      const res = await getOrderById(orderId);
      setSelectedOrder(res.data?.order);
    } catch {
      toast.error("Failed to load order details");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      toast.success("Order canceled successfully!");
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: "cancelled" }));
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to cancel order";
      toast.error(msg);
    } finally {
      setCancelModal({ show: false, orderId: null });
    }
  };

  // Remove order completely from UI
  const handleRemoveOrder = (orderId) => {
    setOrders((prev) => prev.filter((order) => order._id !== orderId));
    toast.success("Order removed from the list");
    if (selectedOrder?._id === orderId) setSelectedOrder(null);
  };

  if (!userId)
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Please log in to view your orders.</div>;

  if (loading)
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;

  if (!orders.length)
    return <div className="min-h-screen flex items-center justify-center text-gray-500">You don’t have any orders yet.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center sm:text-left">Your Orders</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order, index) => {
            const statusLower = order.status?.toLowerCase() || "pending";
            const canCancel = ["processing", "pending", "confirmed"].includes(statusLower);
            const isExpanded = expandedOrders[order._id] || false;

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between hover:shadow-lg transition relative"
              >
                {/* Remove Button Top Right */}
                {/* <button
                  onClick={() => handleRemoveOrder(order._id)}
                  className="absolute top-1 right-2 text-gray-700 hover:text-red-500 hover:cursor-pointer"
                  title="Remove Order"
                >
                  x
                </button> */}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Order #{order.order_number || order._id?.slice(-6)}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[statusLower]}`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-1"><strong>Total:</strong> ₹{order.total?.toFixed(2) || 0}</p>
                  <p className="text-gray-600 text-sm mb-1"><strong>Payment:</strong> {order.payment_status || "Pending"}</p>
                  <p className="text-gray-400 text-xs mb-3">
                    Ordered on {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}
                  </p>

                  <div className="space-y-2">
                    <motion.div
                      initial={false}
                      animate={{ maxHeight: isExpanded ? 9999 : 70 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 mb-2">
                          <img
                            src={item.image ? `${import.meta.env.VITE_API_BASE}/${item.image.replace(/\\/g, "/")}` : "/placeholder.png"}
                            alt={item.name || "Product"}
                            className="w-12 h-12 object-cover rounded-md border flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                            <p className="text-xs text-gray-500 truncate">
                              Qty: {item.quantity || 1} × ₹{item.price || 0}
                            </p>
                          </div>
                        </div>
                      ))}
                    </motion.div>

                    {order.items?.length > 2 && (
                      <button
                        onClick={() => toggleExpand(order._id)}
                        className="text-blue-600 text-xs font-medium hover:underline mt-1"
                      >
                        {isExpanded ? "View Less" : `View More (${order.items.length - 2} more)`}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t pt-3 gap-2">
                  {statusLower === "delivered" ? <CheckCircle className="w-6 h-6 text-green-500" /> :
                  statusLower === "processing" ? <Loader2 className="w-6 h-6 text-yellow-500 animate-spin" /> :
                  <Truck className="w-6 h-6 text-gray-400" />}

                  <button
                    onClick={() => handleViewDetails(order._id)}
                    className="ml-auto px-3 py-1 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                  >
                    View Details
                  </button>

                  {canCancel && (
                    <button
                      onClick={() => setCancelModal({ show: true, orderId: order._id })}
                      className="flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {cancelModal.show && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <XCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Cancel Order</h3>
              <p className="text-gray-600 mb-4">Are you sure you want to cancel this order?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleCancelOrder(cancelModal.orderId)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Yes, Cancel
                </button>
                <button
                  onClick={() => setCancelModal({ show: false, orderId: null })}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  No, Keep
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[80vh]  overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 "
              >
                <X size={24} />
              </button>

              <h3 className="text-xl font-bold mb-4 text-gray-800">Order Details</h3>
              <p className="text-sm text-gray-600 mb-2"><strong>Order #: </strong>{selectedOrder.order_number || selectedOrder._id?.slice(-6)}</p>
              <p className="text-sm text-gray-600 mb-2"><strong>Status: </strong>{selectedOrder.status}</p>
              <p className="text-sm text-gray-600 mb-4"><strong>Total: </strong>₹{selectedOrder.total?.toFixed(2)}</p>

              <div className="space-y-3">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 border-b pb-2">
                    <img
                      src={item.image ? `${import.meta.env.VITE_API_BASE}/${item.image.replace(/\\/g, "/")}` : "/placeholder.png"}
                      alt={item.name || "Product"}
                      className="w-16 h-16 object-cover rounded-md border flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-medium">{item.name}</p>
                      <p className="text-gray-500 text-sm">Qty: {item.quantity || 1} × ₹{item.price || 0}</p>
                    </div>
                    <p className="text-gray-800 font-semibold">₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Order;
