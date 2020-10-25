require("dotenv").config();
// Remove table 11 with seeds 11

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

// quiz put and delete

// I made individual routes for all post requests
// quiz question/ quiz answer are seperate
// combine them later?

// /create /reset
if (ENV === "development" || ENV === "test") {
	app.use("/api/db", dbRoutes(db));
}
