const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

const db = require("./db");

const user = require("./routes/user");
const lecture = require("./routes/lecture");
const session = require("./routes/session");
const topic = require("./routes/topic");
const quiz = require("./routes/quiz");

// For url name get, puts and delete maybe include :id?
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/user", user(db));
app.use("/api/lecture", lecture(db));
app.use("/api/session", session(db));
app.use("/api/topic", topic(db));
app.use("/api/quiz", quiz(db));

module.exports = app;
