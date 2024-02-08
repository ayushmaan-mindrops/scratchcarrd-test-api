// models/Product.js
const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "/images/default.jpg",
  },
  isMega: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  productValue: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isGreaterThanZero(value) {
        if (value <= 0) {
          throw new Error("productValue must be greater than 0");
        }
      },
    },
  },
});

module.exports = Product;
