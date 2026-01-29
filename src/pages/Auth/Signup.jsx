import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { googleProvider, auth } from "../../config/firebase";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  User,
} from "lucide-react";
import { signupUser } from "../../service/userService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [state, setState] = useState({
    loading: false,
    showPassword: false,
    error: {},
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Manual Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.includes("@")) errors.email = "Valid email required";
    if (formData.password.length < 6)
      errors.password = "Password must be 6+ characters";
    if (Object.keys(errors).length > 0) {
      setState((prev) => ({ ...prev, error: errors }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: {} }));
    try {
      const res = await signupUser(formData);
      toast.success(res?.data?.message || "Signup successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const msg =
        error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(msg);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // ✅ Google Signup / Login
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userData = {
        name: user.displayName,
        email: user.email,
        googleUid: user.uid,
        photo: user.photoURL,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/api/user/google-login`,
        userData
      );

      const backendUser = res.data.user;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", backendUser._id);
      localStorage.setItem("role", backendUser.role);

      toast.success(`Welcome, ${user.displayName}!`);

      // ✅ Redirect admin to admin dashboard
      if (backendUser.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error("Google login failed!");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/40 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative"
      >
        <button
          onClick={() => navigate("/")}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Parkinson"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  state.error.name ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            {state.error.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {state.error.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@email.com"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  state.error.email ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            {state.error.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {state.error.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5" />
              <input
                type={state.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className={`w-full pl-10 pr-10 py-3 rounded-lg border ${
                  state.error.password ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              <button
                type="button"
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword,
                  }))
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {state.showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {state.error.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {state.error.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={state.loading}
            className="w-full h-11 bg-gray-700 text-gray-50 rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {state.loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </button>

          {/* Google Signup */}
          <button
            type="button"
            onClick={signInWithGoogle}
            className="w-full h-11 bg-white border border-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Sign up with Google</span>
          </button>

          <div className="text-center">
            <p className="text-gray-700">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Log in here
              </a>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
