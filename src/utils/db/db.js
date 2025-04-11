const sql = require("mssql");
const { retry } = require("./retry");
const configs = require("../../config/db");

class Database {
  constructor() {
    this.pools = new Map();
  }

  async init() {
    for (const [region, config] of Object.entries(configs.getAll())) {
      await this._createPool(region, config);
    }
  }

  async _createPool(region, config) {
    try {
      const pool = new sql.ConnectionPool(config);
      const connectedPool = await pool.connect();
      this.pools.set(region, connectedPool);
      console.log(`✅ Connected to ${region.toUpperCase()} DB`);
    } catch (err) {
      console.error(
        `❌ Failed to connect ${region.toUpperCase()} DB:`,
        err.message
      );
    }
  }

  async query(region = "master", sqlQuery, params = {}) {
    const pool = this.pools.get(region);
    if (!pool) throw new Error(`Database region '${region}' not found`);

    return retry(
      async () => {
        const request = pool.request();
        Object.entries(params).forEach(([key, { type, value }]) => {
          request.input(key, type, value);
        });

        return await request.query(sqlQuery);
      },
      {
        retries: 3,
        onRetry: (err) =>
          console.log(`Retrying ${region} query...`, err.message),
      }
    );
  }

  async getTransaction(region = "master") {
    const pool = this.pools.get(region);
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    return transaction;
  }

  async close() {
    for (const [region, pool] of this.pools) {
      await pool.close();
      console.log(`Closed ${region} connection`);
    }
  }

  async checkHealth(region = "master") {
    try {
      const result = await this.query(region, "SELECT 1 AS ok");
      return result.recordset[0].ok === 1;
    } catch (err) {
      console.error(`❌ Health check failed for ${region}:`, err.message);
      return false;
    }
  }
}

module.exports = new Database();
