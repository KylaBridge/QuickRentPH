const Item = require("../models/item");
const fs = require("fs");

const getAllItems = async (req, res) => {
  try {
    const items = await Item.find({}).populate(
      "owner",
      "firstName lastName username"
    );
    res.status(200).json({ message: "Items fetched successfully", items });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserItems = async (req, res) => {
  try {
    const items = await Item.find({ owner: req.userId }).populate(
      "owner",
      "firstName lastName username"
    );
    res.status(200).json({ items });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addItem = async (req, res) => {
  try {
    const imagePath = req.files.map((file) => file.path);

    const itemData = {
      ...req.body,
      owner: req.userId,
      images: imagePath,
    };

    const item = await Item.create(itemData);
    res.status(201).json({ message: "Item Added Successfully", item });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Item id is required" });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    // Enforce ownership
    if (item.owner.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    let updatedImages = item.images;

    // Handle images only if images are being explicitly updated
    if (req.body.existingImages !== undefined || (req.files && req.files.length > 0)) {
      const existingImages = req.body.existingImages
        ? Array.isArray(req.body.existingImages)
          ? req.body.existingImages
          : [req.body.existingImages]
        : [];
      const newImages = req.files ? req.files.map((file) => file.path) : [];

      // Helper function to normalize paths for comparison
      const normalizePath = (path) => {
        // Extract just the filename for comparison
        return path.replace(/^.*[\\\/]/, '');
      };

      // Map existing images back to their full paths
      const mappedExistingImages = existingImages.map((existingImg) => {
        // Find the corresponding full path from current item images
        const matchingImage = item.images.find((itemImg) => {
          const existingFilename = normalizePath(existingImg);
          const itemFilename = normalizePath(itemImg);
          return existingFilename === itemFilename;
        });
        return matchingImage || existingImg; // Use original if no match found
      });

      // Combine mapped existing and new images
      updatedImages = [...mappedExistingImages, ...newImages];

      // Only delete images that are not in the mapped existing images
      if (Array.isArray(item.images)) {
        const imagesToDelete = item.images.filter((imgPath) => {
          return !mappedExistingImages.includes(imgPath);
        });
        
        await Promise.all(
          imagesToDelete.map((imgPath) =>
            fs.promises.unlink(imgPath).catch(() => null)
          )
        );
      }
    }

    const updatedData = {
      ...req.body,
    };

    // Only update images if they were explicitly modified
    if (req.body.existingImages !== undefined || (req.files && req.files.length > 0)) {
      updatedData.images = updatedImages;
      // Remove existingImages from the data before saving to database
      delete updatedData.existingImages;
    }

    const updatedItem = await Item.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res
      .status(200)
      .json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Item id is required" });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (item.owner.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const images = Array.isArray(item.images) ? item.images : [];
    await item.deleteOne();
    await Promise.all(
      images.map((p) => fs.promises.unlink(p).catch(() => null))
    );

    res.status(200).json({ message: "Item deleted", item });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getAllItems, getUserItems, addItem, updateItem, deleteItem };
