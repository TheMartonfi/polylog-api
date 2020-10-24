require("dotenv").config();

const ENV = process.env.ENV || "development";
const app = require(".");
const db = require("./db");

const create = require("./routes/db/create");
const reset = require("./routes/db/reset");
const lectures = require("./routes/lectures");
const user = require("./routes/user");
const topicCards = require("./routes/topic/cards");
const topicResponses = require("./routes/topic/responses");
const topicReactions = require("./routes/topic/reactions");
const quizCards = require("./routes/quiz/cards");

app.use("/api", lectures(db));
app.use("/api", user(db));

app.use("/api/topic", topicCards(db));
app.use("/api/topic", topicResponses(db));
app.use("/api/topic", topicReactions(db));

app.use("/api/quiz", quizCards(db));

// Create tables or reset db
if (ENV === "development" || ENV === "test") {
	app.use("/api/db", create(db));
	app.use("/api/db", reset(db));
}

// Make one api end point for cards
// in the route get all the cards and parse the data so the
// front end can display the cards properly
