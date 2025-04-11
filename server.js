const express = require("./src/frameworks/express");
const config = require("./src/config/server");
const db = require("./src/utils/db/db");

const startServer = async () => {
  const app = express();
  await db.init();

  const PORT = config.PORT;
  app.listen(PORT, () => console.log(`Service running on port ${PORT}`));
};

startServer().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
