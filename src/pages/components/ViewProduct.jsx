import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

/**
 * ViewProduct.jsx
 * Simple, clean Tailwind UI for viewing a single product.
 * Color accent / background: bg-[#fde4c9]
 */

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const { data } = await axios.get(`${BASE}/api/products/getproduct/${id}`);
        const p = data.product;

        if (!p) {
          setProduct(null);
          return;
        }

        // Normalize main image and gallery (replace backslashes + add base)
        const mainImage = p.image
          ? `${BASE}/${p.image.replace(/\\/g, "/")}`
          : null;

        const gallery = Array.isArray(p.gallery)
          ? p.gallery.map((g) => `${BASE}/${g.replace(/\\/g, "/")}`)
          : [];

        // tags and size defaults
        const tags = Array.isArray(p.tags) ? p.tags : [];
        const size = Array.isArray(p.size) ? p.size : [];

        setProduct({
          ...p,
          image: mainImage,
          gallery,
          tags,
          size,
        });
      } catch (err) {
        console.error(err);
        setProduct(null);
      }
    };

    if (id) fetchProductById();
  }, [id, BASE]);

  if (product === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fde4c9] p-6">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl text-center">
          <p className="text-gray-700">Product not found or loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <div className="mb-4">
          <NavLink to="/admin/dashboard/products" className="inline-flex items-center gap-2 p-3 rounded-md bg-[#fde4c9] font-bold cursor-pointer text-sm text-gray-800 hover:opacity-90">
            <MdArrowBack size={20} />
            Back to products
          </NavLink>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Left: Images */}
            <div className="col-span-1">
              <div className="rounded-lg overflow-hidden border border-gray-100">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-gray-50 text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Gallery */}
              {product.gallery && product.gallery.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {product.gallery.map((g, idx) => (
                    <div key={idx} className="w-full h-20 rounded-lg overflow-hidden border">
                      <img src={g} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Middle: Basic info */}
            <div className="col-span-1 md:col-span-1 flex flex-col justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-sm text-gray-500 mt-1">{product.material || "Material not specified"}</p>

                <div className="mt-4">
                  <div className="text-3xl font-extrabold text-gray-900">
                    ₹{Number(product.price).toLocaleString()}
                  </div>
                  {product.salePrice ? (
                    <div className="text-sm line-through text-gray-400 mt-1">₹{Number(product.salePrice).toLocaleString()}</div>
                  ) : null}
                </div>

                <div className="mt-4 text-gray-700">
                  <p className="text-sm">{product.description}</p>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="text-xs text-gray-500">Stock:</div>
                  <div className="px-3 py-1 rounded-md bg-gray-100 text-sm font-medium">
                    {product.quantity} {product.quantity > 1 ? "items" : "item"}
                  </div>
                </div>
              </div>

              {/* Category / metadata */}
              <div className="mt-6">
                <div className="text-xs text-gray-500">Category</div>
                <div className="mt-1 text-sm font-medium text-gray-800">{product.category_id?.name || product.category_id || "N/A"}</div>

                <div className="mt-3 flex gap-2 items-center">
                  {product.is_featured && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">Featured</span>}
                  {product.is_best_seller && <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">Best Seller</span>}
                </div>
              </div>
            </div>

            {/* Right: Tags, Sizes, Actions */}
            <div className="col-span-1 flex flex-col justify-between">
              <div>
                {/* Tags */}
                <div>
                  <div className="text-xs text-gray-500">Tags</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.tags && product.tags.length > 0 ? (
                      product.tags.map((t, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">No tags</span>
                    )}
                  </div>
                </div>

                {/* Sizes */}
                <div className="mt-4">
                  <div className="text-xs text-gray-500">Sizes</div>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {product.size && product.size.length > 0 ? (
                      product.size.map((s, i) => (
                        <div key={i} className="px-3 py-1 rounded-md bg-[#fde4c9] text-sm font-medium text-gray-800 border">
                          {s}
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">No sizes</span>
                    )}
                  </div>
                </div>

                {/* Color */}
                <div className="mt-4">
                  <div className="text-xs text-gray-500">Color</div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border" style={{ background: product.color || "#fff" }} />
                    <div className="text-sm text-gray-800">{product.color || "N/A"}</div>
                  </div>
                </div>

                {/* Created/Updated */}
                <div className="mt-6 text-sm text-gray-500">
                  <div>Created: {new Date(product.createdAt).toLocaleString()}</div>
                  <div className="mt-1">Updated: {new Date(product.updatedAt).toLocaleString()}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <NavLink to={`/admin/dashboard/products/edit/${product._id}`} className="flex-1 text-center px-4 py-2 rounded-lg bg-[#fde4c9] hover:opacity-95 font-semibold">
                  Edit
                </NavLink>
               
              </div>
            </div>
          </div>

          {/* Footer: full description / long gallery */}
          <div className="border-t border-gray-100 p-6 bg-gray-50">
            <div className="mb-3 font-semibold text-gray-800">Full Description</div>
            <p className="text-gray-700">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
