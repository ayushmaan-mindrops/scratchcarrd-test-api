/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product routes
 */
const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");
const upload = require("../middlewares/upload.middleware");

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get a list of products
 *     description: Retrieve a list of products ordered by product value.
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Successful response with a list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 count:
 *                   type: integer
 *                   description: Total number of products.
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: './Product.schema.json'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *   post:
 *     summary: Create a new product
 *     description: Create a new product with the provided details.
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: './Product.schema.json'
 *     responses:
 *       201:
 *         description: Successful response after creating a new product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 product:
 *                   $ref: './Product.schema.json'
 *       400:
 *         description: Bad request or validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 */
router.get("/", productController.getProducts);
router.post("/", upload.single("img"), productController.createProduct);

/**
 * @swagger
 * /product/{id}:
 *   patch:
 *     summary: Update a product by ID
 *     description: Update an existing product with the provided details.
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: './Product.schema.json'
 *     responses:
 *       200:
 *         description: Successful response after updating the product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *   delete:
 *     summary: Delete a product by ID
 *     description: Delete an existing product by its ID.
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to be deleted.
 *     responses:
 *       200:
 *         description: Successful response after deleting the product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 */
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
