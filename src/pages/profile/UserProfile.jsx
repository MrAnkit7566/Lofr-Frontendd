import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Truck, LogOut, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserProfile } from "../../service/userService";
import { getOrdersByUser } from "../../service/orderService";
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../../service/wishlist";
import { handleTokenError } from "../../utils/handleTokenError";

const SidebarItem = ({ icon: Icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-sm ${
      active ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [active, setActive] = useState("overview");
  const [arrowAnimating, setArrowAnimating] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Redirect if not logged in
  useEffect(() => {
    if (!userId || !token) {
      toast.error("Please login to view profile");
      navigate("/login");
    }
  }, [userId, token, navigate]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile(userId);
        setUser(res.data.user || {});
      } catch (err) {
        if (!handleTokenError(err, navigate)) {
          toast.error("Failed to load profile");
        }
      }
    };
    fetchProfile();
  }, [userId, navigate]);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrdersByUser(userId);
        setOrders(res.data.orders || []);
      } catch (err) {
        handleTokenError(err, navigate);
      }
    };
    fetchOrders();
  }, [userId, navigate]);

  // Fetch wishlist
  const loadWishlist = async () => {
    try {
      const res = await fetchWishlist();
      const ids = (res.data.wishlist?.products || []).map((p) => p._id);
      setWishlistIds(ids);
    } catch (err) {
      if (!handleTokenError(err, navigate)) {
        // console.error("Failed to fetch wishlist", err);
      }
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  // Toggle wishlist
  const toggleWishlistHandler = async (productId) => {
    if (!token || !userId) {
      toast.error("Please log in to use wishlist");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    try {
      if (wishlistIds.includes(productId)) {
        await removeFromWishlist(productId);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist([productId]);
        toast.success("Added to wishlist");
      }
      await loadWishlist();
    } catch (err) {
      if (!handleTokenError(err, navigate)) {
        toast.error("Wishlist update failed");
      }
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  const avatar =
    user.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.name || "User"
    )}&background=EEE&color=333`;

  const handleViewOrders = () => {
    setArrowAnimating(true);
    setTimeout(() => {
      navigate("/order");
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-3 bg-white rounded-2xl p-5 shadow-sm sticky top-6 h-fit">
          <div className="flex items-center gap-3">
            <img
              src={avatar}
              alt="avatar"
              className="w-14 h-14 rounded-full object-cover border"
            />
            <div>
              <div className="text-lg font-semibold text-gray-800">
                {user.name}
              </div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <SidebarItem
              icon={Truck}
              label={`Orders (${orders.length})`}
              onClick={() => setActive("orders")}
              active={active === "orders"}
            />
            <SidebarItem
              icon={Mail}
              label="Contact"
              onClick={() => setActive("contact")}
              active={active === "contact"}
            />
            <SidebarItem
              icon={LogOut}
              label="Logout"
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            />
          </div>
        </aside>

        {/* Main Section */}
        <main className="lg:col-span-9 space-y-6 overflow-y-auto max-h-[80vh] pr-2">
          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Overview
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Summary of your account activity
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div
                  onClick={() => setActive("orders")}
                  className="text-center cursor-pointer"
                >
                  <div className="text-2xl font-semibold text-gray-800">
                    {orders.length}
                  </div>
                  <div className="text-xs text-gray-500">Orders</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Orders Section */}
          {active === "orders" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm max-h-[500px] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Recent Orders</h3>
                <button
                  onClick={handleViewOrders}
                  className="px-4 py-2 flex items-center gap-2 text-sm font-medium text-gray-600"
                >
                  View All Orders
                  <motion.span
                    animate={arrowAnimating ? { x: 5 } : { x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight />
                  </motion.span>
                </button>
              </div>

              {orders.length ? (
                <div className="space-y-3 pr-2">
                  {orders.map((o) => (
                    <div
                      key={o._id || o.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <div>
                        <div className="font-medium text-gray-700">
                          {o.order_number || `Order ${o._id || o.id}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          Placed on{" "}
                          {new Date(
                            o.createdAt || o.date || Date.now()
                          ).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          ₹{(o.total || o.amount || 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {o.status || "Processing"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No orders yet.</div>
              )}
            </motion.div>
          )}

          {/* Contact Section */}
          {active === "contact" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h3 className="font-semibold text-gray-800 mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="text-gray-800">{user.email || "N/A"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="text-gray-800">{user.phone || "N/A"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="text-gray-800">
                      {user.location || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
