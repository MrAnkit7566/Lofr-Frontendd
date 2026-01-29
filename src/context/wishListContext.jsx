import { createContext, useContext, useState, useEffect } from "react";
import {
  fetchWishlist,
  addToWishlist as addAPI,
  removeFromWishlist as removeAPI,
  clearWishlist as clearAPI,
} from "../service/wishlist";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  // 🔄 Fetch wishlist and update count
  const updateWishlist = async () => {
    try {
      const res = await fetchWishlist();
      const products = res.data?.wishlist?.products || res.data?.products || [];
      setWishlist(products);
      setWishlistCount(products.length);
    } catch (err) {
      // console.error("❌ Failed to fetch wishlist:", err);
      setWishlist([]);
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    // Initial load
    updateWishlist();

    // ✅ Listen for global wishlist updates
    const handleWishlistUpdated = () => updateWishlist();
    window.addEventListener("wishlistUpdated", handleWishlistUpdated);

    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdated);
    };
  }, []);

  // ➕ Add product
  const addToWishlist = async (productIds) => {
    try {
      await addAPI(productIds);
      window.dispatchEvent(new Event("wishlistUpdated")); // ✅ notify all listeners
    } catch (err) {
      // console.error("❌ Failed to add to wishlist:", err);
    }
  };

  // ❌ Remove product
  const removeFromWishlist = async (productId) => {
    try {
      await removeAPI(productId);
      window.dispatchEvent(new Event("wishlistUpdated")); // ✅ notify all listeners
    } catch (err) {
      // console.error("❌ Failed to remove from wishlist:", err);
    }
  };

  // 🗑 Clear wishlist
  const clearWishlist = async () => {
    try {
      await clearAPI();
      setWishlist([]);
      setWishlistCount(0);
      window.dispatchEvent(new Event("wishlistUpdated")); // ✅ sync across app
    } catch (err) {
      // console.error("❌ Failed to clear wishlist:", err);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        updateWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
