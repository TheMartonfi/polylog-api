require("dotenv").config();

const ENV = process.env.ENV || "development";
const fs = require("fs");
const db = require("./db");
const dbSchemas = `${__dirname}/db/schemas`;
const morgan = require("morgan");
const app = require("./server");

app.use(morgan("dev"));

const runSchemaFiles = function () {
	const schemaFilenames = fs.readdirSync(dbSchemas);
	let sql = "";
	for (const fn of schemaFilenames) {
		sql += fs.readFileSync(`${dbSchemas}/${fn}`, "utf8");
	}
	db.query(sql)
		.then(() => console.log("Created Tables"))
		.catch(err => console.log(err));
};

// GET /api/db/reset to reset db
if (ENV === "development" || ENV === "test") {
	app.get("/api/db/reset", (req, res) => {
		runSchemaFiles();
		res.status(200).send("Database Reset");
	});
}
