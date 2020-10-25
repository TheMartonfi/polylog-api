const router = require("express").Router();

module.exports = db => {
	router.post("/response", (req, res) => {
		db.query(
			`
      INSERT INTO topic_responses (
        topic_card_id,
        session_id,
        student_id,
        type,
        response
      )
      
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[]
		).then(({ rows: responses }) => res.json(responses));
	});
	return router;
};
