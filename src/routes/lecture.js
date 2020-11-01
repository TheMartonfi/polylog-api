const router = require("express").Router();

module.exports = db => {
	router.get("/:id", (req, res) => {
		db.query(
			`
      SELECT
				lectures.id,
				lectures.lecturer_id,
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
		  RETURNING lectures.id, lectures.lecturer_id;
		`,
			[req.body.lecturer_id, req.body.title, req.body.description]
		).then(({ rows: lectures }) => {
			const [lecture] = lectures;
			res.json(lecture);
		});
	});

	router.put("/:id", (req, res) => {
		db.query(
			`
        UPDATE lectures
        SET title = $1::text, description = $2::text
        WHERE lectures.id = $3::integer
      `,
			[req.body.title, req.body.description, req.params.id]
		).then(() => res.status(204).json({}));
	});

	router.delete("/:id", (req, res) => {
		db.query(
			`
        DELETE FROM lectures
        WHERE lectures.id = $1::integer
      `,
			[req.params.id]
		).then(() => res.status(204).json({}));
	});

	return router;
};
