const ScratchCard = require("../models/ScratchCard.model");
const { Op, literal } = require("sequelize");
const Trader = require("../models/Trader.model");
const moment = require("moment");

exports.getTraders = async (req, res) => {
  try {
    let whereClause = {};
    let order = [];

    if (req.query.search) {
      const searchTerm = req.query.search;
      whereClause[Op.or] = [
        { traderName: { [Op.iLike]: `%${searchTerm}%` } },
        { traderCode: { [Op.iLike]: `%${searchTerm}%` } },
        { email: { [Op.iLike]: `%${searchTerm}%` } },
        { contactPersonName: { [Op.iLike]: `%${searchTerm}%` } },
        { mobile: { [Op.iLike]: `%${searchTerm}%` } },
        literal(`CAST("numberOfSheets" AS VARCHAR) ILIKE '%${searchTerm}%'`),
      ];
    }

    if (req.query.filter) {
      const filters = req.query.filter.split(",");

      filters.forEach((filter) => {
        const trimmedFilter = filter.trim();
        const gteValue = req.query[`gte_${trimmedFilter}`];
        const lteValue = req.query[`lte_${trimmedFilter}`];

        if (trimmedFilter === "date") {
          if (gteValue && lteValue) {
            whereClause["createdAt"] = {
              [Op.between]: [
                moment(gteValue, "D/M/YYYY").toDate(),
                moment(lteValue, "D/M/YYYY").toDate(),
              ],
            };
          } else if (gteValue) {
            whereClause["createdAt"] = {
              [Op.gte]: moment(gteValue, "D/M/YYYY").toDate(),
            };
          } else if (lteValue) {
            whereClause["createdAt"] = {
              [Op.lte]: moment(lteValue, "D/M/YYYY").toDate(),
            };
          } else {
            throw new Error(
              "Either gte or lte is required for date filtering."
            );
          }
        } else {
          if (gteValue && lteValue) {
            whereClause[trimmedFilter] = {
              [Op.between]: [gteValue, lteValue],
            };
          } else if (gteValue) {
            whereClause[trimmedFilter] = { [Op.gte]: gteValue };
          } else if (lteValue) {
            whereClause[trimmedFilter] = { [Op.lte]: lteValue };
          } else {
            throw new Error(
              `Either gte_${trimmedFilter} or lte_${trimmedFilter} is required for filtering ${trimmedFilter}.`
            );
          }
        }
      });
    }

    if (req.query.sort) {
      const sortField = req.query.sort;
      const sortOrder = req.query.order || "asc";
      order.push([sortField, sortOrder.toUpperCase()]);
    } else {
      // Default sorting order for date field
      order.push(["createdAt", "desc"]);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: traders } = await Trader.findAndCountAll({
      where: whereClause,
      order,
      offset,
      limit,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      totalItems: count,
      totalPages,
      currentPage: page,
      traders,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.createTrader = async (req, res) => {
  const {
    traderName,
    traderCode,
    contactPersonName,
    email,
    mobile,
    address,
    state,
    pincode,
    numberOfSheets,
  } = req.body;

  if (
    !traderName ||
    !traderCode ||
    !contactPersonName ||
    !email ||
    !mobile ||
    !address ||
    !pincode
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    if (numberOfSheets < 0) {
      return res
        .status(400)
        .json({ error: "Number of sheets cannot be less than 0" });
    }
    const existingTrader = await Trader.findOne({
      where: {
        traderCode,
      },
    });

    if (existingTrader) {
      return res
        .status(400)
        .json({ error: "Trader with this code already exists!" });
    }

    const existingEmail = await Trader.findOne({
      where: {
        email,
      },
    });
    if (existingEmail) {
      return res
        .status(400)
        .json({ error: "Trader with this email already exists!" });
    }

    const newTrader = await Trader.create({
      traderName,
      traderCode,
      contactPersonName,
      email,
      mobile,
      address,
      state,
      pincode,
      numberOfSheets,
    });

    res.json({ message: "New Trader Created!", trader: newTrader });
  } catch (error) {
    console.error("Error creating Trader:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateTrader = async (req, res) => {
  res.json({ message: "Trader Updated!" });
};

exports.deleteTraders = async (req, res) => {
  try {
    const traderIds = req.body.ids;

    if (!traderIds || !Array.isArray(traderIds) || traderIds.length === 0) {
      return res.status(400).json({ error: "Trader IDs array is required." });
    }

    const deletedCount = await Trader.destroy({
      where: {
        id: {
          [Op.in]: traderIds,
        },
      },
      include: [{ model: ScratchCard }],
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Traders not found." });
    }

    res.json({ message: "Traders and associated ScratchCards deleted." });
  } catch (error) {
    console.error("Error deleting Traders:", error);

    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeAssociationError"
    ) {
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res
        .status(400)
        .json({ error: "Validation error", validationErrors });
    }

    res.status(500).json({ error: error.message });
  }
};

exports.getTrader = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Trader ID is required." });
  }
  try {
    const trader = await Trader.findByPk(id);
    if (!trader) {
      return res.status(404).json({ error: "Trader not found." });
    }
    return res.status(200).json({ message: "Trader Found!", trader });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
