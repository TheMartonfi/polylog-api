require("dotenv").config();
const ENV = process.env.ENV || "development";
const PORT = process.env.PORT || 3001;

const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const db = require("./db");

const dbRoutes = require("./routes/db");
const user = require("./routes/user");
const lecture = require("./routes/lecture");
const session = require("./routes/session");
const topic = require("./routes/topic");
const quiz = require("./routes/quiz");

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/user", user(db));
app.use("/api/lecture", lecture(db));
app.use("/api/session", session(db));
app.use("/api/topic", topic(db));
app.use("/api/quiz", quiz(db));

if (ENV === "development" || ENV === "test") {
	app.use("/api/db", dbRoutes(db));
}

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT} in ${ENV} mode`);
});

// This should be application.js
// The routes should need a paramater for the ws functions
// I can export an application function from here that takes
// the ws functions as paramaters
// and setup a server in ws.js which should be named index.js
