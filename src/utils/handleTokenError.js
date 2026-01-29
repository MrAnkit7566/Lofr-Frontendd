import toast from "react-hot-toast";

export const handleTokenError = (error, navigate) => {
  if (
    error?.response?.status === 401 ||
    error?.response?.data?.message?.toLowerCase().includes("token")
  ) {
    toast.error("Session expired. Please log in again.");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    setTimeout(() => {
      navigate("/login");
    }, 1500);

    return true;
  }
  return false;
};
