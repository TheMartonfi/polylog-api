const router = require("express").Router();

module.exports = db => {
	router.get("/cards", (req, res) => {
		db.query(
			`
      SELECT
        topic_cards.title,
        topic_cards.description,
        topic_cards.position
      FROM topic_cards
      WHERE topic_cards.lecture_id = $1
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			["4f7f1639-95b5-4950-b5f2-93d8159c0253"]
		).then(({ rows: cards }) => res.json(cards));
	});
	return router;
};
