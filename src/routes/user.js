const router = require("express").Router();

module.exports = db => {
	router.get("/", (req, res) => {
		db.query(
			`
      SELECT
        users.first_name,
        users.last_name,
        users.email,
        users.password
      FROM users
      WHERE users.id = $1::integer
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[1]
		).then(({ rows: user }) => res.json(user[0]));
	});

	router.post("/new", (req, res) => {
		db.query(
			`
      INSERT INTO users (
        first_name,
        last_name,
        email,
        password
      )
      
      VALUES ($1::text, $2::text, $3:text, $4::text)
      RETURNING *;
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[]
		).then(({ rows: user }) => res.json(user));
	});

	return router;
};
