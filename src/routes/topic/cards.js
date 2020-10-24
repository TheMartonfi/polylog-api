const router = require("express").Router();

const parseCards = cards => {
	//
};

module.exports = db => {
	router.get("/cards", (req, res) => {
		db.query(
			`
			SELECT
				topic_cards.id,
        topic_cards.title,
				topic_cards.description,
				topic_responses.type,
        topic_responses.response,
				topic_reactions.reaction,
        topic_cards.position
			FROM topic_cards
			JOIN topic_responses ON topic_cards.id = topic_responses.topic_card_id
			JOIN topic_reactions ON topic_cards.id = topic_reactions.topic_card_id
      WHERE topic_cards.lecture_id = $1
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			["4f7f1639-95b5-4950-b5f2-93d8159c0253"]
		).then(({ rows: cards }) => res.json(cards));
	});
	return router;
};

// [
// 	{
// 		id,
// 		title,
// 		description,
// 		content: {
// 			responses: [{ type: "question", response: "How?" }],
// 			reactions: [true, false]
// 		},
// 		position
// 	}
// ];
