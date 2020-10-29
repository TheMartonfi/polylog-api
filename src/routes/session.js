const router = require("express").Router();

module.exports = db => {
	router.get("/:id", (req, res) => {
		db.query(
			`
			SELECT
				sessions.id,
        sessions.created_at,
        sessions.start_time,
        sessions.end_time
      FROM sessions
      WHERE sessions.lecture_id = $1::integer
    `,
			[req.params.id]
		).then(({ rows: sessions }) => res.json(sessions));
	});

	router.post("/", (req, res) => {
		db.query(
			`
      INSERT INTO sessions (
        lecture_id,
        created_at,
        start_time
      )

      VALUES ($1::integer, CURRENT_TIMESTAMP, CURRENT_TIME)
      RETURNING *;
    `,
			[req.body.lecture_id]
		).then(({ rows: sessions }) => {
			const [session] = sessions;
			res.json(session);
		});
	});

	router.put("/:uuid", (req, res) => {
		db.query(
			`
      UPDATE sessions
      SET end_time = CURRENT_TIME
			WHERE sessions.id = $1::uuid
    `,
			[req.params.uuid]
		).then(({ rows: sessions }) => {
			const [session] = sessions;
			res.json(session);
		});
	});

	return router;
};
