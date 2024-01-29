// models/Student.js
const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role:{
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "admin",
    validate: {
      isIn: [["user", "admin"]],
    },
  },
  img: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "images/defaultProfile.png",
  },
});

module.exports = User;
