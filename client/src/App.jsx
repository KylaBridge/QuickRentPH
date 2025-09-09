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
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/landing" replace />} />

      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/items-for-rent"
        element={
          <ProtectedRoute>
            <ItemsForRent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-requests"
        element={
          <ProtectedRoute>
            <MyRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-wishlist"
        element={
          <ProtectedRoute>
            <MyWishlist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-rentals"
        element={
          <ProtectedRoute>
            <MyRentals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
