import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./authContext";

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
      // TODO: Backend API call
      // const response = await fetch(`/api/users/${user._id}/wishlist`);
      // const data = await response.json();
      // setWishlistItems(data.wishlistItems || []);

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
    if (wishlistItems.some((wishItem) => wishItem.id === item.id)) {
      return { success: false, message: "Item is already in your wishlist" };
    }

    const newWishlistItems = [...wishlistItems, item];
    setWishlistItems(newWishlistItems);

    try {
      // TODO: Backend API call
      // await fetch(`/api/users/${user._id}/wishlist`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ itemId: item.id })
      // });

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

    const newWishlistItems = wishlistItems.filter((item) => item.id !== itemId);
    setWishlistItems(newWishlistItems);

    try {
      // TODO: Backend API call
      // await fetch(`/api/users/${user._id}/wishlist/${itemId}`, {
      //   method: 'DELETE'
      // });

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

  const isInWishlist = (itemId) => {
    return wishlistItems.some((item) => item.id === itemId);
  };

  const toggleWishlist = async (item) => {
    if (isInWishlist(item.id)) {
      return await removeFromWishlist(item.id);
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
