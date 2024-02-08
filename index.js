const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();

const cors = require("cors");
const sequelize = require("./sequelize");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");

//Routes
const traderRoutes = require("./routes/trader.route");
const productRoutes = require("./routes/product.route");
const scratchCardRoutes = require("./routes/scratchcard.route");
const authRoutes = require("./routes/auth.route");

const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((error) => {
    console.error("Error synchronizing database:", error);
  });

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/fonts", express.static(path.join(__dirname, "fonts")));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
app.get("/", (req, res) => {
  console.log(__dirname);
  res.send("Hello To ScratchCard's Backend!");
});

app.use("api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/trader", traderRoutes);
app.use("/product", productRoutes);
app.use("/scratchcard", scratchCardRoutes);
app.use("", authRoutes);
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Server is running on port " + PORT);
  } catch (err) {
    console.log("Cound't connect");
  }
});
