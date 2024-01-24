const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Scratchcard Application API Documentation - Mindrops",
      version: "1.0.0",
      description: "Documentation for the API of Scratchcard Project",
    },
    basePath: "/",
  },
  apis: ["routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
