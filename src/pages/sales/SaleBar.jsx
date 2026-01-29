// import Swiper core and required modules
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/scrollbar";

import axios from "axios";
import { useEffect, useState } from "react";

const SaleBadge = () => {
  const [announcements, setAnnouncements] = useState([]);

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/announcements`
      );
      setAnnouncements(res.data.announcements);
      // console.log("Fetched announcements:", res.data.announcements);
    } catch (error) {
      // console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Filter active announcements
  const activeAnnouncements = announcements.filter((a) => a.isActive);

  return (
    <Swiper
      modules={[Scrollbar, A11y, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      // Loop only if more than one active announcement
      loop={activeAnnouncements.length > 1}
      className="w-full text-center"
    >
      {activeAnnouncements.length > 0 ? (
        activeAnnouncements.map((item, idx) => (
          <SwiperSlide
            key={item._id || idx}
            className="flex items-center justify-center font-bold bg-gradient-to-r from-gray-500 to-gray-300 text-white h-40 shadow-lg"
          >
            {item.name}
          </SwiperSlide>
        ))
      ) : (
        //Fallback for no active announcements
        <SwiperSlide className="flex items-center justify-center font-semibold bg-gray-400 text-white h-40 shadow-md">
          No Announcements Available
        </SwiperSlide>
      )}
    </Swiper>
  );
};

export default SaleBadge;
