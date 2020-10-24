require("dotenv").config();

const ENV = process.env.ENV || "development";
const app = require(".");
const db = require("./db");
const create = require("./routes/db/create");
const reset = require("./routes/db/reset");
const lectures = require("./routes/lectures");
const user = require("./routes/user");

app.use("/api", lectures(db));
app.use("/api", user(db));

// Create tables or reset db
if (ENV === "development" || ENV === "test") {
	app.use("/api/db", create(db));
	app.use("/api/db", reset(db));
}
