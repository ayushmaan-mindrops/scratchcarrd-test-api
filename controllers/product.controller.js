const Product = require("../models/Product.model");
const ScratchCard = require("../models/ScratchCard.model");

exports.createProduct = async (req, res) => {
  try {
    const { name, productValue } = req.body;
    const img = req.file ? req.file.path : null;
    console.log(req.file, name, img);
    if (!productValue || !name || !img) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let prodObj = { name, productValue, img };
    const product = await Product.create(prodObj);
    res.status(201).json({ message: "Product Created", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { count, rows: products } = await Product.findAndCountAll({
      order: [["productValue", "ASC"]],
      // include: [ScratchCard],
    });
    res.status(200).json({ message: "Products Found!", count, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const img = req.file ? req.file.path : null;
    let prodObj = { ...req.body };
    if (img) {
      prodObj = { ...prodObj, img };
    }

    const [updatedRows] = await Product.update(prodObj, {
      where: { id: productId },
    });
    if (updatedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedRows = await Product.destroy({
      where: { id: productId },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted along with scratchcard" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
