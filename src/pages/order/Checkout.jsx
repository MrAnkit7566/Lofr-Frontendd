import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCart, clearCart } from "../../service/cartServices";
import { createOrder } from "../../service/orderService";
import { validateCoupon } from "../../service/couponService";
import axios from "axios";
import { getUserProfile } from "../../service/userService";

const Checkout = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [step, setStep] = useState(1);
  const [userEmail,setUserEmail] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    size:"",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    phone: "",
    payment_method: "razorpay",
  });

  // 🛒 Load Cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCart(userId);
        const userData = await getUserProfile(userId);
        // console.log("userData",userData.data.user.email);
        setUserEmail(userData.data.user.email);
        // console.log("logging cart data",res)

        setCartItems(res?.data?.cart?.items || []);
      } catch (error) {
        toast.error("Failed to load cart items");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [userId]);


  // 💰 Safe subtotal / total calculation
  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc + (Number(item.product_id?.salePrice) || 0) * (item.quantity || 1),
    0
  );
  const safeDiscount = Number(discount) || 0;
  const total = Math.max(subtotal - safeDiscount, 0); // ensure not negative

  // 📝 Handle address form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🎟 Apply Coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return toast.error("Enter a coupon code");

    try {
      const result = await validateCoupon(couponCode.trim(), subtotal);
      const { coupon } = result || {};

      if (!result.success || !coupon) {
        setDiscount(0);
        setAppliedCoupon(null);
        return toast.error("Invalid or expired coupon");
      }

      // ✅ Set applied coupon first (so message can display even if invalid by price)
      setAppliedCoupon(coupon);

      // ⚠️ Minimum purchase check
      if (subtotal < coupon.minimum_purchase) {
        setDiscount(0);
        return toast.error(
          `Minimum purchase of ₹${coupon.minimum_purchase} required for this coupon`
        );
      }

      // 🧮 Calculate discount manually if backend didn’t send it
      let discountAmount = result.discountAmount;
      if (!discountAmount) {
        if (coupon.discount_type === "percentage") {
          discountAmount = (subtotal * coupon.discount_value) / 100;
        } else {
          discountAmount = coupon.discount_value;
        }
      }

      setDiscount(discountAmount);

      toast.success(
        `Coupon "${coupon.code}" applied! You saved ₹${discountAmount.toFixed(
          2
        )}`
      );
    } catch (error) {
      // console.error("Coupon apply error:", error);
      setDiscount(0);
      setAppliedCoupon(null);
      toast.error(error.message || "Invalid or expired coupon");
    }
  };

  // 🧾 Proceed to Step 2
  const handleNextStep = () => {
    const required = [
      "full_name",
      "address_line1",
      "city",
      "state",
      "postal_code",
      "country",
      "phone",
    ];
    for (let field of required) {
      if (!formData[field]) return toast.error(`Please fill ${field}`);
    }
    setStep(2);
  };

  // ⚡ Load Razorpay SDK dynamically
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // 💳 Razorpay Payment Handler
  const handleRazorpayPayment = async (orderData) => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) return toast.error("Razorpay SDK failed to load");

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE}/api/orders/create-razorpay-order`,
        { total }
      );
      if (!data.success) return toast.error("Payment initialization failed");

      const { key, razorpayOrder } = data;

      const options = {
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Lofr.in Store",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_API_BASE}/api/orders/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData,
              }
            );

            if (verifyRes.data.success) {
              toast.success("✅ Payment successful!");
              await clearCart(userId);
              setCartItems([]);
              window.dispatchEvent(new Event("cartUpdated"));
              navigate("/order");
            } else {
              toast.error("⚠️ Payment verification failed!");
            }
          } catch (err) {
            // console.error(err);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: formData.full_name,
          email: userEmail,
          contact: formData.phone,
        },
        theme: { color: "#0F172A" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        toast.error("Payment cancelled or failed. Please try again!");
      });
      rzp.open();
    } catch (error) {
      // console.error("Razorpay Init Error:", error);
      toast.error("Payment initialization failed");
    }
  };
  // console.log("logging cart Items",{cartItems})

  // 🧾 Place Order
  const handlePlaceOrder = async () => {
    try {
      const items = cartItems.map((item) => ({
        product_id: item.product_id?._id,
        name: item.product_id?.name,
        price: item.product_id?.price,
        size:item.size,
        quantity: item.quantity,
        image: item.product_id?.image,
      }));

      const orderData = {
        user_id: userId,
        order_number: "ORD-" + Date.now(),
        items,
        subtotal,
        discount: safeDiscount,
        total,
        shipping_address: { ...formData },
        coupon_code: appliedCoupon?._id || null,
        payment_method: formData.payment_method,
      };

      if (formData.payment_method === "cod") {
        await createOrder({
          ...orderData,
          payment_status: "pending",
          status: "confirmed",
        });
        toast.success("Order placed successfully!");
        await clearCart(userId);
        setCartItems([]);
        window.dispatchEvent(new Event("cartUpdated"));
        navigate("/order");
      } else {
        await handleRazorpayPayment(orderData);
      }
    } catch (error) {
      // console.error(error);
      toast.error("Failed to place order");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 text-gray-500 text-sm">
        Loading checkout...
      </div>
    );

  return (
    <div className="bg-gray-50 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-2xl"
      >
        {/* Step Indicators */}
        <div className="flex justify-center mb-6 gap-4 text-sm font-medium">
          <span className={`${step === 1 ? "text-blue-600" : "text-gray-400"}`}>
            1. Shipping
          </span>
          <span className={`${step === 2 ? "text-blue-600" : "text-gray-400"}`}>
            2. Summary & Payment
          </span>
        </div>

        {/* Step 1 - Shipping */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Shipping Address
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "full_name",
                  "phone",
                  "address_line1",
                  "address_line2",
                  "city",
                  "state",
                  "postal_code",
                  "country",
                ].map((field, idx) => (
                  <input
                    key={idx}
                    name={field}
                    placeholder={field
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    value={formData[field]}
                    onChange={handleChange}
                    className="col-span-2 border p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ))}
                <motion.button
                  onClick={handleNextStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="col-span-2 mt-5 bg-black text-white py-3 rounded-lg shadow cursor-pointer"
                >
                  Continue
                </motion.button>
              </div>
            </div>

            {/* Summary */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Order Summary
              </h3>
              <div className="space-y-4 max-h-[45vh] overflow-y-auto">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex justify-between border-b pb-3">
                    <div className="flex gap-3">
                      <img
                        src={
                          item.product_id?.image?.startsWith("http")
                            ? item.product_id.image
                            : `${import.meta.env.VITE_API_BASE}/${item.product_id?.image?.replace(
                                /\\/g,
                                "/"
                              )}`
                        }
                        alt={item.product_id?.name}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                      <div>
                        <p className="font-medium text-gray-700 text-sm">
                          {item.product_id?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">
                      ₹
                      {Number(
                        item.product_id?.salePrice * item.quantity
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 - Payment */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Payment & Coupon
              </h2>

              {/* Coupon Input */}
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

              {/* ✅ Coupon Messages */}
              {appliedCoupon && subtotal < appliedCoupon.minimum_purchase ? (
                <p className="text-red-600 text-sm mb-2">
                  ⚠️ Minimum purchase of ₹{appliedCoupon.minimum_purchase} required to use this coupon.
                </p>
              ) : appliedCoupon ? (
                <p className="text-green-600 text-sm mb-2">
                  ✅ {appliedCoupon.code} applied — saved ₹
                  {Number(safeDiscount).toFixed(2)}
                </p>
              ) : null}

              {/* Payment Method */}
              <div className="mt-4">
                <label className="font-medium text-gray-700 mb-2 block text-sm">
                  Payment Method
                </label>
                <div className="flex gap-4">
                  {[
                    { id: "razorpay", label: "Pay Online" },
                    { id: "cod", label: "Cash on Delivery" },
                  ].map((m) => (
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
                  ))}
                </div>
              </div>

              <motion.button
                onClick={handlePlaceOrder}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="col-span-2 mt-5 w-full bg-black text-white py-3 rounded-lg shadow cursor-pointer"
              >
                Place Order
              </motion.button>
            </div>

            {/* Order Summary */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Order Summary
              </h3>
              <div className="text-sm text-gray-700 space-y-1 border-b pb-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{Number(subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-600">
                    -₹{Number(safeDiscount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
              </div>
              <div className="flex justify-between text-base font-semibold mt-3 mb-6">
                <span>Total</span>
                <span>₹{Number(total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Checkout;
