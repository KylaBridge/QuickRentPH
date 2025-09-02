import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ItemsForRent from "./pages/ItemsForRent.jsx";
import MyRequests from "./pages/MyRequests.jsx";
import MyWishlist from "./pages/MyWishlist.jsx";
import MyRentals from "./pages/MyRentals.jsx";
import Notifications from "./pages/Notifications.jsx";
import Messages from "./pages/Messages.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/landing" replace />} />
      
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/items-for-rent" element={<ItemsForRent />} />
      <Route path="/my-requests" element={<MyRequests />} />
      <Route path="/my-wishlist" element={<MyWishlist />} />
      <Route path="/my-rentals" element={<MyRentals />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/messages" element={<Messages />} />
      
    </Routes>
  );
}

export default App;
