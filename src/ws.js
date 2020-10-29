const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3002 });

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

const newTopicCard = (
	topic_card_id,
	lecture_id,
	title,
	description,
	position
) => {
	wss.clients.forEach(function eachClient(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					type: "NEW_TOPIC_CARD",
					topic_card_id,
					lecture_id,
					title,
					description,
					position
				})
			);
		}
	});
};

const editTopicCard = (topic_card_id, title, description, position) => {
	wss.clients.forEach(function eachClient(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					type: "EDIT_TOPIC_CARD",
					topic_card_id,
					title,
					description,
					position
				})
			);
		}
	});
};

const deleteTopicCard = topic_card_id => {
	wss.clients.forEach(function eachClient(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					type: "DELETE_TOPIC_CARD",
					topic_card_id
				})
			);
		}
	});
};

const newTopicResponse = (
	topic_response_id,
	topic_card_id,
	student_id,
	responseType,
	response
) => {
	wss.clients.forEach(function eachClient(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					type: "NEW_TOPIC_RESPONSE",
					topic_response_id,
					topic_card_id,
					student_id,
					responseType,
					response
				})
			);
		}
	});
};

const newTopicReaction = (
	topic_reaction_id,
	topic_card_id,
	student_id,
	reaction
) => {
	wss.clients.forEach(function eachClient(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					type: "NEW_TOPIC_REACTION",
					topic_reaction_id,
					topic_card_id,
					student_id,
					reaction
				})
			);
		}
	});
};

const newQuizCard = (quiz_card_id, lecture_id, title, position) => {
	wss.clients.forEach(function eachClient(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					type: "NEW_QUIZ_CARD",
					quiz_card_id,
					lecture_id,
					title,
					position
				})
			);
		}
	});
};

const newQuizQuestion = (quiz_card_id, quiz_question_id, question) => {
	wss.clients.forEach(function eachClient(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					type: "NEW_QUIZ_QUESTION",
					quiz_card_id,
					quiz_question_id,
					question
				})
			);
		}
	});
};

const newQuizAnswer = (
	quiz_card_id,
	quiz_question_id,
	quiz_answer_id,
	answer,
	correct
) => {
	wss.clients.forEach(function eachClient(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					type: "NEW_QUIZ_ANSWER",
					quiz_card_id,
					quiz_question_id,
					quiz_answer_id,
					answer,
					correct
				})
			);
		}
	});
};

const newQuizResponse = (
	quiz_response_id,
	quiz_card_id,
	quiz_question_id,
	student_id,
	quiz_answer_id
) => {
	wss.clients.forEach(function eachClient(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					type: "NEW_QUIZ_RESPONSE",
					quiz_response_id,
					quiz_card_id,
					quiz_question_id,
					quiz_answer_id,
					student_id
				})
			);
		}
	});
};

const editQuizCard = (quiz_card_id, title, position) => {
	wss.clients.forEach(function eachClient(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					type: "EDIT_QUIZ_CARD",
					quiz_card_id,
					title,
					position
				})
			);
		}
	});
};

const editQuizQuestion = (quiz_card_id, quiz_question_id, question) => {
	wss.clients.forEach(function eachClient(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					type: "EDIT_QUIZ_QUESTION",
					quiz_card_id,
					quiz_question_id,
					question
				})
			);
		}
	});
};

// Export a function that sets up the websocket and returns wss
// So you can move all these functions into different files

module.exports = {
	newTopicCard,
	newTopicResponse,
	newTopicReaction,
	editTopicCard,
	deleteTopicCard,
	newQuizCard,
	newQuizQuestion,
	newQuizAnswer,
	newQuizResponse,
	editQuizCard,
	editQuizQuestion
};
