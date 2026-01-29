import React, { useState, useEffect, useContext } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../../service/userService";
import toast from "react-hot-toast";
import axios from "axios";
import * as jwt_decode from "jwt-decode";

// ✅ Auto Logout Hook (token expiry based)
const useAutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwt_decode(token);
      const expiresInMs = decoded.exp * 1000 - Date.now();

      if (expiresInMs <= 0) {
        localStorage.clear();
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        const timer = setTimeout(() => {
          localStorage.clear();
          toast.error("Session expired. Please login again.");
          navigate("/login");
        }, expiresInMs);
        return () => clearTimeout(timer);
      }
    } catch (err) {
      localStorage.clear();
      navigate("/login");
    }
  }, [navigate]);
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser} = useContext(AuthContext);
  useAutoLogout();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formState, setFormState] = useState({
    loading: false,
    showPassword: false,
    error: {},
    success: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.includes("@")) {
      setFormState((prev) => ({
        ...prev,
        error: { email: "Invalid email address" },
      }));
      return;
    }

    setFormState({ ...formState, loading: true, error: {} });

    try {
      const res = await loginUser(formData);
      const userData = res.data.user;
      // console.log("userData login",userData)

      toast.success(res.data.msg || "Login successful ✅");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", userData._id);
      localStorage.setItem("role", userData.role); // save role
      setUser(userData);

      setFormState({ ...formState, loading: false, success: true });

      // console.log("token",res.data.token)
      // console.log("role",userData.role)
      
      // ✅ Redirect admin to admin panel
      // console.log("user from the context",user)
      const redirectPath =
        userData.role === "admin"
          ? "/admin/dashboard"
          : location.state?.from || "/";

      setTimeout(() => navigate(redirectPath, { replace: true }), 2000);
    } catch (error) {
      console.log("error",error)
      setFormState({
        ...formState,
        loading: false,
        error: { submit: error.response?.data?.msg || "Login failed" },
      });
      toast.error(
        error.response?.data?.msg ||
          "Login Failed ❌ Make sure you have already signed up"
      );
    }
  };

  // ✅ Google Login
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

      // ✅ Redirect based on role
      if (backendUser.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error("Google login failed!");
    }
  };

  if (formState.success) {
    return (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/40 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-600 mb-4">
            You have been successfully logged in.
          </p>
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-gray-500 mt-2">
            Redirecting to your page...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/40 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
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
            Welcome Back 👋
          </h2>
          <p className="text-gray-600">Log in to continue shopping</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  formState.error.email ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter your email"
              />
            </div>
            {formState.error.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.error.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={formState.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-3 rounded-lg border ${
                  formState.error.password
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword,
                  }))
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {formState.showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {formState.error.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {formState.error.submit}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={formState.loading}
            className="w-full h-11 bg-gray-700 text-gray-50 rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {formState.loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          {/* Google Login */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={signInWithGoogle}
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 px-4 font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-300 shadow-sm hover:shadow-md"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </motion.button>

          <div className="text-center">
            <p className="text-gray-900">
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up here
              </a>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
