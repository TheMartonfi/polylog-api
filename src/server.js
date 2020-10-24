require("dotenv").config();

const ENV = process.env.ENV || "development";
const db = require("./db");
const create = require("./routes/db/create");
const reset = require("./routes/db/reset");
const { runSchemaFiles, runSeedFiles } = require("./db/helpers");
const morgan = require("morgan");
const app = require(".");

app.use(morgan("dev"));

// Create tables or reset db
if (ENV === "development" || ENV === "test") {
	app.use("/api/db", create(db));
	app.use("/api/db", reset(db));
}
