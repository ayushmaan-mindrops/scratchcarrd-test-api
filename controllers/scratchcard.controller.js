const Product = require("../models/Product.model");
const Trader = require("../models/Trader.model");
const ScratchCard = require("../models/ScratchCard.model");

exports.createScratchCard = async (req, res) => {
  try {
    const { traderId, productId } = req.body;
    console.log(traderId, productId);

    if (!traderId || !productId) {
      return res
        .status(400)
        .json({ error: "Trader ID && Product ID is required." });
    }

    const trader = await Trader.findByPk(traderId);
    const product = await Product.findByPk(productId);

    if (!trader || !product) {
      return res.status(404).json({ error: "Trader or Product not found." });
    }

    const existingScratchCard = await ScratchCard.findOne({
      where: {
        TraderId: traderId,
        ProductId: productId,
        status: "pending",
      },
    });

    if (existingScratchCard) {
      return res.status(200).json({
        message: "Scratchcard already exists",
        scratchcard: existingScratchCard,
      });
    }

    const newScratchCard = await ScratchCard.create({
      status: "pending",
      TraderId: traderId,
      ProductId: productId,
    });

    return res.status(201).json({
      message: "New Scratchcard created",
      scratchcard: newScratchCard,
    });
  } catch (error) {
    console.error("Error creating ScratchCard:", error);
    return res.status(500).json({ error: error.message });
  }
};

//you can only update status of a scratchcard
exports.updateScratchCard = async (req, res) => {
  try {
    const { id, status } = req.body;

    const scratchcard = await ScratchCard.findByPk(id);

    if (!scratchcard) {
      return res.status(404).json({ error: "ScratchCard not found." });
    }

    await scratchcard.update({ status });

    return res.status(200).json({
      message: "ScratchCard updated successfully",
      scratchcard,
    });
  } catch (error) {
    console.error("Error updating ScratchCard:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteScratchCard = async (req, res) => {
  try {
    const { id } = req.params;

    const scratchcard = await ScratchCard.findByPk(id);

    if (!scratchcard) {
      return res.status(404).json({ error: "ScratchCard not found." });
    }

    await scratchcard.destroy();

    return res.status(200).json({
      message: "ScratchCard deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ScratchCard:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getScratchCards = async (req, res) => {
  try {
    const { productId, traderId, page = 1, limit = 10 } = req.query;
    let whereClause = {};

    if (productId) {
      whereClause.ProductId = productId;
    }

    if (traderId) {
      whereClause.TraderId = traderId;
    }

    const options = {
      where: whereClause,
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      include: [Product],
    };

    const { count, rows: scratchcards } = await ScratchCard.findAndCountAll(
      options
    );

    return res.status(200).json({
      message: "ScratchCards found!",
      totalItems: count,
      totalPages: Math.ceil(count / parseInt(limit)),
      currentPage: parseInt(page),
      scratchcards,
    });
  } catch (error) {
    console.error("Error fetching ScratchCards:", error);
    return res.status(500).json({ error: error.message });
  }
};
// Returning scratchcards of a specific trader to be displayed
exports.getScratchCard = async (req, res) => {
  try {
    const { id } = req.params;
    const trader = await Trader.findByPk(id);
    if (!trader) {
      return res.status(404).json({ error: "Invalid URL" });
    }
    let { count, rows: scratchcards } = await ScratchCard.findAndCountAll({
      where: {
        TraderId: id,
        status: "pending",
      },
      include: [Product],
    });
    if (scratchcards.length == 0) {
      return res.status(404).json({
        error: `${trader.traderName} currently has no Scratchcard assigned to them.`,
      });
    }
    return res.status(200).json({
      message: `ScratchCards for ${trader.traderName} Found!`,
      totalItems: count,
      scratchcards,
    });
  } catch (error) {
    console.error("Error fetching ScratchCard:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.redeemGifts = async (req, res) => {
  try {
    let { id } = req.params;
    const trader = await Trader.findByPk(id);
    console.log(id, trader);
    if (!trader) {
      return res.status(404).json({ error: "Invalid! No Trader found!" });
    }

    let { scratchcards } = req.body;
    if (!scratchcards || scratchcards.length === 0) {
      return res
        .status(400)
        .json({ error: "Provide at least one scratchcard to redeem" });
    }

    const updatedScratchcards = await ScratchCard.update(
      { status: "redeemed" },
      {
        where: { id: scratchcards, status: "pending" },
        include: [Product],
        returning: true,
      }
    );

    if (updatedScratchcards[0] === 0) {
      return res
        .status(400)
        .json({ error: "No valid scratchcards found to redeem" });
    }

    return res.status(200).json({
      message: "Scratchcards redeemed successfully",
      redeemedScratchcards: updatedScratchcards[1],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
