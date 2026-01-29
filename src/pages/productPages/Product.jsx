import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { getProductById, getAllProducts } from "../../service/productService";
import { addToCart } from "../../service/cartServices";
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../../service/wishlist";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Heart } from "lucide-react";
import { useWishlist } from "../../context/wishListContext";
import "swiper/css";
import "swiper/css/pagination";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  let { updateWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE;

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        const productData = response.data.product || response.data;
        // console.log("Fetched product data:", productData);

        const allImages = [productData.image, ...(productData.gallery || [])]
          .filter(Boolean)
          .map((img) => `${API_BASE}/${img.replace(/\\/g, "/")}`);

        setProduct({
          ...productData,
          images: allImages.length ? allImages : ["/placeholder.png"],
          size: productData.size || ["S", "M", "L", "XL", "XXL"],
        });

        setMainImage(allImages[0]);
        const firstAvailable = (productData.size || []).find((size) =>
          ["S", "M", "L", "XL", "XXL"].includes(size)
        );
        if (firstAvailable) setSelectedSize(firstAvailable);
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, API_BASE]);

  // Fetch suggested products
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await getAllProducts();
        const products = (res.data.products || []).filter((p) => p._id !== id);
        setSuggestedProducts(products.slice(0, 8));
      } catch (err) {}
    };
    fetchSuggestions();
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch wishlist
  const loadWishlist = async () => {
    try {
      const res = await fetchWishlist();
      const ids = (res.data.products || []).map((p) => p._id);
      setWishlistIds(ids);
    } catch (err) {}
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Add to cart
  const handleAddToCart = async () => {
    if (!token || !userId) {
      toast.error("Please log in to add items to cart");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size before adding to cart");
      return;
    }
    if (product.quantity <= 0) {
      toast.error("This product is out of stock");
      return;
    }
    try {
      await addToCart({
        user_id: userId,
        product_id: product._id,
        quantity,
        size: selectedSize,
      });
      toast.success("Product added to cart!");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      toast.error("Failed to add to cart.");
    }
  };

  // Buy Now
  const handleBuyNow = async () => {
    if (!token || !userId) {
      toast.error("Please log in to buy items");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size before buying");
      return;
    }
    if (product.quantity <= 0) {
      toast.error("This product is out of stock");
      return;
    }
    try {
      await addToCart({
        user_id: userId,
        product_id: product._id,
        quantity,
        size: selectedSize,
      });
      toast.success("Product added to cart!");
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/cart");
    } catch (err) {
      toast.error("Failed to add to cart.");
    }
  };

  // Wishlist toggle
  const toggleWishlistHandler = async (e, productId) => {
    e.stopPropagation();

    if (!token || !userId) {
      toast.error("Please log in to use wishlist");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    try {
      if (wishlistIds.includes(productId)) {
        await removeFromWishlist(productId);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist({ user: userId, products: [productId] });
        await updateWishlist();
        toast.success("Added to wishlist");
      }
      await loadWishlist();
    } catch (err) {
      toast.error("Wishlist update failed");
    }
  };

  if (loading) return <div className="text-center py-10">Loading product...</div>;
  if (!product)
    return <div className="text-center py-10 text-red-500">Product not found.</div>;

  const words = product.description?.split(" ") || [];
  const isLongDescription = words.length > 50;
  const shortDescription =
    words.slice(0, 50).join(" ") + (isLongDescription ? "..." : "");

  return (
    <div className="container mx-auto sm:px-6 lg:px-8 py-8">
      <Toaster position="top-center" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* IMAGES */}
        <div className="flex flex-col md:flex-row">
          <div className="block md:hidden">
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
            >
              {product.images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <motion.img
                    src={img}
                    alt={`${product.name}-${idx}`}
                    className="rounded-lg w-full h-[500px] object-cover shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="hidden md:flex flex-col md:flex-row gap-4 md:gap-1">
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[600px] pr-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <motion.img
                  key={idx}
                  src={img}
                  alt={`${product.name}-${idx}`}
                  className={`w-24 h-24 object-cover rounded-md cursor-pointer border-2 ${
                    mainImage === img
                      ? "border-black"
                      : "border-gray-300 hover:border-black"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
            <motion.img
              key={mainImage}
              src={mainImage}
              alt={product.name}
              className="rounded-lg max-w-[500px] w-full h-[600px] object-cover shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="flex flex-col px-2">
          {/* NAME + PRICE + STOCK */}
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

          <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 mt-1">
              <p className="text-2xl font-bold text-gray-800">
                ₹{product.salePrice || product.price}
              </p>
              {product.salePrice && product.price && (
                <>
                  <p className="text-gray-500 line-through text-lg">
                    ₹{product.price}
                  </p>
                  <span className="text-green-600 font-medium text-sm bg-green-100 px-2 py-1 rounded">
                    {Math.round(
                      ((product.price - product.salePrice) / product.price) * 100
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            {/* ✅ STOCK STATUS */}
            {product.quantity <= 0 ? (
              <span className="text-red-600 font-semibold bg-red-100 px-3 py-1 rounded-md">
                Out of Stock
              </span>
            ) : (
              <span className="text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-md">
                In Stock
              </span>
            )}
          </div>

          {/* SIZE SELECTOR */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Select Size:</h3>
            <div className="flex gap-3 flex-wrap">
              {["S", "M", "L", "XL", "XXL"].map((size) => {
                const isAvailable = product.size?.includes(size);
                const isOutOfStock = product.quantity <= 0;
                const isDisabled = !isAvailable || isOutOfStock;
                const isSelected = selectedSize === size;
              
                return (
                  <div key={size} className="relative">
                    <button
                      onClick={() => !isDisabled && setSelectedSize(size)}
                      disabled={isDisabled}
                      className={`relative w-14 h-12 rounded-xl border text-sm font-medium transition-all duration-300 flex items-center justify-center ${
                        isDisabled
                          ? "bg-white border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                          : isSelected
                          ? "bg-black text-white border-black scale-105"
                          : "bg-white border-gray-300 text-gray-800 hover:border-black hover:scale-105"
                      }`}
                    >
                      {size}
                      {!isAvailable && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-9 h-9 text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <line x1="4" y1="20" x2="20" y2="4" />
                          </svg>
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>


          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <div className="flex items-center w-34 border rounded-md">
              <button
                onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
                className="px-3 py-2 border-r text-lg font-bold hover:bg-gray-100"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-15 text-center outline-none"
              />
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-3 py-2 border-l text-lg font-bold hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <div className="flex gap-2">
              <button
                className={`px-6 py-3 rounded-md font-semibold transition ${
                  product.quantity <= 0
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-black text-white hover:opacity-90"
                }`}
                onClick={handleAddToCart}
                disabled={product.quantity <= 0}
              >
                {product.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
              </button>

              <button
                className={`px-6 py-3 rounded-md font-semibold transition ${
                  product.quantity <= 0
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-black text-white hover:opacity-90"
                }`}
                onClick={handleBuyNow}
                disabled={product.quantity <= 0}
              >
                {product.quantity <= 0 ? "Unavailable" : "Buy Now"}
              </button>
            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="text-2xl font-bold">Description</p>
          <p className="text-gray-700 mb-6 text-justify">
            {showFullDescription ? product.description : shortDescription}
            {isLongDescription && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="ml-2 text-gray-700 font-medium hover:underline"
              >
                {showFullDescription ? "Read Less" : "Read More"}
              </button>
            )}
          </p>
        </div>
      </div>

      {/* SUGGESTED PRODUCTS */}
      <section className="py-10 border-t mt-10">
        <h2 className="text-2xl font-bold mb-6 px-2">You May Also Like 💫</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-2">
          {suggestedProducts.map((p) => {
            const { _id, name, price, salePrice, img, image } = p;
            const productImage =
              img || image
                ? `${API_BASE}/${img || image}`
                : "https://via.placeholder.com/300";
            const isInWishlist = wishlistIds.includes(_id);

            return (
              <div
                key={_id}
                onClick={() => navigate(`/product/${_id}`)}
                className="relative group bg-white rounded-lg overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                <button
                  onClick={(e) => toggleWishlistHandler(e, _id)}
                  className="absolute right-3 top-3 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition z-20"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isInWishlist
                        ? "text-red-500 fill-red-500"
                        : "text-gray-500"
                    }`}
                  />
                </button>

                <img
                  src={productImage}
                  alt={name}
                  className="w-full h-80 object-cover transition-all duration-500 group-hover:h-full"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-white/90 transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-10 p-2">
                  <h3 className="text-sm font-semibold">{name}</h3>
                  {salePrice ? (
                    <div className="flex items-center gap-2">
                      <p className="text-gray-800 font-semibold">
                        ₹{salePrice}
                      </p>
                      <p className="text-gray-400 line-through">₹{price}</p>
                    </div>
                  ) : (
                    <p className="text-gray-800">₹{price}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Product;
