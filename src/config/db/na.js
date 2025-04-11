module.exports = {
  user: process.env.NA_DB_USER || "sa",
  password: process.env.NA_DB_PASSWORD || "Password123@",
  server: process.env.NA_DB_IP || "192.168.1.5",
  database: "SalesNA",
  options: {
    encrypt: false,
    trustServerCertificate: true,
    port: parseInt(process.env.NA_DB_PORT) || 1535,
  },
  pool: {
    max: 15,
    min: 3,
    idleTimeoutMillis: 30000,
  },
};
