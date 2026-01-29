import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AnnouncementBar = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  let navigate = useNavigate();

  // Fetch Announcements
  const fetchAnnouncements = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/announcements`
      );
      setAnnouncements(data.announcements);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load announcements");
    }
  };

  //  Delete Announcement
  const deleteAnnouncement = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE}/api/announcements/${id}`
      );
      toast.success("Announcement deleted successfully");
      fetchAnnouncements();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete announcement");
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  //  Filtered search
  const filteredAnnouncements = announcements.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/*  Search */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center border rounded px-3 py-2 w-1/3">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search announcements..."
            className="outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Add Announcement (future button) */}
        <NavLink to="/admin/dashboard/announcements/add">
          <button className="bg-[#fde4c9] text-black px-5 py-2 cursor-pointer rounded-lg text-lg hover:bg-[#d6ccc2] hover:scale-105 active:scale-95 transition-all duration-200">
            Add Announcement
          </button>
        </NavLink>
      </div>

      {/* Announcements Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">S.No.</th>
              <th className="p-3">Name</th>
              <th className="p-3">Active</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnnouncements.map((a, index) => (
              <tr key={a._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{a.name}</td>
                <td className="p-3">
                  {a.isActive ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-red-600 font-medium">Inactive</span>
                  )}
                </td>

                {/* Actions */}
                <td className="flex gap-3 p-3">
                  <button
                    className="text-blue-600 cursor-pointer hover:text-blue-800"
                    onClick={() => navigate(`/admin/dashboard/announcements/edit/${a._id}`)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 cursor-pointer hover:text-red-800"
                    onClick={() => {
                      setSelectedAnnouncement(a);
                      setDeletePopUp(true);
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {filteredAnnouncements.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No announcements found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🗑️ Delete Popup */}
      {deletePopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4">Delete Announcement</h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {selectedAnnouncement?.name}
              </span>
              ? This action cannot be undone.
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
                  await deleteAnnouncement(selectedAnnouncement._id);
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

export default AnnouncementBar;
