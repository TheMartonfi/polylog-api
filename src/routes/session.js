const router = require("express").Router();

module.exports = db => {
	router.get("/", (req, res) => {
		db.query(
			`
      SELECT
        sessions.created_at,
        sessions.start_time,
        sessions.end_time
      FROM sessions
      WHERE sessions.id = $1::uuid
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			["4a115ab1-c845-412a-b868-531cf505bf45"]
		).then(({ rows: session }) => res.json(session));
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
			// When the front end makes a request make it send a response that gives me the conditions
			[1]
		).then(({ rows: session }) => res.json(session));
	});

	router.put("/", (req, res) => {
		db.query(
			`
      UPDATE sessions
      SET end_time = CURRENT_TIME
      WHERE sessions.id = $1::uuid
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[]
		).then(({ rows: session }) => res.json(session));
	});

	return router;
};
