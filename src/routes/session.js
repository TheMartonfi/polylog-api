const router = require("express").Router();

module.exports = db => {
	router.get("/:id", (req, res) => {
		// Refactor this to Promise.all
		// ElephantSQL which hosts our databse doesn't allow for more than 5 connections
		db.query(
			`
			SELECT sessions.created_at FROM sessions
			WHERE sessions.lecture_id = $1::integer
			ORDER BY sessions.created_at;
    `,
			[req.params.id]
		).then(({ rows: startDates }) => {
			const [created_at] = startDates;
			db.query(
				`
				SELECT COUNT(*) AS sessions_count FROM sessions
				WHERE sessions.lecture_id = $1::integer;
			`,
				[req.params.id]
			).then(({ rows: sessions_count }) => {
				const [session_count] = sessions_count;
				db.query(
					`
					SELECT COUNT(*) AS attendees_count FROM attendees
					JOIN sessions ON sessions.id = attendees.session_id
					JOIN lectures ON lectures.id = sessions.lecture_id
					WHERE lectures.id = $1::integer
				`,
					[req.params.id]
				).then(({ rows: attendees_count }) => {
					const [attendee_count] = attendees_count;
					db.query(
						`
						SELECT AVG(attendees.count) AS attendees_avg
						FROM (
						SELECT COUNT(*)
						FROM attendees
						JOIN sessions ON sessions.id = attendees.session_id
						JOIN lectures ON lectures.id = sessions.lecture_id
						WHERE lectures.id = $1::integer
						GROUP BY attendees.session_id
							) AS attendees;
					`,
						[req.params.id]
					).then(({ rows: attendees_avg }) => {
						const [attendee_avg] = attendees_avg;
						db.query(
							`
							SELECT COUNT(*) AS positive_reactions_count
							FROM topic_reactions
							JOIN topic_cards
							ON topic_cards.id = topic_reactions.topic_card_id
							WHERE topic_reactions.reaction = true
							AND topic_cards.lecture_id = $1::integer;
						`,
							[req.params.id]
						).then(({ rows: positive_reactions_count }) => {
							const [positive_reaction_count] = positive_reactions_count;

							db.query(
								`
								SELECT COUNT(*) negative_reactions_count
								FROM topic_reactions
								JOIN topic_cards
								ON topic_cards.id = topic_reactions.topic_card_id
								WHERE topic_reactions.reaction = false
								AND topic_cards.lecture_id = $1::integer;
							`,
								[req.params.id]
							).then(({ rows: negative_reactions_count }) => {
								const [negative_reaction_count] = negative_reactions_count;
								db.query(
									`
									SELECT COUNT(*) AS questions_count
									FROM topic_responses
									JOIN topic_cards
									ON topic_cards.id = topic_responses.topic_card_id
									WHERE topic_responses.type = 'question'
									AND topic_cards.lecture_id = $1::integer;
								`,
									[req.params.id]
								).then(({ rows: questions_count }) => {
									const [question_count] = questions_count;
									db.query(
										`
										SELECT COUNT(*) AS answers_count
										FROM topic_responses
										JOIN topic_cards
										ON topic_cards.id = topic_responses.topic_card_id
										WHERE topic_responses.type = 'answer'
										AND topic_cards.lecture_id = $1::integer;
									`,
										[req.params.id]
									).then(({ rows: answers_count }) => {
										const [answer_count] = answers_count;
										db.query(
											`
											SELECT COUNT(*) AS comments_count
											FROM topic_responses
											JOIN topic_cards
											ON topic_cards.id = topic_responses.topic_card_id
											WHERE topic_responses.type = 'comment'
											AND topic_cards.lecture_id = $1::integer;
										`,
											[req.params.id]
										).then(({ rows: comments_count }) => {
											const [comment_count] = comments_count;
											db.query(
												`
												SELECT COUNT(*) AS quiz_cards_count
												FROM quiz_cards
												WHERE quiz_cards.lecture_id = $1::integer;
											`,
												[req.params.id]
											).then(({ rows: quiz_cards_count }) => {
												const [quiz_card_count] = quiz_cards_count;
												db.query(
													`
													SELECT DISTINCT COUNT(quiz_responses.id) AS quiz_correct_count, quiz_answers.correct
													FROM quiz_responses
													JOIN quiz_answers
													ON quiz_answers.id = quiz_responses.quiz_answer_id
													JOIN quiz_cards ON quiz_cards.id = quiz_responses.quiz_card_id
													WHERE quiz_cards.lecture_id = $1::integer
													AND quiz_answers.correct = true
													GROUP BY quiz_answers.correct;
												`,
													[req.params.id]
												).then(({ rows: quiz_corrects_count }) => {
													const [quiz_correct_count] = quiz_corrects_count;
													db.query(
														`
														SELECT DISTINCT COUNT(quiz_responses.id) AS quiz_incorrect_count, quiz_answers.correct
														FROM quiz_responses
														JOIN quiz_answers
														ON quiz_answers.id = quiz_responses.quiz_answer_id
														JOIN quiz_cards ON quiz_cards.id = quiz_responses.quiz_card_id
														WHERE quiz_cards.lecture_id = $1::integer
														AND quiz_answers.correct = false
														GROUP BY quiz_answers.correct;
													`,
														[req.params.id]
													).then(({ rows: quiz_incorrects_count }) => {
														const [
															quiz_incorrect_count
														] = quiz_incorrects_count;
														res.json({
															...created_at,
															...session_count,
															...attendee_count,
															...attendee_avg,
															...positive_reaction_count,
															...negative_reaction_count,
															...question_count,
															...answer_count,
															...comment_count,
															...quiz_card_count,
															...quiz_correct_count,
															...quiz_incorrect_count
														});
													});
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});
	});

	router.get("/:id/lecture", (req, res) => {
		db.query(
			`
			SELECT
				sessions.lecture_id AS id,
				lectures.lecturer_id,
				lectures.title,
				lectures.description
			FROM sessions
			JOIN lectures ON lectures.id = sessions.lecture_id
			WHERE sessions.id = $1::uuid
		`,
			[req.params.id]
		).then(({ rows: sessions }) => {
			const [session] = sessions;
			res.json(session);
		});
	});

	// This counts lecturers as attendees not sure if it matters
	router.post("/attendee", (req, res) => {
		db.query(
			`
			SELECT
			attendees.student_id
			FROM attendees
			WHERE attendees.session_id = $1::uuid
		`,
			[req.body.session_id]
		).then(({ rows: attendees }) => {
			!attendees.find(
				attendee => attendee.student_id === req.body.student_id
			) &&
				db
					.query(
						`
				INSERT INTO attendees (
					student_id,
					session_id
				)

				VALUES($1::integer, $2::uuid)
			`,
						[req.body.student_id, req.body.session_id]
					)
					.then(() => res.status(204).json({}));
		});
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
      RETURNING sessions.id;
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
