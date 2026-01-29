import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCart, clearCart } from "../../service/cartServices";
import { createOrder } from "../../service/orderService";
import { validateCoupon } from "../../service/couponService";

const Checkout = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    phone: "",
    payment_method: "cod",
  });

  // 🛒 Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCart(userId);
        const items = res?.data?.cart?.items || [];
        setCartItems(items);
      } catch (error) {
        // console.error(error);
        toast.error("Failed to load cart items");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [userId]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product_id?.price || 0) * (item.quantity || 1),
    0
  );

  const total = subtotal - discount;

  // 📝 Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🎟 Apply Coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return toast.error("Enter a coupon code");

    try {
      const result = await validateCoupon(couponCode.trim(), subtotal);
      setDiscount(result.discountAmount);
      setAppliedCoupon(result.coupon);
      
      toast.success(`Coupon "${result.coupon.code}" applied!`);
    } catch (error) {
      // console.error("Coupon apply error:", error);
      setDiscount(0);
      setAppliedCoupon(null);
      toast.error(error.message || "Invalid or expired coupon");
    }
  };

  // 🧾 Submit Order
  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "full_name",
      "address_line1",
      "city",
      "state",
      "postal_code",
      "country",
      "phone",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in ${field.replace("_", " ")}`);
        return;
      }
    }

    try {
      const items = cartItems.map((item) => ({
        product_id: item.product_id?._id,
        name: item.product_id?.name,
        price: item.product_id?.price,
        quantity: item.quantity,
        image: item.product_id?.image,
      }));

      const orderData = {
        user_id: userId,
        order_number: "ORD-" + Date.now(),
        items,
        subtotal,
        discount,
        total,
        payment_method: formData.payment_method,
        shipping_address: { ...formData },
        coupon: appliedCoupon?._id || null,
      };

      const res = await createOrder(orderData);

      if (res.status === 201 || res.data.success) {
        toast.success("Order placed successfully!");
        await clearCart(userId);
        setTimeout(() => navigate("/order"), 1000);
      } else {
        toast.error("Failed to place order");
      }
    } catch (err) {
      // console.error(err);
      toast.error("Something went wrong!");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 text-gray-500 text-sm">
        Loading checkout...
      </div>
    );

      //payment razorpay integation

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      descriptin: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        // console.log(response);

        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verifyRazorpay`,
            response,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if(data.success){
            getUsersAppointments()
            navigate('/myAppointments')
          }
        } catch (error) {
          // console.log(error);
          toast.error(error.message)
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/paymentRazorpay`,
        { appointmentId }, // we're sending only appointmentId here
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // console.log(data.order);

      if (data.success) {
        initPay(data.order);
        // console.log(data.order)
      }
    } catch (error) {
      // console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-gray-50 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-8 rounded-2xl shadow-2xl"
      >
        {/* LEFT: SHIPPING FORM */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Shipping Address
          </h2>

          <form onSubmit={handleOrderSubmit} className="grid grid-cols-2 gap-4">
            <input
              name="full_name"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={handleChange}
              className="col-span-2 border p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="col-span-2 border p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              name="address_line1"
              placeholder="Address Line 1"
              value={formData.address_line1}
              onChange={handleChange}
              className="col-span-2 border p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              name="address_line2"
              placeholder="Address Line 2 (Optional)"
              value={formData.address_line2}
              onChange={handleChange}
              className="col-span-2 border p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="border p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              className="border p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              name="postal_code"
              placeholder="Postal Code"
              value={formData.postal_code}
              onChange={handleChange}
              className="border p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              className="border p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            <div className="col-span-2 mt-2">
              <label className="font-medium text-gray-700 mb-2 block text-sm">
                Payment Method
              </label>
              <div className="flex gap-4">
                {[{ id: "cod", label: "Cash on Delivery" }, { id: "upi", label: "UPI" }].map(
                  (m) => (
                    <label
                      key={m.id}
                      className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer text-sm ${
                        formData.payment_method === m.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={m.id}
                        checked={formData.payment_method === m.id}
                        onChange={handleChange}
                      />
                      {m.label}
                    </label>
                  )
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="col-span-2 mt-5 bg-black text-white py-3 rounded-lg shadow"
            >
              Place Order
            </motion.button>
          </form>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="border-l pl-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Summary</h3>

          <div className="flex mb-4">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Promo code"
              className="flex-1 border rounded-l-lg p-2 text-sm outline-none"
            />
            <button
              onClick={handleApplyCoupon}
              type="button"
              className="bg-gray-800 text-white px-4 text-sm rounded-r-lg hover:bg-black"
            >
              Apply
            </button>
          </div>

          {appliedCoupon && (
            <p className="text-green-600 text-sm mb-2">
              ✅ {appliedCoupon.code} applied — saved ₹{discount.toFixed(2)}
            </p>
          )}

          <div className="text-sm text-gray-700 space-y-1 border-b pb-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-600">-₹{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">FREE</span>
            </div>
          </div>

          <div className="flex justify-between text-base font-semibold mt-3 mb-6">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <h4 className="text-base font-semibold text-gray-800 mb-3">
            🛒 Cart ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
          </h4>

          <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
            {cartItems.map((item, i) => (
              <div key={i} className="flex justify-between border-b pb-3">
                <div className="flex gap-3">
                  <img
                    src={
                      item.product_id?.image
                        ? item.product_id.image.startsWith("http")
                          ? item.product_id.image
                          : `${import.meta.env.VITE_API_BASE}/${item.product_id.image.replace(
                              /\\/g,
                              "/"
                            )}`
                        : "/placeholder.png"
                    }
                    alt={item.product_id?.name || "Product"}
                    className="w-16 h-16 object-cover rounded-md border"
                  />

                  <div>
                    <p className="font-medium text-gray-700 text-sm">
                      {item.product_id?.name}
                    </p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-800 text-sm">
                  ₹{(item.product_id?.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;
