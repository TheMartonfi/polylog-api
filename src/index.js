const express = require("express");
const app = express();
const db = require("./db");
const cors = require("cors");
const morgan = require("morgan");

const user = require("./routes/user");
const lecture = require("./routes/lecture");
const session = require("./routes/session");
const topic = require("./routes/topic");
const quiz = require("./routes/quiz");

app.use(cors());
app.use(morgan("dev"));
app.use("/api/user", user(db));
app.use("/api/lecture", lecture(db));
app.use("/api/session", session(db));
app.use("/api/topic", topic(db));
app.use("/api/quiz", quiz(db));

module.exports = app;
