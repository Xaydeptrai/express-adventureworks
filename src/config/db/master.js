module.exports = {
  user: process.env.MASTER_DB_USER || "sa",
  password: process.env.MASTER_DB_PASSWORD || "Password123@",
  server: process.env.MASTER_DB_IP || "192.168.1.5",
  database: "AdventureWorks2022",
  options: {
    encrypt: false,
    trustServerCertificate: true,
    port: parseInt(process.env.MASTER_DB_PORT) || 1533,
  },
  pool: {
    max: 15,
    min: 3,
    idleTimeoutMillis: 30000,
  },
};
