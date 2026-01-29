import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const AddEditAnnouncement = () => {
  const { id } = useParams(); // agar id hai to edit mode hoga
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", isActive: false });
  const [loading, setLoading] = useState(false);

  // Agar edit mode hai, data fetch karke form prefill
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE}/api/announcements/${id}`
          );

          setForm({
            name: res.data.announcement.name,
            isActive: res.data.announcement.isActive,
          });
        } catch (err) {
          console.error(err);
          toast.error("Failed to fetch announcement!");
        }
      };
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        // Edit mode
        await axios.put(
          `${import.meta.env.VITE_API_BASE}/api/announcements/${id}`,
          form
        );
        toast.success("Announcement updated successfully!");
      } else {
        // Add mode
        await axios.post(
          `${import.meta.env.VITE_API_BASE}/api/announcements/add`,
          form
        );
        toast.success("Announcement added successfully!");
      }

      navigate("/admin/dashboard/announcements"); // save/update ke baad list page pe redirect
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {id ? "Edit Announcement" : "Add Announcement"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter announcement"
              required
            />
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            <span>Active</span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard/announcements")}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>

           
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-black font-bold cursor-pointer transition-all duration-200 ${
                id
                  ? "bg-green-600 hover:bg-green-700 disabled:bg-green-400"
                  : "bg-[#fde4c9] hover:bg-[#f8e6d3] disabled:bg-[#f0d8b8]"
              }`}
            >
              {loading
                ? id
                  ? "Updating..."
                  : "Saving..."
                : id
                ? "Update"
                : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditAnnouncement;
