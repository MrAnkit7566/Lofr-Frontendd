import React, { useEffect, useState } from "react";
import axios from "axios";

const RecentProducts = () => {
  const [products, setProducts] = useState([]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/products`
      );
      // Sirf latest 5 products
      const latest = (data.products || []).slice(-5).reverse();
      setProducts(latest);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <h2 className="text-lg font-bold text-[#d4a373] mb-4">
        Recent Products
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent products</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {products.map((p) => {
            const image = p.image
              ? `${import.meta.env.VITE_API_BASE}/${p.image}`
              : "https://via.placeholder.com/50";

            return (
              <li key={p._id} className="flex items-center gap-4 py-3">
                {/* Product image */}
                <img
                  src={image}
                  alt={p.name}
                  className="w-12 h-12 rounded object-cover border"
                />

                {/* Product Info */}
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{p.name}</p>
                  <p className="text-sm text-gray-500">{p.category_id?.name}</p>
                </div>

                {/* Price */}
                <span className="text-sm font-semibold text-[#d4a373]">
                  ${p.price}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default RecentProducts;
