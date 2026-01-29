import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import axios from "axios";
import "swiper/css"; // make sure Swiper styles are imported

const Hero = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading state

  const fetchImages = async () => {
    try {
      const result = await axios.get(`${import.meta.env.VITE_API_BASE}/api/carousel`);
      setImages(result.data);
    } catch (error) {
      console.error("Error fetching carousel images:", error);
    } finally {
      setLoading(false); // ✅ hide loader once done
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // ✅ Loading UI (can be spinner or shimmer)
  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] bg-gray-100 rounded-xl shadow-lg">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ✅ If no images found
  if (!images.length) {
    return (
      <div className="flex justify-center items-center w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] bg-gray-100 rounded-xl shadow-lg text-gray-500">
        No images available
      </div>
    );
  }

  // ✅ Swiper (main content)
  return (
    <Swiper
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      modules={[Autoplay]}
      className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] rounded-xl shadow-lg"
    >
      {images.map((img, i) => (
        <SwiperSlide key={i}>
          <img
            src={`${import.meta.env.VITE_API_BASE}/${img.imageUrl}`}
            alt={`Hero slide ${i}`}
            className="w-full h-full object-cover rounded-xl"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Hero;
