import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getCart,
  removeItem,
  updateCart,
  clearCart,
} from "../../service/cartServices";
import { getProductById } from "../../service/productService";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const[total,setTotal] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const isLoggedIn = !!userId && !!token;

  // 🛍 Fetch Cart
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await getCart(userId);
      console.log("Cart fetched:", res.data);
      console.log("Cart fetched:", res.data.cart.total);
      setTotal(res.data.cart.total)
      if (res.data.cart) {
        const items = res.data.cart.items || [];

        const enrichedItems = await Promise.all(
          items.map(async (item) => {
            const productId = item.product_id?._id || item.product_id;
            if (!productId) return item;
            try {
              const productRes = await getProductById(productId);
              const productData = productRes.data.product || productRes.data || {};
              return { ...item, product: productData };
            } catch {
              return item;
            }
          })
        );

        setCartItems(enrichedItems);
        // console.log(enrichedItems)
        setCartId(res.data.cart._id);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      // console.error(err);
      toast.error("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchCart();
    else setLoading(false);
  }, [isLoggedIn]);

  // 🧮 Update quantity
  const updateQty = async (productId, quantity) => {
    if (quantity < 1) return;
    const updatedCart = cartItems.map((item) =>
      (item.product?._id || item.product_id?._id) === productId
        ? { ...item, quantity }
        : item
    );
    setCartItems(updatedCart);
    try {
      await updateCart({ cartId, productId, quantity });
      window.dispatchEvent(new Event("cartUpdated")); // 🔥 Update Header
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  // ❌ Remove item
  const removeCartItem = async (productId) => {
    try {
      await removeItem(cartId, productId); 
      setCartItems(
        cartItems.filter(
          (item) =>
            (item.product?._id || item.product_id?._id) !== productId
        )
      );
      toast.success("Item removed");
      window.dispatchEvent(new Event("cartUpdated")); // 🔥 Update Header
    } catch (err) {
      // console.error(err);
      toast.error("Failed to remove item");
    }
  };

  // 🧹 Clear Cart
  const handleClearCart = async () => {
    try {
      await clearCart(userId);
      setCartItems([]);
      toast.success("Cart cleared");
      window.dispatchEvent(new Event("cartUpdated")); // 🔥 Update Header
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  // 💳 Checkout
  const handleCheckout = () => {
    if (!isLoggedIn) {
      toast.error("Please log in to checkout");
      return navigate("/login");
    }
    navigate("/checkout");
  };

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc +
      (item.product?.salePrice || item.product_id?.price || 0) *
        (item.quantity || 0),
    0
  );

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500 animate-pulse">
        Loading your cart...
      </div>
    );

  if (!isLoggedIn)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-6">
        <div className="bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-lg text-center max-w-md w-full border">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">
            You’re not logged in
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view your shopping cart and complete your order.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 rounded-xl bg-black text-white font-semibold hover:scale-105 transition"
          >
            Login
          </button>
        </div>
      </div>
    );

  if (cartItems.length === 0)
    return (
      <div className="h-100 flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-xl text-gray-600">Your cart is empty 🛒</h2>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 tracking-tight">
          Shopping Cart
        </h1>
        <div className="space-y-5">
          {cartItems.map((item, index) => {
            const product = item.product || item.product_id || {};
            // console.log("ftetchin",item)
            const key = product._id || `cart-item-${index}`;
            const imgSrc = product.image
              ? `${import.meta.env.VITE_API_BASE}/${product.image.replace(/\\/g, "/")}`
              : "/placeholder.png";

            return (
              <div
                key={key}
                className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 flex flex-col sm:flex-row sm:items-center justify-between"
              >
                <div className="flex items-center gap-5 flex-1">
                  <img
                    src={imgSrc}
                    alt={product.name || "Product"}
                    className="w-28 h-32 object-cover rounded-xl border border-gray-200"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {product.name || "Unnamed Product"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      {product.color ? `Color: ${product.color}` : ""}
                    </p>
                    <p className="text-sm text-gray-500">
                      Size: {item.size}
                    </p>
                    <button
                      onClick={() => removeCartItem(product._id)}
                      className="text-red-500 mt-3 text-sm font-medium hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 mt-4 sm:mt-0">
                  <div className="flex items-center border rounded-lg shadow-sm bg-gray-50">
                    <button
                      onClick={() => updateQty(product._id, item.quantity - 1)}
                      className="px-3 py-1 border-r text-gray-600 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-4 font-semibold text-gray-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(product._id, item.quantity + 1)}
                      className="px-3 py-1 border-l text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <div className="font-semibold text-gray-900 text-lg whitespace-nowrap">
                    ₹{(product.salePrice * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-md p-6 h-fit lg:sticky lg:top-20">
        <h3 className="text-2xl font-semibold mb-5 text-gray-900">Order Summary</h3>
        <div className="space-y-3 text-gray-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount on MRP</span>
            <span className="text-green-600 font-medium">-₹ {total-subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-green-600 font-medium">Free</span>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between font-bold text-lg text-gray-900">
            <span>Total</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full mt-6 bg-black text-white py-3 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-[1.02] transition-all"
        >
          Proceed to Checkout
        </button>
        <button
          onClick={handleClearCart}
          className="w-full mt-3 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default Cart;
