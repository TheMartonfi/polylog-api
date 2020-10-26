const router = require("express").Router();

module.exports = db => {
	router.get("/", (req, res) => {
		db.query(
			`
      SELECT
        lectures.id,
        lectures.title,
        lectures.description
      FROM lectures
      WHERE lecturer_id = $1::integer
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[1]
		).then(({ rows: lectures }) => res.json(lectures));
	});

	router.post("/new", (req, res) => {
		db.query(
			`
      INSERT INTO lectures (
        lecturer_id,
        title,
        description
      
      )
      VALUES ($1::integer, $2::text, $3::text)
      RETURNING *;
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[]
		).then(({ rows: responses }) => res.json(responses));

		router.put("/", (req, res) => {
			db.query(
				`
        UPDATE lectures
        SET title = $1::text, description = $2::text
        WHERE lectures.id = $3::integer
        RETURNING *;
      `,
				// When the front end makes a request make it send a response that gives me the conditions
				[]
			).then(({ rows: lecture }) => res.json(lecture));
		});

		router.delete("/", (req, res) => {
			db.query(
				`
        DELETE FROM lectures
        WHERE lectures.id = $1::integer
        RETURNING *;
      `,
				// When the front end makes a request make it send a response that gives me the conditions
				[]
			).then(({ rows: lecture }) => res.json(lecture));
		});
	});

	return router;
};
