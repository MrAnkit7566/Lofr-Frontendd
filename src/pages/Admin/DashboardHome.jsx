import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Overview from "../components/Overview"; // new component
import axios from "axios";
import RecentProducts from "../components/RecentProducts";
// import { RecentSales } from "@/components/recent-sales";
// import { getStats } from "@/lib/data"; // same util

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    newProducts: 0,
    totalCategories: 0,
    newCategories: 0,
    totalBrands: 0,
    newBrands: 0,
    totalUsers: 0,
    newUsers: 0,
  });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUsers] = useState([]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/products`
      );
      setProducts(data.products || []);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };
  

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/category/getAllCategories`
      );
      setCategories(data.categories || []);
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to fetch categories");
    }
  };

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
    fetchProducts();
    fetchCategories();
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>

      {/* Top Stats Grid */}
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          marginBottom: "2rem",
        }}
      >
        {/* Products */}
        <Link to="/dashboard/products" style={{ textDecoration: "none" }}>
          <Card
            sx={{
              p: 2,
              bgcolor: "#cbfbf16e",
              "&:hover": { bgcolor: "#cbfbf197" },
            }}
          >
            <CardHeader
              title={
                <Typography variant="subtitle2">Total Products</Typography>
              }
              action={<Typography variant="body2">📦</Typography>}
            />
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                {products.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                +{products.length} new products this month
              </Typography>
            </CardContent>
          </Card>
        </Link>

        {/* Categories */}
        <Card
          sx={{ p: 2, bgcolor: "#f0e7ff", "&:hover": { bgcolor: "#e2d4fd" } }}
        >
          <CardHeader
            title={
              <Typography variant="subtitle2">Total Categories</Typography>
            }
            action={<Typography variant="body2">📂</Typography>}
          />
          <CardContent>
            <Typography variant="h5" fontWeight="bold">
              {categories.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              +{categories.length} new categories this month
            </Typography>
          </CardContent>
        </Card>

        {/* Users */}
        <Card
          sx={{ p: 2, bgcolor: "#e6f0ff", "&:hover": { bgcolor: "#d4e7fd" } }}
        >
          <CardHeader
            title={<Typography variant="subtitle2">Total Users</Typography>}
            action={<Typography variant="body2">👤</Typography>}
          />
          <CardContent>
            <Typography variant="h5" fontWeight="bold">
              {user.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              + {user.length}
              new users this month
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Overview & Recent Sales */}
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "2fr 1fr",
        }}
      >
        <Card>
          <CardHeader title={<Typography variant="h6">Overview</Typography>} />
          <CardContent>
            <Overview />
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title={<Typography variant="h6">Recent Orders</Typography>}
            subheader="Recently orders to your store."
          />
         <RecentProducts/>
        </Card>
      </div>
    </div>
  );
}
