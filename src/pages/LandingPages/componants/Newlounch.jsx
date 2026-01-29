import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import ProductSkeleton from "../../components/ProductSkeleton";
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../../../service/wishlist";
import { getAllProducts } from "../../../service/productService";
import toast from "react-hot-toast";
import { useWishlist } from "../../../context/wishListContext";

const NewLaunch = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  let { wishlistCount, updateWishlist } = useWishlist();
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_BASE ;

  // Load all products
  const loadProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data.products || []);
    } catch (err) {
      // console.error("Failed to fetch products:", err);
    }
    finally{
      setLoading(false)
    }
  };

  // Load wishlist IDs
  const loadWishlist = async () => {
    try {
      const res = await fetchWishlist();
      const ids = (res.data.products || []).map((p) => p._id);
      setWishlistIds(ids);
    } catch (err) {
      // console.error("Failed to fetch wishlist:", err);
    }
  };
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    loadProducts();
    loadWishlist();
  }, []);

  // Toggle wishlist
  const toggleWishlistHandler = async (e, productId) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const data = {
      user: userId,
      products: [productId],
    };
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
        await addToWishlist(data);
        await updateWishlist();
        toast.success("Added to wishlist");
      }
      await loadWishlist();
    } catch (err) {
      // console.error("Wishlist error:", err);
      toast.error("Wishlist update failed");
    }
  };

  if (loading) {
    return (
     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <ProductSkeleton key={idx} />
          ))}
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl font-bold mb-6">New Launches</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((p) => {
          const { _id, name, price, salePrice, img, image, sizes } = p;
          const productImage =
            img || image
              ? `${API_BASE}/${img || image}`
              : "https://via.placeholder.com/300";
              // console.log(p);
              // console.log("product image",productImage)
          const productSizes = sizes?.length ? sizes : ["S", "M", "L", "XL"];
          const isInWishlist = wishlistIds.includes(_id);

          return (
            <div
              key={_id}
              onClick={() => navigate(`/product/${_id}`)}
              className="relative group bg-white rounded-lg overflow-hidden h-100 cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
            >
              <button
                onClick={(e) => toggleWishlistHandler(e, _id)}
                className={`absolute right-3 top-3 p-2 rounded-full shadow-md transition z-20
    ${isInWishlist ? "bg-red-100" : "bg-white hover:bg-red-50"}`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isInWishlist ? "text-red-500 fill-red-500" : "text-gray-500"
                  }`}
                />
              </button>

              <img
                src={productImage}
                alt={name}
                className="w-full h-100 object-cover transition-all duration-500 group-hover:h-full"
              />

              <div className="absolute bottom-0 left-0 right-0 bg-white/90 transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-10 p-2">
                <h3 className="text-sm font-semibold">{name}</h3>
                {salePrice ? (
                  <div className="flex items-center gap-2">
                    <p className="text-gray-800 font-semibold">₹{salePrice}</p>
                    <p className="text-gray-400 line-through">₹{price}</p>
                  </div>
                ) : (
                  <p className="text-gray-800">₹{price}</p>
                )}
                
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewLaunch;
