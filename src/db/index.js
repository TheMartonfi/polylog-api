const { Pool } = require("pg");

const dbParams = { connectionString: process.env.DATABASE_URL || "" };
const db = new Pool(dbParams);
db.connect();

module.exports = db;
