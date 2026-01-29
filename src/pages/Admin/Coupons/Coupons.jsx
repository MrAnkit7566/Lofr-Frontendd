import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Coupons = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [deletePopUp, setDeletePopUp] = useState(false);

  // Fetch coupons
  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/coupons`
      );
      // console.log(data)
      setCoupons(data.coupons || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch coupons");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Delete coupon
  const deleteCoupon = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE}/api/coupons/${id}`);
      toast.success("Coupon deleted successfully!");
      fetchCoupons();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete coupon");
    }
  };

  // Filter by search
  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center border rounded px-3 py-2 w-1/3">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search coupons..."
            className="outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="flex items-center gap-2 bg-[#fde9d4] text-[#d4a373] px-4 py-2 rounded hover:bg-[#fcd8b8] hover:scale-105 transition-all"
          onClick={() => navigate("/admin/dashboard/coupons/add")}
        >
           Add Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 text-[#d4a373]">Code</th>
              <th className="p-3 text-[#d4a373]">Description</th>
              <th className="p-3 text-[#d4a373]">Discount</th>
              <th className="p-3 text-[#d4a373]">Minimum Purchase</th>
              <th className="p-3 text-[#d4a373]">Expiry Date</th>
              <th className="p-3 text-[#d4a373]">Usage</th>
              <th className="p-3 text-[#d4a373]">Active</th>
              <th className="p-3 text-[#d4a373]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoupons.length > 0 ? (
              filteredCoupons.map((c) => (
                <tr key={c._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-semibold">{c.code}</td>
                  <td className="p-3">{c.description}</td>
                  <td className="p-3">
                    {c.discount_type === "percentage"
                      ? `${c.discount_value}%`
                      : `₹ ${c.discount_value}`}
                  </td>
                  <td className="p-3">₹ {c.minimum_purchase}</td>
                  <td className="p-3">{new Date(c.expiry_date).toLocaleDateString()}</td>
                  <td className="p-3">{c.usage_count}/{c.usage_limit}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded ${
                        c.is_active ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                      }`}
                    >
                      {c.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="flex gap-3 p-3">
                    <button
                      className="text-[#d4a373] cursor-pointer"
                      onClick={() => navigate(`/admin/dashboard/coupons/edit/${c._id}`)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                      onClick={() => {
                        setSelectedCoupon(c);
                        setDeletePopUp(true);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No coupons found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Popup */}
      {deletePopUp && selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4 text-[#d4a373]">Delete Coupon</h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedCoupon.code}</span>? This action
              cannot be undone.
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
                  await deleteCoupon(selectedCoupon._id);
                  setDeletePopUp(false);
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

export default Coupons;
