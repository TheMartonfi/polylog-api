require("dotenv").config();
const ENV = process.env.ENV || "development";
const PORT = process.env.PORT || 3001;

const db = require("./db");
const dbRoutes = require("./routes/db");
const app = require(".");

if (ENV === "development" || ENV === "test") {
	app.use("/api/db", dbRoutes(db));
}

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT} in ${ENV} mode`);
});
