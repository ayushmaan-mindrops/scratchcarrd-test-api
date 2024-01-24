const Pool = require("pg").Pool;
const { development } = require("./sequelize.config");

const pool = new Pool(development);

module.exports = pool;
