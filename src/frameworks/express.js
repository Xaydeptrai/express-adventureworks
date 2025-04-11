const express = require("express");
const cors = require("cors");
const productRoutes = require("../routes/productRoutes");
const orderRoutes = require("../routes/orderRoutes");
const healthRoute = require("../routes/healthRoute");
const reportRoute = require("../routes/reportRoute");

module.exports = () => {
  const app = express();
  app.use(express.json());

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

  app.use("/api", productRoutes);
  app.use("/api", orderRoutes);
  app.use("/api", healthRoute);
  app.use("/api", reportRoute);

  app.use((req, res) => {
    res.status(404).send("undefined");
  });

  return app;
};
