require("dotenv").config();

const fs = require("fs");
const dbSchemas = `${__dirname}/db/schemas/`;
const PORT = process.env.PORT || 3001;
const ENV = process.env.ENV || "development";
const express = require("express");
const { Pool } = require("pg");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));

const dbParams = { connectionString: process.env.DATABASE_URL || "" };
const db = new Pool(dbParams);
db.connect();

const runQuerieFiles = (files, cb) => {
	let query = "";
	files.forEach((file, index) => {
		fs.readFile(`${dbSchemas}${file}`, { encoding: "UTF-8" }, (err, data) => {
			if (err) return console.log(`Could not read ${file} Error: ${err}`);
			query += data;

			if (index === files.length - 1) {
				db.query(query)
					.then(() => {
						cb();
					})
					.catch(err => {
						console.log(err);
					});
			}
		});
	});
};

if (ENV === "development" || ENV === "test") {
	app.get("/api/db/reset", (req, res) => {
		fs.readdir(dbSchemas, (err, files) => {
			if (err) return console.log(`Could not read ${dbSchemas} Error: ${err}`);
			runQuerieFiles(files, () => {
				console.log("Created Tables");
				// res.status(200).send("Database Reset");
			});
		});
	});
}

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT} in ${ENV} mode`);
});
