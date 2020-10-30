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

	// SELECT sessions.created_at FROM sessions
	// WHERE sessions.lecture_id = 1
	// ORDER BY sessions.created_at;

	// SELECT COUNT(*) FROM sessions
	// WHERE sessions.lecture_id = 1;

	// SELECT COUNT(*) FROM attendees
	// JOIN sessions ON sessions.id = attendees.session_id
	// JOIN lectures ON lectures.id = sessions.lecture_id;

	// SELECT AVG(attendees.count) AS attendees_avg
	// FROM (
	// SELECT COUNT(*)
	// FROM attendees
	// JOIN sessions ON sessions.id = attendees.session_id
	// JOIN lectures ON lectures.id = sessions.lecture_id
	// WHERE lectures.id = 1
	// GROUP BY attendees.session_id
	// 	) AS attendees;

	// SELECT COUNT(*) FROM topic_reactions
	// JOIN topic_cards
	// ON topic_cards.id = topic_reactions.topic_card_id
	// WHERE topic_reactions.reaction = true
	// AND topic_cards.lecture_id = 1;

	// SELECT COUNT(*) FROM topic_reactions
	// JOIN topic_cards
	// ON topic_cards.id = topic_reactions.topic_card_id
	// WHERE topic_reactions.reaction = false
	// AND topic_cards.lecture_id = 1;

	// SELECT COUNT(*) FROM topic_responses
	// JOIN topic_cards
	// ON topic_cards.id = topic_responses.topic_card_id
	// WHERE topic_responses.type = 'question'
	// AND topic_cards.lecture_id = 1;

	// SELECT COUNT(*) FROM topic_responses
	// JOIN topic_cards
	// ON topic_cards.id = topic_responses.topic_card_id
	// WHERE topic_responses.type = 'answer'
	// AND topic_cards.lecture_id = 2;

	// SELECT COUNT(*) FROM topic_responses
	// JOIN topic_cards
	// ON topic_cards.id = topic_responses.topic_card_id
	// WHERE topic_responses.type = 'comment'
	// AND topic_cards.lecture_id = 2;

	// 	SELECT COUNT(*) FROM quiz_cards
	// WHERE quiz_cards.lecture_id = 1;

	// SELECT DISTINCT quiz_responses.id, quiz_answers.correct FROM quiz_responses
	// JOIN quiz_answers
	// ON quiz_answers.id = quiz_responses.quiz_answer_id
	// JOIN quiz_cards ON quiz_cards.id = quiz_responses.quiz_card_id
	// WHERE quiz_cards.lecture_id = 1
	// AND quiz_answers.correct = true;

	// SELECT DISTINCT quiz_responses.id, quiz_answers.correct FROM quiz_responses
	// JOIN quiz_answers
	// ON quiz_answers.id = quiz_responses.quiz_answer_id
	// JOIN quiz_cards ON quiz_cards.id = quiz_responses.quiz_card_id
	// WHERE quiz_cards.lecture_id = 1
	// AND quiz_answers.correct = false;

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
