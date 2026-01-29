import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";

const Users = () => {
  let navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletePopUp, setDeletePopUp] = useState(false);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/user/get-users`
      );
      // console.log(data)
      setUsers(data.users || []);
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete User
  const deleteUser = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE}/api/user/deleteUser/${id}`
      );
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Filtered Users (Search by name/email)
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-6">
      {/* Search & Add User */}
      <div className="flex justify-between items-center mb-4">
        {/* Search */}
        <div className="flex items-center border rounded px-3 py-2 w-1/3">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search users..."
            className="outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Add User */}
        {/* <NavLink to="/admin/dashboard/users/add">
          <button className="bg-[#fde4c9] text-black px-5 py-2 cursor-pointer rounded-lg text-lg hover:bg-[#d6ccc2] hover:scale-105 active:scale-95 transition-all duration-200">
            Add User
          </button>
        </NavLink> */}
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">S.No.</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, index) => (
              <tr key={u._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="flex gap-3 p-3">
                  {/* <button
                    className="text-[#d4a373] cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/dashboard/users/getUser/${u._id}`)
                    }
                  >
                    <FaEye />
                  </button> */}
                  <button
                    className="text-[#d4a373] cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/dashboard/users/edit/${u._id}`)
                    }
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                    onClick={() => {
                      setSelectedUser(u);
                      setDeletePopUp(true);
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No users found
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
            <h2 className="text-xl font-bold mb-4">Delete User</h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedUser.name}</span>? This
              action cannot be undone.
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
                    await deleteUser(selectedUser._id);
                    setDeletePopUp(false);
                    fetchUsers();
                  } catch (error) {
                    console.error("Error deleting user:", error);
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

export default Users;
