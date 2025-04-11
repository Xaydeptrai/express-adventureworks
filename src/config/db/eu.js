module.exports = {
  user: process.env.EU_DB_USER || "sa",
  password: process.env.EU_DB_PASSWORD || "Password123@",
  server: process.env.EU_DB_IP || "localhost",
  database: "SalesEU",
  options: {
    encrypt: false,
    trustServerCertificate: true,
    port: parseInt(process.env.EU_DB_PORT) || 1436,
  },
  pool: {
    max: 15,
    min: 3,
    idleTimeoutMillis: 30000,
  },
};
