const Product = require("../models/Product.model"); // Make sure to adjust the import based on your project structure

exports.createProduct = async (req, res) => {
  try {
    const products = req.body.products;
    const productsWithoutIds = products.map(
      ({ id, createdAt, updatedAt, ...rest }) => rest
    );

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    // Validate each product data
    for (const product of productsWithoutIds) {
      const { name, productValue, img } = product;
      if (!productValue || !name || !img) {
        return res
          .status(400)
          .json({ error: "All fields are required for each product" });
      }
    }

    // console.log(products);
    const createdProducts = await Product.bulkCreate(productsWithoutIds);

    res
      .status(201)
      .json({ message: "Products Created", products: createdProducts });
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
