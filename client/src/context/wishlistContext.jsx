import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./authContext";
import api from "../axios";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist items on user change
  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const loadWishlist = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Try loading from backend
      const response = await api.get(`/api/wishlist/${user._id}/wishlist`);
      const data = response?.data;
      if (data && Array.isArray(data.wishlistItems)) {
        setWishlistItems(data.wishlistItems);
        // keep localStorage in sync
        localStorage.setItem(
          `wishlist_${user._id}`,
          JSON.stringify(data.wishlistItems)
        );
        return;
      }

      // For now, load from localStorage as fallback
      const savedWishlist = localStorage.getItem(`wishlist_${user._id}`);
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (item) => {
    if (!user)
      return {
        success: false,
        message: "Please log in to add items to wishlist",
      };

    // Check if item already exists
    const getId = (obj) => (obj && (obj.id || obj._id)) || obj;
    if (wishlistItems.some((wishItem) => getId(wishItem) === getId(item))) {
      return { success: false, message: "Item is already in your wishlist" };
    }

    const newWishlistItems = [...wishlistItems, item];
    setWishlistItems(newWishlistItems);

    try {
      // Call backend
      const itemId = item.id || item._id;
      await api.post(`/api/wishlist/${user._id}/wishlist`, { itemId });

      // For now, save to localStorage as fallback
      localStorage.setItem(
        `wishlist_${user._id}`,
        JSON.stringify(newWishlistItems)
      );

      return { success: true, message: "Item added to your wishlist!" };
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      // Revert on error
      setWishlistItems(wishlistItems);
      return { success: false, message: "Failed to add item to wishlist" };
    }
  };

  const removeFromWishlist = async (itemId) => {
    if (!user) return { success: false, message: "Please log in" };

    const getId = (obj) => (obj && (obj.id || obj._id)) || obj;
    const newWishlistItems = wishlistItems.filter(
      (item) =>
        getId(item) !== itemId &&
        getId(item) !==
          (itemId.id || itemId._id ? itemId.id || itemId._id : itemId)
    );
    setWishlistItems(newWishlistItems);

    try {
      // Call backend
      await api.delete(`/api/wishlist/${user._id}/wishlist/${itemId}`);

      // For now, save to localStorage as fallback
      localStorage.setItem(
        `wishlist_${user._id}`,
        JSON.stringify(newWishlistItems)
      );

      return { success: true, message: "Item removed from wishlist" };
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      // Revert on error
      setWishlistItems(wishlistItems);
      return { success: false, message: "Failed to remove item from wishlist" };
    }
  };

  const getId = (obj) => (obj && (obj.id || obj._id)) || obj;

  const isInWishlist = (itemId) => {
    return wishlistItems.some(
      (item) =>
        getId(item) ===
        (itemId.id || itemId._id ? itemId.id || itemId._id : itemId)
    );
  };

  const toggleWishlist = async (item) => {
    const id = getId(item);
    if (isInWishlist(id)) {
      return await removeFromWishlist(id);
    } else {
      return await addToWishlist(item);
    }
  };

  const value = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    loadWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
