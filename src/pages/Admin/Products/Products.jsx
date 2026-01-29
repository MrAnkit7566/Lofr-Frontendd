import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash, FaStar, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { NavLink ,useNavigate } from "react-router-dom";


const Products = () => {
  let navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deletePopUp, setDeletePopUp] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/products`
      );
      setProducts(data.products || []);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE}/api/products/delete/${id}`);
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Filter & Search
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category_id?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || p.category_id?.name === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      {/* Search & Filter */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {/* Search */}
          <div className="flex items-center border rounded px-3 py-2 w-1/3">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              className="outline-none w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter */}
          <select
            className="border px-3 py-2 rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Fashion">Fashion</option>
            <option value="Hand Bag">Hand Bag</option>
            <option value="Cap">Cap</option>
            <option value="Electronics">Electronics</option>
          </select>
        </div>
        <NavLink to="/admin/dashboard/products/add">
          <button className="bg-[#fde4c9] text-black px-5 py-2 cursor-pointer rounded-lg text-lg hover:bg-[#d6ccc2] hover:scale-105 active:scale-95 transition-all duration-200">
            Add Product
          </button>
        </NavLink>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Product Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Category</th>
              <th className="p-3">Color / Size</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => {
              const image = p.image ? `${import.meta.env.VITE_API_BASE}/${p.image}` : "https://via.placeholder.com/50";

              return (
                <tr key={p._id} className="border-b hover:bg-gray-50">
                  {/* Product Image + Name */}
                  <td className="p-3 flex items-center gap-3 ">
                    <img
                      src={image}
                      alt={p.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <div className="font-semibold">{p.name}</div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="p-3 ">${p.price}</td>

                  {/* Stock */}
                  <td className="p-3 ">{p.quantity} Item{p.quantity > 1 ? "s" : ""}</td>

                  {/* Category */}
                  <td className="p-3 ">{p.category_id?.name || "N/A"}</td>

                  {/* Color / Size */}
                  <td className="p-3 ">
  {p.color} / {Array.isArray(p.size) ? p.size.join(", ") : p.size}
</td>

                {/* {p.size} */}
                  
                  {/* Actions */}
                  <td className="flex gap-3 ">
                    <button className="text-[#d4a373]  cursor-pointer" onClick={()=>{
                      navigate(`/admin/dashboard/products/getproduct/${p._id}`)
                    }}>
                      <FaEye  />
                    </button>
                    <button className="text-[#d4a373] cursor-pointer"  onClick={()=>{
                      navigate(`/admin/dashboard/products/edit/${p._id}`)
                    }}>
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                      onClick={() => {
                        setSelectedProduct(p);
                        setDeletePopUp(true);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Popup */}
      {deletePopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4">Delete Product</h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedProduct.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 cursor-pointer"
                onClick={() => setDeletePopUp(false)}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteProduct(selectedProduct._id);
                    setDeletePopUp(false);
                    fetchProducts();
                  } catch (error) {
                    console.error("Error deleting product:", error);
                  }
                }}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Products;
