require("dotenv").config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const { Pool } = require("pg");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));

const dbParams = { connectionString: process.env.DATABASE_URL || "" };
const db = new Pool(dbParams);
db.connect();

// db.query

// app.use("/api", days(db));
// app.use("/api", appointments(db, actions.updateAppointment));
// app.use("/api", interviewers(db));

app.get("/", (req, res) => {
	res.json({ data: "type" });
});

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT} in ${ENV} mode`);
});
