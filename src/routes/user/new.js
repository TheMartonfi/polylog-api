const router = require("express").Router();

module.exports = db => {
	router.post("/new", (req, res) => {
		db.query(
			`
      INSERT INTO users (
        first_name,
        last_name,
        email,
        password
      )
      
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[]
		).then(({ rows: responses }) => res.json(responses));
	});
	return router;
};
