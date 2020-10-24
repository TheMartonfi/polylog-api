require("dotenv").config();

const ENV = process.env.ENV || "development";
const db = require("./db");
const { runSchemaFiles, runSeedFiles } = require("./db/helpers");
const morgan = require("morgan");
const app = require(".");

app.use(morgan("dev"));

// Create tables or reset db
if (ENV === "development" || ENV === "test") {
	app.get("/api/db/create", (req, res) => {
		runSchemaFiles()
			.then(() => res.status(200).send("Created Database Tables"))
			.catch(err => res.status(500).send(err));
	});
	app.get("/api/db/reset", (req, res) => {
		runSchemaFiles()
			.then(() => {
				// runSeedFiles()
				// .then(() => res.status(200).send("Database Reset"))
				// .catch(err => res.status(500).send(err));
			})
			.catch(err => res.status(500).send(err));
	});
}
