/**
 * @swagger
 * tags:
 *   name: ScratchCard
 *   description: ScratchCard Routes
 */
const express = require("express");
const router = express.Router();

const scratchCardController = require("../controllers/scratchcard.controller");
const auth = require("../middlewares/auth.middleware");

router.use(auth);

/**
 * @swagger
 * /scratchcard:
 *   post:
 *     summary: Create a new ScratchCard
 *     description: Create a new ScratchCard by only passing the traderId( the trader the scratchcard should be assigned to ) & productId ( the product underneath the scartchcard, after scratching )
 *     tags: [ScratchCard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               traderId:
 *                 type: string
 *                 description: The ID of the trader associated with the ScratchCard.
 *               productId:
 *                 type: string
 *                 description: The ID of the product associated with the ScratchCard.
 *     responses:
 *       201:
 *         description: Successful response with the newly created ScratchCard.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 scratchcard:
 *                   $ref: './ScratchCard.schema.json'
 *       404:
 *         description: Trader or Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *       200:
 *         description: Scratchcard already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Information message.
 *                 scratchcard:
 *                   $ref: './ScratchCard.schema.json'
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
router.post("/", scratchCardController.createScratchCard);

/**
 * @swagger
 * /scratchcard:
 *   get:
 *     summary: Get a list of ScratchCards
 *     tags: [ ScratchCard ]
 *     description: Retrieve a paginated list of ScratchCards with optional filters and pagination.
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: Filter ScratchCards by product ID.
 *       - in: query
 *         name: traderId
 *         schema:
 *           type: string
 *         description: Filter ScratchCards by trader ID.
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
 *         description: Successful response with paginated list of ScratchCards.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 totalItems:
 *                   type: integer
 *                   description: Total number of ScratchCards.
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages.
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number.
 *                 scratchcards:
 *                   type: array
 *                   items:
 *                     $ref: './ScratchCard.schema.json'
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
// router.get("/", scratchCardController.getScratchCards);

/**
 * @swagger
 * /scratchcard/{id}:
 *   patch:
 *     summary: Update the status of a ScratchCard by ID
 *     description: Update the status of a ScratchCard but only status can be updated for a single scratchcard.
 *     tags: [ ScratchCard ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ScratchCard to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the ScratchCard to update.
 *               status:
 *                 type: string
 *                 description: The updated status of the ScratchCard.
 *     responses:
 *       200:
 *         description: Successful response after updating the ScratchCard.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 scratchcard:
 *                   $ref: './ScratchCard.schema.json'
 *       404:
 *         description: ScratchCard not found.
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
router.patch("/:id", scratchCardController.updateScratchCard);

/**
 * @swagger
 * /scratchcard/{id}:
 *   delete:
 *     summary: Delete a ScratchCard by ID
 *     description: Delete a ScratchCard by ID
 *     tags: [ ScratchCard ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ScratchCard to delete.
 *     responses:
 *       200:
 *         description: Successful response after deleting the ScratchCard.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       404:
 *         description: ScratchCard not found.
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
router.delete("/:id", scratchCardController.deleteScratchCard);

/**
 * @swagger
 * /scratchcard/{id}:
 *   get:
 *     summary: (IMPORTANT) Get ScratchCards for a specific trader by ID
 *     description: This acts as the main URL, (what should be sent to the client ) Retrieve ScratchCards for a specific trader by their ID with optional filters.
 *     tags: [ ScratchCard ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the trader for whom ScratchCards are to be retrieved.
 *     responses:
 *       200:
 *         description: Successful response with ScratchCards for the specified trader.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 totalItems:
 *                   type: integer
 *                   description: Total number of ScratchCards for the trader.
 *                 scratchcards:
 *                   type: array
 *                   items:
 *                     $ref: './ScratchCard.schema.json'
 *       404:
 *         description: Trader not found or no ScratchCards assigned to the trader.
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
router.get("/:id", scratchCardController.getScratchCard);

router.get("/mega/:id", scratchCardController.getMegaScratchCards);

/**
 * @swagger
 * /scratchcard/redeem/{id}:
 *   post:
 *     summary: Redeem gifts for a specific trader by ID
 *     description: Redeem gifts for a specific trader by their ID using ScratchCards.
 *     tags: [ ScratchCard ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the trader for whom gifts are to be redeemed.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scratchcards:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of ScratchCard IDs to be redeemed.
 *     responses:
 *       200:
 *         description: Successful response after redeeming gifts for the specified trader.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 redeemedScratchcards:
 *                   type: array
 *                   items:
 *                     $ref: './ScratchCard.schema.json'
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
router.post("/redeem/:id", scratchCardController.redeemGifts);

module.exports = router;
