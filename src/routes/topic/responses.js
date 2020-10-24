const router = require("express").Router();

module.exports = db => {
	router.get("/responses", (req, res) => {
		db.query(
			`
      SELECT
        topic_responses.type,
        topic_responses.response
      FROM topic_responses
      WHERE topic_responses.topic_card_id = $1
      AND topic_responses.session_id = $2
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[1, "92a8b77c-ad8e-446b-8ddf-f1fe4ff8f854"]
		).then(({ rows: responses }) => res.json(responses));
	});
	return router;
};
