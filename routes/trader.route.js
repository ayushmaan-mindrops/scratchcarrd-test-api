/**
 * @swagger
 * tags:
 *   name: Trader
 *   description: Trader Routes
 */
const express = require("express");
const router = express.Router();

const traderController = require("../controllers/trader.controller");
const auth = require("../middlewares/auth.middleware");

router.use(auth);

/**
 * @swagger
 * /trader:
 *   get:
 *     summary: Get a list of traders
 *     description: Retrieve a paginated list of traders with optional search, filter, sort, and pagination NOTE ( In this example we have only provided lte_date, lte_numberOfSheets, gte_date, gte_numberOfSheets for reference purposes, but you can use lte and gte dynamically with any field name in the schema of the Traders for e.g. lte_pincode=118005 ). To Find Range use both lte_"fieldName" and gte_"fieldName" together.
 *     tags: [Trader]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter traders by name, code, email, contact person name, mobile, or number of sheets.
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to filter on (provide a gte or lte based on your requirements, for finding a range use both lte & gte. for e.g. ?filter=numberOfSheets&gte_numberOfSheets=200&lte_numberOfSheets=1000 will find all traders whose numberOfSheets lies between 200 and 1000).
 *       - in: query
 *         name: gte_date
 *         schema:
 *           type: string
 *         description: Lower Limit for filtering ( gte_date=1/1/2024, will find all traders who were registered after 1/1/2024 (including 1/1/2024) ).
 *       - in: query
 *         name: lte_date
 *         schema:
 *           type: string
 *         description: Upper Limit for filtering ( lte_date=1/1/2024, will find all traders who were registered before 1/1/2024 (including 1/1/2024) ).
 *       - in: query
 *         name: gte_numberOfSheets
 *         schema:
 *           type: string
 *         description: Lower Limit for filtering ( gte_numberOfSheets=200, will find all traders whose number of sheets purchased is more than or equal to 200 ).
 *       - in: query
 *         name: lte_numberOfSheets
 *         schema:
 *           type: string
 *         description: Lower Limit for filtering ( lte_numberOfSheets=200, will find all traders whose number of sheets purchased is less than or equal to 200 ).
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Field to sort by.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: Sorting order (asc/desc). Default is asc.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination. Default is 1.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page. Default is 10.
 *     responses:
 *       200:
 *         description: Successful response with paginated list of traders.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   description: Total number of traders.
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages.
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number.
 *                 traders:
 *                   type: array
 *                   items:
 *                     $ref: './Trader.schema.json'
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
router.get("/", traderController.getTraders);

/**
 * @swagger
 * /trader:
 *   post:
 *     summary: Create a new trader
 *     description: Create a new trader by passing necessary information in request's body
 *     tags: [Trader]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               traderName:
 *                 type: string
 *                 description: Name of the trader.
 *               traderCode:
 *                 type: string
 *                 description: Code of the trader.
 *               contactPersonName:
 *                 type: string
 *                 description: Name of the contact person.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email of the trader.
 *               mobile:
 *                 type: string
 *                 description: Mobile number of the trader.
 *               address:
 *                 type: string
 *                 description: Address of the trader.
 *               state:
 *                 type: string
 *                 description: State of the trader.
 *               pincode:
 *                 type: integer
 *                 description: Pincode of the trader.
 *               numberOfSheets:
 *                 type: integer
 *                 description: Number of sheets.
 *     responses:
 *       200:
 *         description: Successful response with the newly created trader.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 trader:
 *                   $ref: './Trader.schema.json'
 *       400:
 *         description: Bad request. Check the error message for details.
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
router.post("/", traderController.createTrader);

router.patch("/:id", traderController.updateTrader); //Not in use

/**
 * @swagger
 * /trader/{id}:
 *   delete:
 *     summary: Delete a trader by ID
 *     description: Delete a trader and all scratchcards associated with it by ID.
 *     tags: [Trader]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the trader to delete.
 *     responses:
 *       200:
 *         description: Successful response after deleting the trader and associated ScratchCards.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       400:
 *         description: Bad request or validation error. Check the error message for details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                 validationErrors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         description: The field with the validation error.
 *                       message:
 *                         type: string
 *                         description: The validation error message.
 *       404:
 *         description: Trader not found.
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
router.delete("/", traderController.deleteTraders);

router.get("/:id", traderController.getTrader);

module.exports = router;
