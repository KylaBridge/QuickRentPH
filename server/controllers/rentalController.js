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

    // Handle images: combination of existing and new images
    if (req.body.existingImages || (req.files && req.files.length > 0)) {
      const existingImages = req.body.existingImages
        ? Array.isArray(req.body.existingImages)
          ? req.body.existingImages
          : [req.body.existingImages]
        : [];
      const newImages = req.files ? req.files.map((file) => file.path) : [];

      // Combine existing and new images
      updatedImages = [...existingImages, ...newImages];

      // Remove old images that are no longer used
      if (Array.isArray(item.images)) {
        const imagesToDelete = item.images.filter(
          (imgPath) => !existingImages.includes(imgPath)
        );
        await Promise.all(
          imagesToDelete.map((imgPath) =>
            fs.promises.unlink(imgPath).catch(() => null)
          )
        );
      }
    } else if (req.files && req.files.length > 0) {
      // If no existingImages specified but new files uploaded, replace all images
      if (Array.isArray(item.images)) {
        await Promise.all(
          item.images.map((imgPath) =>
            fs.promises.unlink(imgPath).catch(() => null)
          )
        );
      }
      updatedImages = req.files.map((file) => file.path);
    }

    const updatedData = {
      ...req.body,
      images: updatedImages,
    };

    // Remove existingImages from the data before saving to database
    delete updatedData.existingImages;

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
