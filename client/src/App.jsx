import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ItemsForRent from "./pages/ItemsForRent.jsx";
import RentalFlow from "./pages/RentalFlow.jsx";
import MyRequests from "./pages/MyRequests.jsx";
import MyWishlist from "./pages/MyWishlist.jsx";
import MyRentals from "./pages/MyRentals.jsx";
import Notifications from "./pages/Notifications.jsx";
import Messages from "./pages/Messages.jsx";
import Profile from "./pages/Profile.jsx";
import Help from "./pages/Help.jsx";
import AddItem from "./components/myRentals/AddItem.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ProductManagement from "./pages/admin/ProductManagement.jsx";
import { UserProvider } from "./context/userContext.jsx";
import { ModalProvider, useModal } from "./context/modalContext.jsx";
import { WishlistProvider } from "./context/wishlistContext.jsx";
import { RentalProvider } from "./context/rentalContext.jsx";
import VerificationRequiredModal from "./components/modals/VerificationRequiredModal.jsx";
import AccountVerificationModal from "./components/modals/AccountVerificationModal.jsx";
import AddressEditorModal from "./components/modals/AddressEditorModal.jsx";

// Global modals component that renders all modals at app level
const GlobalModals = () => {
  const {
    modalState,
    closeVerificationRequiredModal,
    closeAccountVerificationModal,
    closeAddressEditorModal,
  } = useModal();

  return (
    <>
      <VerificationRequiredModal
        isOpen={modalState.verificationRequired.isOpen}
        onClose={closeVerificationRequiredModal}
        onGoToProfile={modalState.verificationRequired.onGoToProfile}
      />
      <AccountVerificationModal
        isOpen={modalState.accountVerification.isOpen}
        onClose={closeAccountVerificationModal}
        onComplete={modalState.accountVerification.onComplete}
        isLoading={false}
        user={modalState.accountVerification.user}
      />
      <AddressEditorModal
        isOpen={modalState.addressEditor.isOpen}
        onClose={closeAddressEditorModal}
        onSave={modalState.addressEditor.onSave}
        addressForm={modalState.addressEditor.addressForm}
        setAddressForm={modalState.addressEditor.setAddressForm}
        isLoading={false}
      />
    </>
  );
};

function App() {
  return (
    <ModalProvider>
      <WishlistProvider>
        <RentalProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/landing" replace />} />

            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
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
              path="/rental-flow/:itemId"
              element={
                <ProtectedRoute>
                  <UserProvider>
                    <RentalFlow />
                  </UserProvider>
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
                  <UserProvider>
                    <MyRentals />
                  </UserProvider>
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

            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <Help />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProvider>
                    <Profile />
                  </UserProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/additem"
              element={
                <ProtectedRoute>
                  <AddItem />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/items"
              element={
                <AdminProtectedRoute>
                  <UserProvider>
                    <ProductManagement />
                  </UserProvider>
                </AdminProtectedRoute>
              }
            />

            {/* Catch-all redirect for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <GlobalModals />
        </RentalProvider>
      </WishlistProvider>
    </ModalProvider>
  );
}
export default App;
