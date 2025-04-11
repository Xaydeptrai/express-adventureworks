const express = require("./src/frameworks/express");
const db = require("./src/utils/db/db");

const startServer = async () => {
  const app = express();
  await db.init();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => console.log(`Service running on port ${PORT}`));
};

startServer().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
