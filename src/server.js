require("dotenv").config();

const ENV = process.env.ENV || "development";
const app = require(".");
const db = require("./db");

const dbRoutes = require("./routes/db");
const user = require("./routes/user");
const lecture = require("./routes/lecture");
const session = require("./routes/session");
const topic = require("./routes/topic");
const quiz = require("./routes/quiz");

app.use("/api/user", user(db));
app.use("/api/lecture", lecture(db));
app.use("/api/session", session(db));
app.use("/api/topic", topic(db));
app.use("/api/quiz", quiz(db));

if (ENV === "development" || ENV === "test") {
	app.use("/api/db", dbRoutes(db));
}

// Client makes post request
// ie: /api/lecture/new
// When resolving the promise for db query
// I want the new records data and I want to send it to all clients
// wss.send.toAllClients((type, data));
// With type of data being changed and the data
