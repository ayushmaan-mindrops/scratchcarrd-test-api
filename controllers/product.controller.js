const Product = require("../models/Product.model");

exports.createProduct = async (req, res) => {
  try {
    const { name, productValue } = req.body;
    if (!productValue || !name) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const img = req.file ? req.file.path : null;
    console.log(req.file, name, img);

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
    });
    res.status(200).json({ message: "Products Found!", count, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const [updatedRows] = await Product.update(req.body, {
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
