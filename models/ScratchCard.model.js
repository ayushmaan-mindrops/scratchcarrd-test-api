const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Trader = require("./Trader.model");
const Product = require("./Product.model");

const ScratchCard = sequelize.define("ScratchCard", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pending",
    validate: {
      isIn: [["pending", "redeemed"]],
    },
  },
  isMega: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

Trader.hasMany(ScratchCard, { onDelete: "CASCADE" });
ScratchCard.belongsTo(Trader);
Product.hasMany(ScratchCard, { onDelete: "CASCADE" });
ScratchCard.belongsTo(Product);

module.exports = ScratchCard;
