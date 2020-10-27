const router = require("express").Router();

module.exports = db => {
	router.get("/:id", (req, res) => {
		db.query(
			`
      SELECT
        lectures.id,
        lectures.title,
        lectures.description
      FROM lectures
      WHERE lecturer_id = $1::integer
    `,
			[req.params.id]
		).then(({ rows: lectures }) => res.json(lectures));
	});

	router.post("/", (req, res) => {
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
			[req.body.lecturer_id, req.body.title, req.body.description]
		).then(() => res.status(204).json({}));
	});

	router.put("/:id", (req, res) => {
		db.query(
			`
        UPDATE lectures
        SET title = $1::text, description = $2::text
        WHERE lectures.id = $3::integer
        RETURNING *;
      `,
			// When the front end makes a request make it send a response that gives me the conditions
			[req.body.title, req.body.description, req.params.id]
		).then(() => res.status(204).json({}));
	});

	router.delete("/:id", (req, res) => {
		db.query(
			`
        DELETE FROM lectures
        WHERE lectures.id = $1::integer
        RETURNING *;
      `,
			// When the front end makes a request make it send a response that gives me the conditions
			[req.params.id]
		).then(({ rows: lecture }) => res.json(lecture));
	});

	return router;
};
