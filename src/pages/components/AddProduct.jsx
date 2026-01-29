 import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoCloudUploadOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MdArrowBack } from "react-icons/md";


const AddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category_id: "",
    material: "",
    tags: "",
    size: [],
    color: "",
    price: "",
    salePrice: "",
    quantity: "",
  });
  const [image, setImage] = useState(null); // main image file
  const [existingGallery, setExistingGallery] = useState([]); // gallery from API
  const [newGallery, setNewGallery] = useState([]); // newly selected gallery files
  const [loading, setLoading] = useState(false);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/category/getAllCategories`
        );
        setCategories(res.data.categories);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch product data if editing
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/products/getproduct/${id}`
        );
        const product = res.data.product;

        setProductData({
          name: product.name,
          description: product.description,
          category_id: product.category_id?._id || "",
          material: product.material,
          tags: product.tags?.join(",") || "",
          size: product.size || [],
          color: product.color,
          price: product.price,
          salePrice: product.salePrice,
          quantity: product.quantity,
        });

        setImage(
          product.image
            ? `${import.meta.env.VITE_API_BASE}/${product.image.replace(
                /\\/g,
                "/"
              )}`
            : null
        );

        setExistingGallery(
          product.gallery
            ? product.gallery.map(
                (img) =>
                  `${import.meta.env.VITE_API_BASE}/${img.replace(/\\/g, "/")}`
              )
            : []
        );
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      }
    };
    fetchProduct();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  // Toggle sizes
  const toggleSize = (size) => {
    setProductData((prev) => {
      const alreadySelected = prev.size.includes(size);
      return {
        ...prev,
        size: alreadySelected
          ? prev.size.filter((s) => s !== size)
          : [...prev.size, size],
      };
    });
  };

  // Remove image
  const removeImage = (index, type) => {
    if (type === "existing") {
      setExistingGallery((prev) => prev.filter((_, i) => i !== index));
    } else {
      setNewGallery((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("category_id", productData.category_id);
      formData.append("material", productData.material);
      formData.append("color", productData.color);
      formData.append("price", productData.price);
      formData.append("salePrice", productData.salePrice);
      formData.append("quantity", productData.quantity);

      // tags as array
      if (productData.tags) {
        productData.tags
          .split(",")
          .map((t) => t.trim())
          .forEach((t) => formData.append("tags[]", t));
      }

      // sizes as array
      productData.size.forEach((s) => formData.append("size[]", s));

      // main image file
      if (image instanceof File) {
        formData.append("image", image);
      }

      // new gallery files
      newGallery.forEach((file) => formData.append("gallery", file));

      // existing gallery URLs to keep
      formData.append("existingGallery", JSON.stringify(existingGallery));

      if (id) {
        // Edit product
        await axios.put(
          `${import.meta.env.VITE_API_BASE}/api/products/update/${id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Product updated successfully!");
      } else {
        // Add product
        await axios.post(
          `${import.meta.env.VITE_API_BASE}/api/products/add`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Product added successfully!");
      }

      navigate("/admin/dashboard/products");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavLink to="/admin/dashboard/products">
        <button className="bg-[#fde9d4] flex gap-2 items-center cursor-pointer text-black p-4 font-bold rounded-lg mb-4 ">
          <MdArrowBack size={20}/>
          Back to Products
        </button>
      </NavLink>

      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-6">
        <h2 className="text-xl font-bold mb-4">
          {id ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main Image */}
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md">
            <div className="w-full flex flex-col items-center p-10 border-2 border-gray-500 border-dashed">
              <IoCloudUploadOutline size={90} color="#fde9d4" />
              <h1>Select main image</h1>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
              />
              {image && (
                <img
                  src={image instanceof File ? URL.createObjectURL(image) : image}
                  alt="Main Preview"
                  className="w-40 h-40 mt-4 object-cover rounded-lg shadow-md border"
                />
              )}
            </div>
          </label>

          {/* Gallery Upload */}
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md">
            <div className="w-full flex flex-col items-center p-10 border-2 border-gray-500 border-dashed">
              <IoCloudUploadOutline size={90} color="#fde9d4" />
              <h1>Upload gallery images</h1>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setNewGallery((prev) => [...prev, ...Array.from(e.target.files)])
                }
                className="hidden"
              />
              {existingGallery.length + newGallery.length > 0 && (
                <p>
                  {existingGallery.length + newGallery.length} files selected
                </p>
              )}
            </div>
          </label>

          {/* Gallery Preview */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {existingGallery.map((img, idx) => (
              <div key={`existing-${idx}`} className="relative w-32 h-32 border rounded-lg overflow-hidden shadow-md">
                <button
                  type="button"
                  onClick={() => removeImage(idx, "existing")}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <MdClose size={18} />
                </button>
                <img src={img} alt={`preview-${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}

            {newGallery.map((img, idx) => (
              <div key={`new-${idx}`} className="relative w-32 h-32 border rounded-lg overflow-hidden shadow-md">
                <button
                  type="button"
                  onClick={() => removeImage(idx, "new")}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <MdClose size={18} />
                </button>
                <img src={URL.createObjectURL(img)} alt={`preview-new-${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Product Info */}
          <div>
            <label className="block mb-1 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Category</label>
            <select
              name="category_id"
              value={productData.category_id}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Material</label>
            <input
              type="text"
              name="material"
              value={productData.material}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={productData.tags}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          {/* Sizes */}
          <div>
            <label className="block mb-1 font-semibold">Sizes</label>
            <div className="flex gap-2 flex-wrap">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-2 rounded-md cursor-pointer ${
                    productData.size.includes(size)
                      ? "bg-[#faedcd] text-black"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Color</label>
            <input
              type="text"
              name="color"
              value={productData.color}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          {/* Price & Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Price</label>
              <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Sale Price</label>
              <input
                type="number"
                name="salePrice"
                value={productData.salePrice}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={productData.quantity}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#faedcd] hover:bg-[#faedcd] text-black font-semibold py-2 rounded-md mt-4"
          >
            {loading ? "Saving..." : id ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
