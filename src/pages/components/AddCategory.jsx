import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoCloudUploadOutline } from "react-icons/io5";
import { MdClose, MdArrowBack } from "react-icons/md";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const AddCategory = () => {
  const { id } = useParams(); // edit mode
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]); // for parent category
  const [categoryData, setCategoryData] = useState({
    name: "",
    parent_category_id: "",
  });
  const [image, setImage] = useState(null); // main image
  const [loading, setLoading] = useState(false);

  // Fetch all categories for parent selection
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/category/getAllCategories`
        );
        setCategories(res.data.categories);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  // Fetch category if editing
  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/category/getCategoryById/${id}`
        );
        const cat = res.data.category;
        setCategoryData({
          name: cat.name,
          parent_category_id: cat.parent_category_id?._id || "",
        });
        setImage(
          cat.image
            ? `${import.meta.env.VITE_API_BASE}/${cat.image.replace(/\\/g, "/")}`
            : null
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch category");
      }
    };
    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    setCategoryData({ ...categoryData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", categoryData.name);
    //   formData.append("parent_category_id", categoryData.parent_category_id);
      if (image instanceof File) {
        formData.append("image", image);
      }

      if (id) {
        // edit category
        await axios.put(
          `${import.meta.env.VITE_API_BASE}/api/category/update/${id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Category updated successfully!");
      } else {
        // add category
        await axios.post(
          `${import.meta.env.VITE_API_BASE}/api/category/add`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Category added successfully!");
      }

      navigate("/admin/dashboard/categories");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavLink to="/admin/dashboard/categories">
        <button className="bg-[#fde9d4] flex gap-2 items-center cursor-pointer text-black p-4 font-bold rounded-lg mb-4 ">
          <MdArrowBack size={20} />
          Back to Categories
        </button>
      </NavLink>

      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-6">
        <h2 className="text-xl font-bold mb-4">
          {id ? "Edit Category" : "Add Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md">
            <div className="w-full flex flex-col items-center p-10 border-2 border-gray-500 border-dashed">
              <IoCloudUploadOutline size={90} color="#fde9d4" />
              <h1>Select category image</h1>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
              />
              {image && (
                <img
                  src={image instanceof File ? URL.createObjectURL(image) : image}
                  alt="Preview"
                  className="w-40 h-40 mt-4 object-cover rounded-lg shadow-md border"
                />
              )}
            </div>
          </label>

          {/* Category Name */}
          <div>
            <label className="block mb-1 font-semibold">Category Name</label>
            <input
              type="text"
              name="name"
              value={categoryData.name}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          {/* Parent Category */}
          {/* <div>
            <label className="block mb-1 font-semibold">Parent Category</label>
            <select
              name="parent_category_id"
              value={categoryData.parent_category_id}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            >
              <option value="">Select Parent Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div> */}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#faedcd] hover:bg-[#faedcd] text-black font-semibold py-2 rounded-md mt-4"
          >
            {loading ? "Saving..." : id ? "Update Category" : "Add Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
