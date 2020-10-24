const router = require("express").Router();

module.exports = db => {
	router.get("/reactions", (req, res) => {
		db.query(
			`
      SELECT
        topic_reactions.reaction
      FROM topic_reactions
      WHERE topic_reactions.topic_card_id = $1
      AND topic_reactions.session_id = $2
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[1, "92a8b77c-ad8e-446b-8ddf-f1fe4ff8f854"]
		).then(({ rows: reactions }) => res.json(reactions));
	});
	return router;
};
