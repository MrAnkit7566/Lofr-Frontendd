import React, { useEffect, useState } from "react";
import { fetchWishlist, removeFromWishlist, clearWishlist } from "../../service/wishlist";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useWishlist } from "../../context/wishListContext";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const [wishlist, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const {updateWishlist} = useWishlist();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE;

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const res = await fetchWishlist();
      // console.log(res);
      setWishlistItems(res.data.products || []);
    } catch (error) {
      // console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (id) => {
    await removeFromWishlist(id);
    await updateWishlist()
    toast.success("Item removed from wishlist");
    loadWishlist();
  };

  const handleClear = async () => {
    await clearWishlist();
    toast.success("Wishlist cleared");
        await updateWishlist()
    setWishlistItems([]);
  };

  if (loading) return <p className="h-100 flex items-center justify-center text-2xl text-gray-500">Loading wishlist...</p>;
  if (!wishlist.length) return <p className="h-100 flex items-center justify-center text-xl text-gray-600">Wishlist is empty ❤️</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
      <button
        onClick={handleClear}
        className="mb-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Clear All
      </button>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {wishlist.map((p) => {
          const { _id, name, price, salePrice, img, image, sizes } = p;
          const productImage = img || image
            ? `${API_BASE}/${img || image}`
            : "https://via.placeholder.com/300";
          const productSizes = sizes?.length ? sizes : ["S", "M", "L", "XL"];

          return (
            <div
              key={_id}
              onClick={() => navigate(`/product/${_id}`)}
              className="relative group bg-white rounded-lg overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(_id);
                }}
                className="absolute right-3 top-3 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition z-20"
              >
                <Trash2 className="w-5 h-5 text-red-500 fill-red-500" />
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
                <div className="flex gap-2 mt-2 flex-wrap">
                  {productSizes.map((size, idx) => (
                    <span
                      key={idx}
                      className="text-xs border px-2 py-1 rounded-md bg-gray-50 text-gray-600"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
