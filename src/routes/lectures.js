const router = require("express").Router();

module.exports = db => {
	router.get("/lectures", (req, res) => {
		db.query(
			`
      SELECT
        lectures.id,
        lectures.title,
        lectures.description
      FROM lectures
      WHERE lecturer_id = $1
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[1]
		).then(({ rows: lectures }) => res.json(lectures));
	});
	return router;
};
