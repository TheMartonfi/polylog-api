require("dotenv").config();

const ENV = process.env.ENV || "development";
const app = require(".");
const db = require("./db");

const create = require("./routes/db/create");
const reset = require("./routes/db/reset");

const user = require("./routes/user/");
const userNew = require("./routes/user/new");

const lectures = require("./routes/lecture/");
const lectureNew = require("./routes/lecture/new");

const topicCards = require("./routes/topic/cards");
const topicResponses = require("./routes/topic/responses");
const topicNewCard = require("./routes/topic/new/card");
const topicNewResponse = require("./routes/topic/new/response");
const topicNewReaction = require("./routes/topic/new/reaction");

const quizCards = require("./routes/quiz/cards");
const quizResponses = require("./routes/quiz/responses");

app.use("/api/lecture", lectures(db));
app.use("/api/lecture", lectureNew(db));

app.use("/api/user", user(db));
app.use("/api/user", userNew(db));

app.use("/api/topic", topicCards(db));
app.use("/api/topic", topicResponses(db));
app.use("/api/topic/new", topicNewCard(db));
app.use("/api/topic/new", topicNewResponse(db));
app.use("/api/topic/new", topicNewReaction(db));

app.use("/api/quiz", quizCards(db));
app.use("/api/quiz", quizResponses(db));
// newQuiz
// newQuizQuestion
// newQuizAnswer

// Create tables or reset db
if (ENV === "development" || ENV === "test") {
	app.use("/api/db", create(db));
	app.use("/api/db", reset(db));
}
