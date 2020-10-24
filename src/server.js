require("dotenv").config();

// const path = require("path");
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

// function read(file) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(
//       file,
//       {
//         encoding: "utf-8"
//       },
//       (error, data) => {
//         if (error) return reject(error);
//         resolve(data);
//       }
//     );
//   });
// }

if (ENV === "development" || ENV === "test") {
	app.get("/api/db/reset", (req, res) => {
		fs.readdir(dbSchemas, (err, files) => {
			if (err) return console.log(`Could not read ${dbSchemas} Error: ${err}`);

			let dbCreate = "";
			files.forEach((file, index) => {
				// console.log(file);
				fs.readFile(
					`${dbSchemas}${file}`,
					{ encoding: "UTF-8" },
					(err, data) => {
						if (err) return console.log(`Could not read ${file} Error: ${err}`);
						dbCreate += data;

						if (index === files.length - 1) {
							db.query(dbCreate)
								.then(() => {
									console.log("Database Reset");
									res.status(200).send("Database Reset");
								})
								.catch(error => {
									console.log(`Error setting up the reset route: ${error}`);
								});
						}
					}
				);
			});
		});
	});
}

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT} in ${ENV} mode`);
});
