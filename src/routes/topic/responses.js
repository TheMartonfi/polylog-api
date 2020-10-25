const router = require("express").Router();
const { parseResponses } = require("./helpers");

module.exports = db => {
	router.get("/responses", (req, res) => {
		db.query(
			`
      SELECT
      topic_responses.id AS topic_response_id,
      topic_responses.type,
      topic_responses.response,
      topic_reactions.student_id,
      topic_reactions.id AS topic_reaction_id,
      topic_reactions.reaction
      FROM topic_responses
      JOIN topic_reactions ON $1 = topic_reactions.topic_card_id
      WHERE topic_responses.topic_card_id = $1
      AND topic_responses.session_id = $2
      AND topic_reactions.session_id = $2
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[1, "92a8b77c-ad8e-446b-8ddf-f1fe4ff8f854"]
		).then(({ rows: responses }) => res.json(parseResponses(responses)));
	});
	return router;
};
