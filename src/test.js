const { wss } = require("ws");

console.log(wss);

const updateTopicCard = (topic_card_id, title, description, position) => {
	wss.clients.forEach(function eachClient(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					type: "NEW_TOPIC_CARD",
					topic_card_id,
					title,
					description,
					position
				})
			);
		}
	});
};

module.exports = updateTopicCard;
