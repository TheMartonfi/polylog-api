const router = require("express").Router();

module.exports = db => {
	router.get("/user", (req, res) => {
		console.log(req.body);
		db.query(
			`
      SELECT
        users.first_name,
        users.last_name,
        users.email,
        users.password
      FROM users
      WHERE users.id = $1
    `,
			// When the front end makes a request make it send a respond that gives me a user.id
			[1]
		).then(({ rows: user }) => res.json(user[0]));
	});
	return router;
};
