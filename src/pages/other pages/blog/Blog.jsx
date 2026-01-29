// src/pages/Blog.jsx
import React from "react";
import { motion } from "framer-motion";

const blogPosts = [
  {
    id: 1,
    title: "Top 10 T-Shirt Trends for 2025",
    description:
      "Discover the latest T-shirt designs, fits, and color trends that will dominate fashion this year. Stay ahead of the style curve!",
    image:
      "https://aestheticbk.com/cdn/shop/articles/T-Shirt_Design_Trends_f218ded1-c959-4e1c-b5c4-819dd8115ac5.png?v=1756987151&width=1500",
    tag: "Fashion & Style",
    date: "October 2025",
  },
  {
    id: 2,
    title: "Behind the Brand: Our Mission & Story",
    description:
      "To make fashion accessible, comfortable, and exciting. Every T-shirt we design is made with care, keeping both style and comfort in mind.",
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
    tag: "Our Story",
    date: "September 2025",
  },
  {
    id: 3,
    title: "How to Style Oversized T-Shirts Like a Pro",
    description:
      "Learn how to pair your oversized tees with jeans, shorts, or skirts for the perfect streetwear or casual vibe.",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    tag: "Style Guide",
    date: "August 2025",
  },
  {
    id: 4,
    title: "How We Make Our Tees So Soft & Durable",
    description:
      "From fabric selection to stitching details — take a peek into how we create T-shirts that last longer and feel amazing.",
    image:
      "https://b894484.smushcdn.com/894484/wp-content/uploads/2023/03/3983890577_National-Textile-Day_Blog-Post_The-OG-Hanes-Cotton.png?lossy=0&strip=1&webp=1",
    tag: "Behind the Scenes",
    date: "July 2025",
  },
];

const Blog = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6 md:px-12 lg:px-24">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Our Blog
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore fashion tips, brand stories, and the latest trends from our T-shirt collection.
        </p>
      </motion.div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {blogPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          >
            <motion.img
              src={post.image}
              alt={post.title}
              className="w-full h-56 object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />

            <div className="p-6">
              <span className="text-sm text-blue-600 font-semibold">
                {post.tag}
              </span>
              <h2 className="text-xl font-bold mt-2 text-gray-800">
                {post.title}
              </h2>
              <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                {post.description}
              </p>

              <div className="mt-5 flex items-center justify-between text-sm text-gray-400">
                <span>{post.date}</span>
                {/* <motion.button
                  whileHover={{ x: 5 }}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Read More →
                </motion.button> */}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
