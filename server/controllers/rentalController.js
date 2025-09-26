const Item = require("../models/item");

const addItem = async (req, res) => {
  try {
    const imagePath = req.files.map((file) => file.path);

    const itemData = {
      ...req.body,
      images: imagePath,
    };

    const item = await Item.create(itemData);
    res.status(200).json({ message: "Item Added Successfuly", item });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { addItem };
