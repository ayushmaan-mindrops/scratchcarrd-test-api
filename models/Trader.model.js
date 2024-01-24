// models/Student.js
const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Trader = sequelize.define("Trader", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  traderName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  traderCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contactPersonName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pincode: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  numberOfSheets: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Trader;
