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

const updateTopicCard = (topic_card_id, title, description, position) => {
	wss.clients.forEach(function eachClient(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					type: "SET_TOPIC_CARD",
					topic_card_id,
					title,
					description,
					position
				})
			);
		}
	});
};

const updateTopicResponse = (topic_card_id, student_id, type, response) => {
	wss.clients.forEach(function eachClient(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					type: "SET_TOPIC_RESPONSE",
					topic_card_id,
					student_id,
					type,
					response
				})
			);
		}
	});
};

const updateTopicReaction = (topic_card_id, student_id, reaction) => {
	wss.clients.forEach(function eachClient(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					type: "SET_TOPIC_REACTION",
					topic_card_id,
					student_id,
					reaction
				})
			);
		}
	});
};

const updateQuizCard = (quiz_card_id, title, position) => {
	wss.clients.forEach(function eachClient(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					type: "SET_QUIZ_CARD",
					quiz_card_id,
					title,
					position
				})
			);
		}
	});
};

const updateQuizQuestion = (quiz_card_id, quiz_question_id, question) => {
	wss.clients.forEach(function eachClient(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					type: "SET_QUIZ_QUESTION",
					quiz_card_id,
					quiz_question_id,
					question
				})
			);
		}
	});
};

const updateQuizAnswer = (
	quiz_question_id,
	quiz_answer_id,
	answer,
	correct
) => {
	wss.clients.forEach(function eachClient(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					type: "SET_QUIZ_ANSWER",
					quiz_question_id,
					quiz_answer_id,
					answer,
					correct
				})
			);
		}
	});
};

const updateQuizResponse = (quiz_card_id, student_id, quiz_answer_id) => {
	wss.clients.forEach(function eachClient(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					type: "SET_QUIZ_RESPONSE",
					quiz_card_id,
					student_id,
					quiz_answer_id
				})
			);
		}
	});
};

if (ENV === "development" || ENV === "test") {
	app.use("/api/db", dbRoutes(db));
}

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT} in ${ENV} mode`);
});

module.exports = {
	updateTopicCard,
	updateQuizCard,
	updateQuizQuestion,
	updateQuizAnswer,
	updateTopicResponse,
	updateTopicReaction,
	updateQuizResponse
};
