const router = require("express").Router();

module.exports = db => {
	router.get("/lectures", (req, res) => {
		console.log(req.body);
		db.query(
			`
      SELECT
        lectures.id,
        lectures.title,
        lectures.description
      FROM lectures
      WHERE lecturer_id = $1
    `,
			// When the front end makes a request make it send a respond that gives me a user.id
			[1]
		).then(({ rows: lectures }) => res.json(lectures));
	});
	return router;
};
