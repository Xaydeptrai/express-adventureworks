const express = require("express");
const router = express.Router();
const db = require("../utils/db/db");

router.get("/:server/health", async (req, res) => {
  try {
    const { server } = req.params;
    const ok = await db.checkHealth(server);

    if (!ok) {
      return res.status(500).json({ status: "fail", db: "unreachable" });
    }

    res
      .status(200)
      .json({ status: "ok", db: "connected to " + server + " db" });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      error: err.message,
    });
  }
});

module.exports = router;
