require("dotenv").config();
const ENV = process.env.ENV || "development";
const PORT = process.env.PORT || 3001;

const db = require("./db");
const dbRoutes = require("./routes/db");

const app = require(".");
const server = require("http").Server(app);

const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });

wss.on("connection", socket => {
	socket.onmessage = event => {
		console.log(`Message Received: ${event.data}`);

		if (event.data === "ping") {
			socket.send(JSON.stringify("pong"));
		}
	};
});

// (+ button on card will make a post request)
// When you pop up a new card I can make a post request for the new card
// and grab the id every subsequent edit (onClick save) on the card is a put request
// same for all other components

// Client makes post request
// ie: /api/lecture/new
// When resolving the promise for db query
// I want the new records data and I want to send it to all clients
// wss.send.toAllClients((type, data));
// With type of data being changed and the data

// PUT /topic/
// updateTopicCard();

// PUT /quiz/
// updateQuizCard();

// POST /topic/reaction
// updateTopicReaction();

// POST /topic/response
// updateTopicResponse();

// POST /quiz/response
// updateQuizResponse();

if (ENV === "development" || ENV === "test") {
	app.use("/api/db", dbRoutes(db));
}

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT} in ${ENV} mode`);
});
