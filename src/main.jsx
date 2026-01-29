import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { WishlistProvider } from "./context/wishListContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
    <WishlistProvider>
      <App />
    </WishlistProvider>
     </AuthProvider>
  </React.StrictMode>
);
