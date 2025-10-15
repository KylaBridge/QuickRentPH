# Backend Changes Required for Wishlist Functionality

## Database Schema Changes

### 1. Update User Model (`models/user.js`)

Add wishlist field to the user schema:

```javascript
const userSchema = new mongoose.Schema(
  {
    // ... existing fields ...

    // Add wishlist array to store item references
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],

    // ... rest of existing fields ...
  },
  {
    timestamps: true,
  }
);
```

## API Routes to Add

### 1. Get User Wishlist (`routes/userRoutes.js`)

```javascript
// GET /api/users/:userId/wishlist
router.get("/:userId/wishlist", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("wishlist")
      .select("wishlist");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ wishlistItems: user.wishlist });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});
```

### 2. Add Item to Wishlist

```javascript
// POST /api/users/:userId/wishlist
router.post("/:userId/wishlist", requireAuth, async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.params.userId;

    // Check if user owns the item (users shouldn't add their own items)
    const item = await Item.findById(itemId);
    if (item.owner.toString() === userId) {
      return res
        .status(400)
        .json({ error: "Cannot add your own item to wishlist" });
    }

    // Check if item already in wishlist
    const user = await User.findById(userId);
    if (user.wishlist.includes(itemId)) {
      return res.status(400).json({ error: "Item already in wishlist" });
    }

    // Add to wishlist
    await User.findByIdAndUpdate(userId, {
      $addToSet: { wishlist: itemId },
    });

    res.json({ message: "Item added to wishlist successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add item to wishlist" });
  }
});
```

### 3. Remove Item from Wishlist

```javascript
// DELETE /api/users/:userId/wishlist/:itemId
router.delete("/:userId/wishlist/:itemId", requireAuth, async (req, res) => {
  try {
    const { userId, itemId } = req.params;

    await User.findByIdAndUpdate(userId, {
      $pull: { wishlist: itemId },
    });

    res.json({ message: "Item removed from wishlist successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item from wishlist" });
  }
});
```

## Controller Updates

### 1. Update User Controller (`controllers/userController.js`)

Add wishlist-related methods:

```javascript
const getUserWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate({
        path: "wishlist",
        populate: {
          path: "owner",
          select: "username firstName lastName",
        },
      })
      .select("wishlist");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ wishlistItems: user.wishlist });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
};

const addToWishlist = async (req, res) => {
  // Implementation as shown above
};

const removeFromWishlist = async (req, res) => {
  // Implementation as shown above
};

module.exports = {
  // ... existing exports ...
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
};
```

## Frontend Integration Points

### 1. Update AuthContext to load wishlist on login

```javascript
// In authContext.jsx, after successful login:
const login = async (credentials) => {
  // ... existing login logic ...
  // After user is authenticated, load their wishlist
  // This will be handled by WishlistProvider useEffect
};
```

### 2. API Service Functions

Create `src/utils/wishlistApi.js`:

```javascript
import axios from "./axios";

export const wishlistApi = {
  getUserWishlist: (userId) => axios.get(`/api/users/${userId}/wishlist`),

  addToWishlist: (userId, itemId) =>
    axios.post(`/api/users/${userId}/wishlist`, { itemId }),

  removeFromWishlist: (userId, itemId) =>
    axios.delete(`/api/users/${userId}/wishlist/${itemId}`),
};
```

## Security Considerations

1. **Authorization**: Ensure users can only modify their own wishlist
2. **Validation**: Validate that itemId exists and is a valid ObjectId
3. **Rate Limiting**: Consider rate limiting wishlist operations
4. **Data Sanitization**: Sanitize user inputs

## Testing Requirements

1. Test adding items to wishlist
2. Test removing items from wishlist
3. Test preventing users from adding their own items
4. Test preventing duplicate items in wishlist
5. Test wishlist persistence across sessions
6. Test wishlist display in MyWishlist page

## Performance Considerations

1. **Pagination**: For users with large wishlists, implement pagination
2. **Caching**: Consider caching wishlist data for better performance
3. **Indexing**: Add database indexes on user.wishlist for faster queries

## Migration Script

If you have existing users, create a migration script to add the wishlist field:

```javascript
// migration-add-wishlist.js
const User = require("./models/user");

const addWishlistField = async () => {
  try {
    await User.updateMany(
      { wishlist: { $exists: false } },
      { $set: { wishlist: [] } }
    );
    console.log("Wishlist field added to all users");
  } catch (error) {
    console.error("Migration failed:", error);
  }
};

addWishlistField();
```
