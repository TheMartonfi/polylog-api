require("dotenv").config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
// const cookieSession = require("cookie-session");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));

// const { Pool } = require('pg');
// const dbParams = require('./lib/db.js');
// const db = new Pool(dbParams);
// db.connect();

// const usersRoutes = require("./routes/users");

app.get("/", (req, res) => {
	res.json({ data: "type" });
});

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT} in ${ENV} mode`);
});
