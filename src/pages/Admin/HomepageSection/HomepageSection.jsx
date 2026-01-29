import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaPlus, FaImage } from "react-icons/fa";
import { toast } from "react-toastify";

const HomepageSection = () => {
  const [carousels, setCarousels] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_BASE ;


  const fetchCarousel = async () => {
    try {
      const { data } = await axios.get(`${API}/api/carousel`);
      setCarousels(data || []);
    } catch (error) {
      toast.error("Failed to load carousel images");
    }
  };

  useEffect(() => {
    fetchCarousel();
  }, []);

  const addCarousel = async (e) => {
    e.preventDefault();
    if (!file) return toast.warn("Please select an image");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", title);

      const { data } = await axios.post(`${API}/api/carousel`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Image uploaded!");
      setCarousels((prev) => [...prev, data]);
      setFile(null);
      setTitle("");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const deleteCarousel = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await axios.delete(`${API}/api/carousel/${id}`);
      toast.success("Deleted successfully!");
      setCarousels((prev) => prev.filter((item) => item._id !== id));
    } catch {
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-5">Carousel Management</h2>

      {/* Add Image */}
      <form
        onSubmit={addCarousel}
        className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col md:flex-row gap-4 items-center"
      >
        <div className="flex items-center gap-2 w-full md:w-1/3">
          <FaImage className="text-gray-600" />
          <input
            type="file"
            accept="image/*"
            className="border px-3 py-2 rounded w-full"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <input
          type="text"
          placeholder="Title (optional)"
          className="border px-3 py-2 rounded w-full md:w-1/3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-[#fde4c9] text-black px-4 py-2 rounded-lg hover:bg-[#d6ccc2] hover:scale-105 transition-all duration-200"
        >
          <FaPlus className="inline mr-2" />
          {loading ? "Uploading..." : "Add"}
        </button>
      </form>

      {/* Display Images */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Image</th>
              <th className="p-3">Title</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {carousels.map((c) => (
              <tr key={c._id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <img
                    src={`${API}/${c.imageUrl}`}
                    alt={c.title || "carousel"}
                    className="w-24 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-3">{c.title || "—"}</td>
                <td className="text-center">
                  <button
                    onClick={() => deleteCarousel(c._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {carousels.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No images yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomepageSection;
