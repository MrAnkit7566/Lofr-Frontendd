// Dashboard.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { DashboardNav } from "../components/DashboardNav";
import { Sidebar } from "../components/Sidebar";

// Pages
import DashboardHome from "./DashboardHome";
import Sales from "./Sales/Sales";
import Blogs from "./Blogs/Blogs";
import Users from "./Users/Users";
import Products from "./Products/Products";
import Categories from "./Categories/Categories";
import Coupons from "./Coupons/Coupons";
import Orders from "./Orders/Orders";
import Reviews from "./Reviews/Reviews";
import HomepageSection from "./HomepageSection/HomepageSection";
import AnnouncementBar from "./AnnouncementBar/AnnouncementBar";
import Contact from "./Contact/Contact";

// Components
import AddProduct from "../components/AddProduct";
import ViewProduct from "../components/ViewProduct";
import AddCategory from "../components/AddCategory";
import EditOrders from "../components/EditOrders";
import ViewOrders from "../components/ViewOrders";
import AddCoupon from "../components/AddCoupon";
import AddEditAnnouncement from "../components/AddAnnouncement";

const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <DashboardNav />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Left) */}
        <div>
          <Sidebar />
        </div>

        {/* Main Content (Right) */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <Routes>
            {/* Dashboard Home */}
            <Route path="/" element={<DashboardHome />} />

            {/* Main Sections */}
            <Route path="sales" element={<Sales />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="users" element={<Users />} />

            {/* Products */}
            <Route path="products" element={<Products />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/edit/:id" element={<AddProduct />} />
            <Route path="/products/getproduct/:id" element={<ViewProduct />} />

            {/* Categories */}
            <Route path="categories" element={<Categories />} />
            <Route path="/categories/add" element={<AddCategory />} />
            <Route path="/categories/edit/:id" element={<AddCategory />} />

            {/* Coupons */}
            <Route path="coupons" element={<Coupons />} />
            <Route path="/coupons/add" element={<AddCoupon />} />
            <Route path="/coupons/edit/:id" element={<AddCoupon />} />

            {/* Orders */}
            <Route path="orders" element={<Orders />} />
            <Route path="/orders/edit/:id" element={<EditOrders />} />
            <Route path="/orders/view/:id" element={<ViewOrders />} />

            {/* Reviews */}
            <Route path="reviews" element={<Reviews />} />

            {/* Homepage Section */}
            <Route path="homepage" element={<HomepageSection />} />

            {/* Announcements */}
            <Route path="announcements" element={<AnnouncementBar />} />
            <Route path="/announcements/add" element={<AddEditAnnouncement />} />
            <Route path="/announcements/edit/:id" element={<AddEditAnnouncement />} />

            {/* Contact */}
            <Route path="contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
