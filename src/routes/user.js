const router = require("express").Router();

module.exports = db => {
	router.get("/:id", (req, res) => {
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
			[req.params.id]
		).then(({ rows: users }) => {
			const [user] = users;
			res.json(user);
		});
	});

	router.post("/", (req, res) => {
		db.query(
			`
		  INSERT INTO users (
		    first_name,
		    last_name,
		    email,
		    password
		  )

		  VALUES ($1::text, $2::text, $3::text, $4::text)
		  RETURNING *;
		`,
			[
				req.body.first_name,
				req.body.last_name,
				req.body.email,
				req.body.password
			]
		).then(({ rows: users }) => {
			const [user] = users;
			res.json(user);
		});
	});

	return router;
};
