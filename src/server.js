require("dotenv").config();

const ENV = process.env.ENV || "development";
const app = require(".");
const db = require("./db");

const dbRoutes = require("./routes/db");
const user = require("./routes/user");
const lecture = require("./routes/lecture");
const topic = require("./routes/topic");
const quiz = require("./routes/quiz");

app.use("/api/user", user(db));
app.use("/api/lecture", lecture(db));
app.use("/api/topic", topic(db));
app.use("/api/quiz", quiz(db));

// /create /reset
if (ENV === "development" || ENV === "test") {
	app.use("/api/db", dbRoutes(db));
}
